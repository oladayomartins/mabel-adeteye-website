import type { PressItem } from "@/lib/site";

/**
 * Press card.
 *
 * Carries a typographic masthead block rather than the article's own image:
 * every one of these publishers exposes an OG image, but hotlinking their CDNs
 * puts load time and availability outside our control and the hosting rights
 * are theirs.
 */
export default function PressCard({ item }: { item: PressItem }) {
  const outlet = item.outlet.split(" — ")[0];

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-rule)] bg-white transition-colors hover:border-[color:var(--color-burgundy)]/40"
    >
      <div className="relative flex h-[128px] items-center justify-center bg-[color:var(--color-tint)] px-6">
        <span className="text-center font-mono text-[0.8125rem] uppercase tracking-[0.16em] text-[color:var(--color-burgundy)]">
          {outlet}
        </span>
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--color-burgundy)] text-sm text-white transition-transform duration-300 group-hover:-translate-y-0.5"
        >
          ↗
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip !min-h-[28px] !text-[0.625rem]">{item.kind}</span>
          {item.dateLabel ? (
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-muted)]">
              {item.dateLabel}
            </span>
          ) : null}
        </div>

        <h3 className="h3 mt-3 text-balance transition-colors group-hover:text-[color:var(--color-burgundy)]">
          {item.title}
        </h3>
        <p className="mt-2 text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
          {item.summary}
        </p>
      </div>
    </a>
  );
}
