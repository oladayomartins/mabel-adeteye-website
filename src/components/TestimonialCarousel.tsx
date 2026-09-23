import Carousel from "./Carousel";
import ReviewerAvatar from "./ReviewerAvatar";
import { testimonials } from "@/lib/site";

/**
 * Testimonials.
 *
 * No star ratings: these are written recommendations, not scored reviews — none
 * of them came with a rating, so displaying five stars would be inventing one.
 * The oversized quotation mark carries the card instead.
 */
export default function TestimonialCarousel() {
  // `self-start` keeps each card at its own height. Stretching them all to match
  // the longest quote leaves a large void inside the short ones.
  return (
    <Carousel label="Testimonials" tone="dark">
      {testimonials.map((t) => (
        <li key={t.name} className="w-[290px] shrink-0 snap-start self-start sm:w-[340px]">
          <figure className="flex flex-col rounded-[var(--radius-card)] bg-white/[0.06] p-6 ring-1 ring-white/10">
            <span
              aria-hidden="true"
              className="block font-serif text-[3.5rem] leading-[0.7] text-[color:var(--color-accent)]"
            >
              &rdquo;
            </span>
            <blockquote className="mt-5 text-[0.9375rem] leading-relaxed text-white/85">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
              <ReviewerAvatar person={t} />
              <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-white/55">
                {t.name}
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </Carousel>
  );
}
