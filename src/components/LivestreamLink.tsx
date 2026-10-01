"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { currentSession, liveState, type LiveState } from "@/lib/sessions";

/**
 * Link to /livestream from the Insight Room page.
 *
 * The page is statically rendered and revalidates hourly, so whether the stream
 * is open is decided here in the browser, re-checked every 30 seconds. Once the
 * stream opens (an hour before the start) the link becomes a call to action;
 * before that it stays a quieter, still-working link.
 *
 * `variant="banner"` renders nothing until the stream opens — it is the
 * above-the-fold prompt for visitors arriving on the day.
 */
export default function LivestreamLink({ variant = "card" }: { variant?: "card" | "banner" }) {
  // "waiting" on both server and client so hydration matches; the effect then
  // reads the real clock.
  const [state, setState] = useState<LiveState>("waiting");

  useEffect(() => {
    const check = () => setState(liveState(currentSession()));
    check();
    const id = window.setInterval(check, 30_000);
    return () => window.clearInterval(id);
  }, []);

  const live = state === "live";
  const dot = (
    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
    </span>
  );

  if (variant === "banner") {
    if (state === "waiting") return null;
    return (
      <Link
        href="/livestream"
        className="mb-6 flex items-center gap-3 rounded-[var(--radius-card)] bg-[color:var(--color-burgundy)] px-5 py-4 text-white transition-colors hover:bg-[color:var(--color-burgundy-hover)]"
      >
        {dot}
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.14em]">
          {live ? "Live now" : "Starting soon"}
        </span>
        <span className="text-[0.9375rem]">
          {live ? "The Insight Room is on — watch live →" : "The stream is open — take your seat →"}
        </span>
      </Link>
    );
  }

  return state !== "waiting" ? (
    <Link href="/livestream" className="btn btn-invert gap-3">
      {dot}
      {live ? "Live now — watch here" : "Stream open — watch here"}
    </Link>
  ) : (
    <Link
      href="/livestream"
      className="text-[0.9375rem] text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white hover:decoration-white"
    >
      Watch live — opens an hour before
    </Link>
  );
}
