import Image from "next/image";
import Reveal from "./Reveal";
import { brands } from "@/lib/site";

/** One pass of the logo row. Declared at module scope, not inside render. */
function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {brands.map((brand) => (
        <li key={brand.name} className="flex items-center px-7 md:px-10">
          <span className="relative block h-10 w-[124px] shrink-0 md:w-[132px]">
            <Image
              src={brand.src}
              alt={hidden ? "" : `${brand.name} logo`}
              fill
              /* Eager, not lazy: in a continuously scrolling row every logo
                 comes into view within seconds, and lazy ones pop in blank as
                 the track moves. They are a few KB each. */
              loading="eager"
              sizes="132px"
              className={`object-contain ${brand.flatBg ? "mix-blend-darken" : ""}`}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Brand logo marquee.
 *
 * A single continuously scrolling row. The list renders twice: the first copy
 * is the real content, the second is aria-hidden padding that makes the -50%
 * translate loop seamlessly — so each brand is announced and crawled once.
 *
 * Logos are pre-trimmed to their artwork upstream (see `brands` in lib/site.ts),
 * which is what keeps them optically even in a uniform box.
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

      <div className="logo-marquee mt-6 border-t border-[color:var(--color-rule)] py-8">
        <div className="logo-marquee-track">
          <Row />
          <Row hidden />
        </div>
      </div>
    </Reveal>
  );
}
