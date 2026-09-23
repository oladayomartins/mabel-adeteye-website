import Image from "next/image";
import Reveal from "./Reveal";
import { brands } from "@/lib/site";

/**
 * Brand logo wall.
 *
 * Alignment comes from a single uniform box that every logo is fitted into with
 * `object-contain`, so the boxes line up on a strict grid regardless of each
 * logo's shape. Fitting to a box (rather than to a fixed height alone) also
 * keeps optical weight even: without a width cap, British Airways at 6.5:1 would
 * run five times wider than Etisalat at 0.9:1.
 *
 * The logos themselves are pre-trimmed to their artwork upstream — see `brands`
 * in lib/site.ts.
 */
export default function BrandWall({
  heading = "Brands I’ve worked with",
}: {
  heading?: string;
}) {
  return (
    <Reveal>
      <h2 id="brands-heading" className="eyebrow eyebrow-muted">
        {heading}
      </h2>
      {/* 2 / 4 / 8 columns — all divide 8 evenly, so no row is ever left short. */}
      <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 border-t border-[color:var(--color-rule)] pt-8 sm:grid-cols-4 lg:grid-cols-8">
        {brands.map((brand) => (
          <li key={brand.name} className="flex items-center justify-center">
            <span className="relative block h-10 w-[124px] md:w-[128px]">
              <Image
                src={brand.src}
                alt={`${brand.name} logo`}
                fill
                loading="lazy"
                sizes="128px"
                className="object-contain"
              />
            </span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
