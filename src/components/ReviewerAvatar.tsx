import Image from "next/image";
import type { Testimonial } from "@/lib/site";

/**
 * Reviewer portrait, with a neutral initials fallback for reviewers whose photo
 * has not been confirmed — better an initial than the wrong person's face
 * against their words.
 */
export default function ReviewerAvatar({
  person,
  size = 40,
}: {
  person: Testimonial;
  size?: number;
}) {
  const initials = person.name
    .replace(/^Dr\.\s*/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return (
    <span
      className="relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[color:var(--color-tint)]"
      style={{ width: size, height: size }}
    >
      {person.image ? (
        <Image
          src={person.image}
          alt={person.name}
          fill
          loading="lazy"
          sizes={`${size}px`}
          className="object-cover"
        />
      ) : (
        <span
          aria-hidden="true"
          className="font-mono text-[0.625rem] font-semibold uppercase tracking-[0.06em] text-[color:var(--color-burgundy)]"
        >
          {initials}
        </span>
      )}
    </span>
  );
}
