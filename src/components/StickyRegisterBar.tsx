"use client";

import { useEffect, useState } from "react";

/**
 * Persistent register CTA for campaign traffic.
 *
 * Shown only when neither the hero button nor the form is on screen — a
 * floating CTA competing with a visible one is clutter.
 *
 * Uses a passive, rAF-throttled scroll listener rather than IntersectionObserver.
 * Two separate observer implementations here fired once and then went silent on
 * re-entry, leaving the bar stuck visible; for a single boolean derived from two
 * element positions, measuring directly is both cheaper to reason about and
 * reliable. The rAF guard means at most one measurement per frame.
 */
export default function StickyRegisterBar({
  heroId,
  formId,
  label,
}: {
  heroId: string;
  formId: string;
  label: string;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScreen = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return r.bottom > 0 && r.top < window.innerHeight;
    };

    const measure = () => {
      frame = 0;
      setShow(!onScreen(heroId) && !onScreen(formId));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [heroId, formId]);

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 p-4 transition-all duration-300 md:hidden ${
        show ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
      }`}
    >
      <a
        href={`#${formId}`}
        tabIndex={show ? undefined : -1}
        aria-hidden={show ? undefined : true}
        className={`btn btn-primary w-full shadow-[0_6px_28px_rgba(20,20,20,0.22)] ${
          show ? "pointer-events-auto" : ""
        }`}
      >
        {label}
      </a>
    </div>
  );
}
