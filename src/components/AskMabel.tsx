"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { assets, person } from "@/lib/site";

type Message = { role: "user" | "assistant"; content: string };

const OPENERS = [
  "What does Mabel do?",
  "When is the next MAA Insight Room?",
  "Can she speak at our event?",
  "How do I book a mentoring session?",
];

const GREETING =
  `Hello — I'm an AI assistant on ${person.shortName}'s site, not Mabel herself. ` +
  "Ask me about her work, mentorship, MAA Insight Room or speaking.";

export default function AskMabel() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) field.current?.focus();
  }, [open]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;

    const next: Message[] = [...messages, { role: "user", content: question }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = (await res.json().catch(() => null)) as
        | { reply?: string; error?: string }
        | null;

      if (!res.ok || !data?.reply) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply as string }]);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  /** Turns bare /paths in a reply into real links. */
  const render = (text: string) =>
    text.split(/(\/(?:about|gallery|events|mentorship|insight-room|press|bookings))\b/).map((part, i) =>
      /^\/(about|gallery|events|mentorship|insight-room|press|bookings)$/.test(part) ? (
        <a
          key={i}
          href={part}
          className="underline underline-offset-2 hover:text-[color:var(--color-burgundy)]"
        >
          {part}
        </a>
      ) : (
        part
      ),
    );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="ask-mabel-panel"
        className={`fixed bottom-4 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--color-burgundy)] text-white shadow-[0_6px_28px_rgba(20,20,20,0.28)] ring-2 ring-white/70 transition-shadow hover:shadow-[0_10px_34px_rgba(107,18,32,0.42)] ${
          open ? "" : "assistant-launcher"
        }`}
      >
        <span className="sr-only">{open ? "Close assistant" : "Ask about Mabel"}</span>

        {open ? (
          <span aria-hidden="true" className="text-2xl leading-none">
            ×
          </span>
        ) : (
          <>
            {/* Outward ping, behind the avatar. */}
            <span
              aria-hidden="true"
              className="assistant-pulse absolute inset-0 rounded-full bg-[color:var(--color-burgundy)]"
            />
            <Image
              src={assets.assistantAvatar}
              alt=""
              width={240}
              height={240}
              priority
              sizes="56px"
              className="relative h-full w-full rounded-full object-cover"
            />
          </>
        )}
      </button>

      <div
        id="ask-mabel-panel"
        hidden={!open}
        role="dialog"
        aria-label="Ask about Mabel"
        className="fixed bottom-20 right-4 z-50 flex max-h-[min(70dvh,560px)] w-[min(calc(100vw-2rem),380px)] flex-col overflow-hidden rounded-[18px] border border-[color:var(--color-rule)] bg-white shadow-[0_18px_60px_rgba(20,20,20,0.18)]"
      >
        <div className="border-b border-[color:var(--color-rule)] bg-[color:var(--color-tint)] px-5 py-4">
          <p className="eyebrow">Ask about Mabel</p>
          <p className="mt-1 text-[0.8125rem] text-[color:var(--color-muted)]">
            AI assistant · not Mabel herself
          </p>
        </div>

        <div ref={scroller} className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <p className="text-[0.875rem] leading-relaxed text-[color:var(--color-muted)]">
            {GREETING}
          </p>

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={`max-w-[85%] rounded-[14px] px-4 py-3 text-[0.875rem] leading-relaxed ${
                  m.role === "user"
                    ? "bg-[color:var(--color-burgundy)] text-white"
                    : "bg-[color:var(--color-tint)] text-[color:var(--color-ink)]"
                }`}
              >
                {m.role === "assistant" ? render(m.content) : m.content}
              </div>
            </div>
          ))}

          {busy ? (
            <p aria-live="polite" className="text-[0.8125rem] text-[color:var(--color-muted)]">
              Thinking…
            </p>
          ) : null}

          {error ? (
            <p role="alert" className="text-[0.8125rem] text-[color:var(--color-burgundy)]">
              {error}
            </p>
          ) : null}

          {!messages.length ? (
            <ul className="space-y-2 pt-1">
              {OPENERS.map((q) => (
                <li key={q}>
                  <button
                    type="button"
                    onClick={() => send(q)}
                    className="w-full rounded-[10px] border border-[color:var(--color-rule)] px-3 py-2 text-left text-[0.8125rem] transition-colors hover:border-[color:var(--color-burgundy)] hover:text-[color:var(--color-burgundy)]"
                  >
                    {q}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2 border-t border-[color:var(--color-rule)] p-3"
        >
          <label htmlFor="ask-mabel-input" className="sr-only">
            Your question
          </label>
          <input
            id="ask-mabel-input"
            ref={field}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={600}
            placeholder="Ask a question…"
            className="field !min-h-[44px] flex-1 !text-[0.875rem]"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="btn btn-primary !min-h-[44px] !px-4 !text-sm disabled:opacity-40"
          >
            Ask
          </button>
        </form>
      </div>
    </>
  );
}
