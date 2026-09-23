"use client";

import { useEffect, useRef, type ElementType, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Stagger in ms, for lists of sibling Reveals. */
  delay?: number;
  className?: string;
  as?: ElementType;
};

/**
 * Fades content up as it enters the viewport.
 *
 * The hidden state is applied from the effect rather than during render, so the
 * server-rendered markup is always visible — if JavaScript never runs, nothing
 * disappears. The CSS also honours prefers-reduced-motion.
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.classList.add("reveal");
    if (delay) el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("reveal-in");
        observer.disconnect();
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={className || undefined}>
      {children}
    </Tag>
  );
}
