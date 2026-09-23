"use client";

import { useState } from "react";
import ReviewerAvatar from "./ReviewerAvatar";
import { testimonials } from "@/lib/site";

/**
 * Testimonials, one at a time.
 *
 * A card row does not suit this content: the quotes run from 18 to 90 words, so
 * equal-height cards leave voids and natural heights end raggedly. Showing one
 * at a time lets each quote set at a readable size regardless of length.
 *
 * Every quote stays in the DOM — inactive ones are stacked in the same grid cell
 * and hidden with `visibility`, not unmounted. That keeps all six crawlable and
 * makes the container as tall as the longest, so switching never shifts layout.
 */
export default function TestimonialFeature() {
  const [active, setActive] = useState(0);

  const step = (dir: 1 | -1) =>
    setActive((i) => (i + dir + testimonials.length) % testimonials.length);

  return (
    <div>
      <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end md:gap-14">
        <div className="grid">
          {testimonials.map((t, i) => (
            <figure
              key={t.name}
              className="col-start-1 row-start-1 transition-opacity duration-500"
              style={{
                opacity: i === active ? 1 : 0,
                visibility: i === active ? "visible" : "hidden",
              }}
              aria-hidden={i === active ? undefined : true}
            >
              <span
                aria-hidden="true"
                className="block font-serif text-[4rem] leading-[0.6] text-[color:var(--color-accent)]"
              >
                &rdquo;
              </span>

              <blockquote className="mt-6 max-w-[54ch] text-[1.0625rem] leading-relaxed text-white/90 md:text-[1.25rem] md:leading-[1.6]">
                {t.quote}
              </blockquote>

              <figcaption className="mt-7 flex items-center gap-3">
                <ReviewerAvatar person={t} size={48} />
                <span className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-white/70">
                  {t.name}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Arrows sit beside the quote on desktop, below it on mobile. */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Previous testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-lg text-white transition-colors hover:border-white"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Next testimonial"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-lg text-[color:var(--color-ink)] transition-colors hover:bg-[color:var(--color-tint)]"
          >
            ›
          </button>
        </div>
      </div>

      {/* Avatar rail doubles as the index — who else has spoken, and the control. */}
      <ul className="mt-10 flex flex-wrap gap-3 border-t border-white/10 pt-7">
        {testimonials.map((t, i) => (
          <li key={t.name}>
            <button
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Show testimonial from ${t.name}`}
              aria-current={i === active ? "true" : undefined}
              className={`block rounded-full ring-2 transition-all ${
                i === active
                  ? "ring-[color:var(--color-accent)] opacity-100"
                  : "opacity-45 ring-transparent hover:opacity-80"
              }`}
            >
              <ReviewerAvatar person={t} size={44} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
