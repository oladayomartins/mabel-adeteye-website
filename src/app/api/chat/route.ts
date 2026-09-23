import { NextResponse } from "next/server";
import { SYSTEM_PROMPT } from "@/lib/knowledge";

/**
 * Chat endpoint for the site assistant.
 *
 * Runs server-side so GEMINI_API_KEY never reaches the browser. The key has no
 * NEXT_PUBLIC_ prefix precisely so Next cannot inline it into the bundle — the
 * repository is public, and this key authorises billable calls.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Overridable, because Google retires model ids on a short cycle — two were
 * already 404ing with "no longer available" during this build. When that
 * happens the error names the replacement; set GEMINI_MODEL rather than
 * redeploying a code change.
 */
const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-3.6-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

const MAX_MESSAGE_CHARS = 600;
const MAX_HISTORY = 12;

/** Requests allowed per IP per window. */
const RATE_LIMIT = 15;
const WINDOW_MS = 10 * 60 * 1000;

/**
 * In-memory limiter. Per serverless instance rather than global, so it is a
 * speed bump against casual abuse, not a guarantee — a determined caller
 * spread across instances gets more. Swap for Vercel KV if that matters.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT) return true;

  // Opportunistic cleanup so the map cannot grow without bound.
  if (hits.size > 500) {
    for (const [key, value] of hits) if (now > value.resetAt) hits.delete(key);
  }
  return false;
}

type ClientMessage = { role: "user" | "assistant"; content: string };

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "The assistant is not configured yet." },
      { status: 503 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { error: "That is a lot of questions at once — try again in a few minutes." },
      { status: 429 },
    );
  }

  let messages: ClientMessage[];
  try {
    const body = (await request.json()) as { messages?: ClientMessage[] };
    messages = Array.isArray(body.messages) ? body.messages : [];
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const cleaned = messages
    .filter(
      (m) =>
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim(),
    )
    .slice(-MAX_HISTORY)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.slice(0, MAX_MESSAGE_CHARS) }],
    }));

  if (!cleaned.length || cleaned[cleaned.length - 1].role !== "user") {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
      body: JSON.stringify({
        contents: cleaned,
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 420,
          // gemini-3.6-flash reasons before answering and bills those tokens.
          // For a grounded FAQ assistant that is latency and cost for no gain —
          // without this, a small token budget returns empty content.
          thinkingConfig: { thinkingBudget: 0 },
        },
        safetySettings: [
          { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        ],
      }),
    });

    const data = (await res.json().catch(() => null)) as {
      candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
      error?: { message?: string };
    } | null;

    if (!res.ok || data?.error) {
      // Log for us, stay vague for the visitor — upstream messages are written
      // for developers and can leak model and account detail.
      console.error("Gemini error:", res.status, data?.error?.message);

      // 429 is the one a visitor is likely to meet: the free tier allows only a
      // handful of requests per minute, so two people at once can trip it.
      // Saying "busy" is honest and tells them retrying will work.
      if (res.status === 429) {
        return NextResponse.json(
          { error: "I am handling a few questions at once — try again in a moment." },
          { status: 429 },
        );
      }

      return NextResponse.json(
        { error: "I could not answer that just now. Please try again." },
        { status: 502 },
      );
    }

    const candidate = data?.candidates?.[0];
    const reply = candidate?.content?.parts?.map((p) => p.text ?? "").join("").trim();

    if (!reply) {
      const blocked = candidate?.finishReason === "SAFETY";
      return NextResponse.json({
        reply: blocked
          ? "I would rather not answer that. I can help with Mabel's work, mentorship or speaking — what would be useful?"
          : "I do not have that detail. You can reach Mabel directly through /bookings.",
      });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route failed:", error);
    return NextResponse.json(
      { error: "I could not answer that just now. Please try again." },
      { status: 502 },
    );
  }
}
