import type { FaqEntry } from "@/lib/site";

/**
 * Native <details> accordion — works without JavaScript, styled to the brand
 * sheet. Answers can be prose, a bulleted list, or both.
 */
export default function Accordion({ items }: { items: readonly FaqEntry[] }) {
  return (
    <div className="divide-y divide-[color:var(--color-rule)] border-y border-[color:var(--color-rule)]">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-[0.9375rem] font-medium marker:hidden md:text-base">
            {item.q}
            <span
              aria-hidden="true"
              className="mt-1 shrink-0 text-lg leading-none text-[color:var(--color-burgundy)] transition-transform duration-300 group-open:rotate-45"
            >
              +
            </span>
          </summary>

          <div className="pb-6">
            {item.a ? (
              <p className="max-w-2xl text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
                {item.a}
              </p>
            ) : null}

            {item.items ? (
              <ul className={`max-w-2xl space-y-2.5 ${item.a ? "mt-4" : ""}`}>
                {item.items.map((line) => (
                  <li
                    key={line}
                    className="flex gap-3 text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-[0.45rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-burgundy)]"
                    />
                    {line}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </details>
      ))}
    </div>
  );
}
