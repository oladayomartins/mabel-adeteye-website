import { assets, person } from "@/lib/site";

/**
 * Brand loader.
 *
 * Deliberately CSS-only: the overlay is server-rendered on top of the page and
 * animates itself away, so there is no JavaScript decision, no hydration
 * mismatch, and no flash of content before it appears. It shows once per full
 * page load — client-side navigation between pages does not re-trigger it — and
 * is removed entirely for visitors who prefer reduced motion.
 */
export default function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      {/* Animated GIF: next/image would add nothing here. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={assets.loader}
        alt=""
        width={180}
        height={180}
        fetchPriority="high"
        decoding="async"
        className="h-[132px] w-[132px] object-contain md:h-[180px] md:w-[180px]"
      />
      <span className="sr-only">Loading {person.name}</span>
      <div className="mt-8 h-[2px] w-[120px] overflow-hidden rounded bg-white/25">
        <span className="loader-bar block h-full w-full origin-left bg-white" />
      </div>
    </div>
  );
}
