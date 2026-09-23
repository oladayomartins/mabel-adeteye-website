"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Horizontal carousel.
 *
 * Native scroll-snap is the mechanism: the track is a real scroller, so touch
 * swipe, trackpad, keyboard and screen-reader navigation all work for free. The
 * arrows are an enhancement layered on top — with JavaScript disabled the track
 * is still scrollable, just without buttons.
 */
export default function Carousel({
  label,
  children,
  tone = "light",
}: {
  label: string;
  children: ReactNode;
  /** "dark" for carousels sitting on an ink or burgundy band. */
  tone?: "light" | "dark";
}) {
  const track = useRef<HTMLUListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    setAtStart(el.scrollLeft < 8);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  }, []);

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    sync();
    el.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      el.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync]);

  const page = (dir: 1 | -1) => {
    const el = track.current;
    if (!el) return;
    // One card plus its gap, so a click always lands on a snap point.
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 20 : el.clientWidth;
    el.scrollBy({ left: step * dir, behavior: "smooth" });
  };

  const ghost =
    tone === "dark"
      ? "border border-white/25 text-white hover:border-white hover:text-white disabled:hover:border-white/25"
      : "border border-[color:var(--color-rule)] hover:border-[color:var(--color-burgundy)] hover:text-[color:var(--color-burgundy)] disabled:hover:border-[color:var(--color-rule)] disabled:hover:text-[color:var(--color-ink)]";

  const solid =
    tone === "dark"
      ? "bg-white text-[color:var(--color-ink)] hover:bg-[color:var(--color-tint)]"
      : "bg-[color:var(--color-burgundy)] text-white hover:bg-[color:var(--color-burgundy-hover)]";

  return (
    <div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={() => page(-1)}
          disabled={atStart}
          aria-label={`Previous ${label.toLowerCase()}`}
          className={`flex h-11 w-11 items-center justify-center rounded-full text-lg transition-colors disabled:opacity-30 ${ghost}`}
        >
          ‹
        </button>
        <button
          type="button"
          onClick={() => page(1)}
          disabled={atEnd}
          aria-label={`Next ${label.toLowerCase()}`}
          className={`flex h-11 w-11 items-center justify-center rounded-full text-lg transition-colors disabled:opacity-30 ${solid}`}
        >
          ›
        </button>
      </div>

      <ul
        ref={track}
        tabIndex={0}
        aria-label={label}
        className="mt-5 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </ul>
    </div>
  );
}
