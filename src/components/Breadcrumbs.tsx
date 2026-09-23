import Link from "next/link";

export type Crumb = { name: string; path: string };

/**
 * Visible breadcrumbs. Paired with BreadcrumbList structured data, these give
 * search engines the site hierarchy and give LLMs an explicit statement of where
 * a page sits — both of which are lost when navigation is flat.
 */
export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="shell pt-6">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-muted)]">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-2">
              {last ? (
                <span aria-current="page" className="text-[color:var(--color-burgundy)]">
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.path}
                  className="transition-colors hover:text-[color:var(--color-burgundy)]"
                >
                  {crumb.name}
                </Link>
              )}
              {last ? null : <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
