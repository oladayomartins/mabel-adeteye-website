import { pillars } from "@/lib/site";

const terms = pillars.map((p) => p.title);

/** One pass of the term list. Declared at module scope, not inside render. */
function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {terms.map((term) => (
        <li key={term} className="flex items-center whitespace-nowrap">
          <span className="px-7 py-5 text-[1.0625rem] font-semibold tracking-tight text-white md:px-10 md:text-[1.375rem]">
            {term}
          </span>
          <span aria-hidden="true" className="text-[color:var(--color-accent)]">
            ✦
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Scrolling band of practice areas.
 *
 * The list is rendered twice: the first copy is the real content, the second is
 * aria-hidden padding that makes the -50% translate loop seamlessly. Screen
 * readers and crawlers therefore encounter each term once.
 */
export default function Marquee() {
  return (
    <div className="marquee bg-[color:var(--color-burgundy)]">
      <div className="marquee-track">
        <Row />
        <Row hidden />
      </div>
    </div>
  );
}
