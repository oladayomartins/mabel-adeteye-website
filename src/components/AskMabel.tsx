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

  /**
   * On phones the panel is a full-screen sheet pinned to the *visual* viewport.
   * iOS does not shrink the layout viewport (or `dvh`) when the keyboard opens,
   * so a `bottom: 0` panel would sit behind the keyboard; tracking
   * `visualViewport` keeps the input above it without the page jumping.
   */
  const [sheet, setSheet] = useState<{ top: number; height: number } | null>(null);

  const scroller = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focusing on touch devices throws the keyboard up over the greeting and
    // openers before the visitor has read them; let them tap in instead.
    if (open && window.matchMedia("(pointer: fine)").matches) field.current?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const phone = window.matchMedia("(max-width: 639px)");
    const vv = window.visualViewport;
    let frame = 0;

    const measure = () => {
      frame = 0;
      setSheet(
        phone.matches
          ? { top: vv?.offsetTop ?? 0, height: vv?.height ?? window.innerHeight }
          : null,
      );
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    phone.addEventListener("change", schedule);
    vv?.addEventListener("resize", schedule);
    vv?.addEventListener("scroll", schedule);
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      phone.removeEventListener("change", schedule);
      vv?.removeEventListener("resize", schedule);
      vv?.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [open]);

  // The page behind a full-screen sheet must not scroll with it.
  const locked = open && sheet !== null;
  useEffect(() => {
    if (!locked) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    return () => {
      root.style.overflow = prev;
    };
  }, [locked]);

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, busy, sheet?.height]);

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
        className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 h-14 w-14 ${
          open ? "hidden sm:flex" : "flex"
        } items-center justify-center rounded-full bg-[color:var(--color-burgundy)] text-white shadow-[0_6px_28px_rgba(20,20,20,0.28)] ring-2 ring-white/70 transition-shadow hover:shadow-[0_10px_34px_rgba(107,18,32,0.42)] ${
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
        style={sheet ?? undefined}
        className="fixed inset-x-0 top-0 z-[60] flex h-dvh flex-col overflow-hidden bg-white sm:inset-x-auto sm:top-auto sm:bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.5rem)] sm:right-4 sm:h-auto sm:max-h-[min(70dvh,560px)] sm:w-[380px] sm:rounded-[18px] sm:border sm:border-[color:var(--color-rule)] sm:shadow-[0_18px_60px_rgba(20,20,20,0.18)]"
      >
        <div className="flex items-center justify-between gap-4 border-b border-[color:var(--color-rule)] bg-[color:var(--color-tint)] px-5 pb-4 pt-[max(1rem,env(safe-area-inset-top))] sm:pt-4">
          <div className="min-w-0">
            <p className="eyebrow">Ask about Mabel</p>
            <p className="mt-1 text-[0.8125rem] text-[color:var(--color-muted)]">
              AI assistant · not Mabel herself
            </p>
          </div>
          {/* On phones the sheet covers the launcher, so it carries its own close. */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="-mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-2xl leading-none text-[color:var(--color-ink)] transition-colors hover:bg-white sm:hidden"
          >
            <span className="sr-only">Close assistant</span>
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div
          ref={scroller}
          className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5"
        >
          <p className="text-[0.875rem] leading-relaxed text-[color:var(--color-muted)]">
            {GREETING}
          </p>

          {messages.map((m, i) => (
            <div
              key={i}
              className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-[14px] px-4 py-3 text-[0.875rem] leading-relaxed [overflow-wrap:anywhere] ${
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
          className="flex items-center gap-2 border-t border-[color:var(--color-rule)] p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:pb-3"
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
            enterKeyHint="send"
            autoComplete="off"
            /* 16px on phones: anything smaller makes iOS zoom the page on focus. */
            className="field !min-h-[44px] min-w-0 flex-1 sm:!text-[0.875rem]"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="btn btn-primary !min-h-[44px] shrink-0 !px-4 !text-sm disabled:opacity-40"
          >
            Ask
          </button>
        </form>
      </div>
    </>
  );
}
