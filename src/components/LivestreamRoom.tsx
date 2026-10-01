"use client";

import { useEffect, useState } from "react";
import { currentSession, formatSessionLong, liveState, sessionIso } from "@/lib/sessions";

/**
 * The /livestream stage: a countdown to the next session that turns into the
 * player an hour before the start, and stays up for the two-hour run.
 *
 * Everything time-dependent is computed in the browser and re-checked every
 * second — the page itself is static and only revalidates hourly, so a
 * server-rendered state could be up to an hour out of date. Before hydration
 * (`now === null`) a neutral placeholder renders, so server and client markup
 * agree.
 *
 * With no `embedUrl` (Riverside cannot be framed) the stage falls back to a
 * button that opens the Riverside studio in a new tab.
 */
export default function LivestreamRoom({
  embedUrl,
  joinUrl,
}: {
  embedUrl: string;
  joinUrl: string;
}) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return <div className="aspect-video w-full rounded-[18px] bg-[color:var(--color-ink)]" />;
  }

  const session = currentSession(now);
  const state = liveState(session, now);
  const opensAt = new Date(session.getTime() - 60 * 60 * 1000);

  if (state === "waiting") {
    return (
      <div className="flex aspect-video w-full flex-col items-center justify-center rounded-[18px] bg-[color:var(--color-ink)] p-6 text-center text-white">
        <p className="eyebrow text-[color:var(--color-accent)]">Next session</p>
        <p className="h3 mt-3">
          <time dateTime={sessionIso(session)}>{formatSessionLong(session)}</time>
        </p>
        <Countdown to={session} now={now} />
        <p className="mt-6 max-w-[40ch] text-[0.9375rem] text-white/70">
          The stream opens here at{" "}
          {opensAt
            .toLocaleTimeString("en-GB", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
              timeZone: "Africa/Lagos",
            })
            .replace(/\s?([ap])m$/i, " $1.m.")}{" "}
          WAT — an hour before the start.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {state === "live" ? (
          <>
            <LiveDot />
            <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-red-600">
              Live now
            </span>
          </>
        ) : (
          <span className="font-mono text-[0.75rem] uppercase tracking-[0.14em] text-[color:var(--color-burgundy)]">
            Starting soon · <Countdown to={session} now={now} inline />
          </span>
        )}
      </div>

      {embedUrl ? (
        <div className="aspect-video w-full overflow-hidden rounded-[18px] bg-black">
          <iframe
            src={embedUrl}
            title="MAA Insight Room livestream"
            className="h-full w-full"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="flex aspect-video w-full flex-col items-center justify-center rounded-[18px] bg-[color:var(--color-ink)] p-6 text-center text-white">
          <p className="h3">
            {state === "live" ? "The room is open" : "The room opens at 7:00 p.m. WAT"}
          </p>
          <a
            href={joinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-invert mt-6 gap-3"
          >
            {state === "live" ? <LiveDot /> : null}
            Join on Riverside
          </a>
          <p className="mt-4 text-[0.8125rem] text-white/60">Opens in a new tab.</p>
        </div>
      )}
    </div>
  );
}

function Countdown({ to, now, inline = false }: { to: Date; now: Date; inline?: boolean }) {
  const total = Math.max(0, Math.floor((to.getTime() - now.getTime()) / 1000));
  const parts = [
    { k: "days", v: Math.floor(total / 86400) },
    { k: "hrs", v: Math.floor((total % 86400) / 3600) },
    { k: "min", v: Math.floor((total % 3600) / 60) },
    { k: "sec", v: total % 60 },
  ];

  if (inline) {
    const shown = parts.slice(2).map((p) => String(p.v).padStart(2, "0"));
    return <span className="tabular-nums">{shown.join(":")}</span>;
  }

  return (
    <div className="mt-6 flex gap-4 md:gap-8" role="timer" aria-live="off">
      {parts.map((p) => (
        <div key={p.k} className="min-w-[3.5rem] text-center">
          <span className="block font-mono text-[2rem] tabular-nums md:text-[3rem]">
            {String(p.v).padStart(2, "0")}
          </span>
          <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-white/50">
            {p.k}
          </span>
        </div>
      ))}
    </div>
  );
}

function LiveDot() {
  return (
    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
    </span>
  );
}
