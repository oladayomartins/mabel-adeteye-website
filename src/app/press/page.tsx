import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import PressCard from "@/components/PressCard";
import Reveal from "@/components/Reveal";
import { breadcrumbNode, graph, pressNodes, webPageNode } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL, person, press } from "@/lib/site";

export const metadata = pageMetadata({
  title: "As seen in the press",
  description:
    "Press coverage of Mabel Adeteye — interviews and features in BusinessDay, Brand Communicator, The Comms Avenue, Marketing Edge and Cannes Lions.",
  path: "/press",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Press", path: "/press" },
];

/** Outlets, de-duplicated, for the masthead strip. */
const outlets = [...new Set(press.map((p) => p.outlet.split(" — ")[0]))];

export default function PressPage() {
  // Undated items sort last; the rest newest first.
  const items = [...press].sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  return (
    <>
      <JsonLd
        data={graph([
          webPageNode({
            type: "CollectionPage",
            path: "/press",
            name: "As seen in the press",
            description: metadata.description as string,
            crumbs,
          }),
          breadcrumbNode(crumbs),
          {
            "@type": "ItemList",
            "@id": `${SITE_URL}/press#coverage`,
            name: "Press coverage of Mabel Adeteye",
            itemListElement: press.map((item, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: item.url,
              name: item.title,
            })),
          },
          ...pressNodes,
        ])}
      />

      <Breadcrumbs crumbs={crumbs} />

      <PageHeader
        eyebrow="Press"
        title="As seen in the press"
        lede="Interviews, features and announcements — what the trade and business press have written about the work."
      />

      <section className="shell pt-8" aria-label="Publications">
        <Reveal>
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 border-y border-[color:var(--color-rule)] py-5">
            {outlets.map((outlet) => (
              <li
                key={outlet}
                className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[color:var(--color-muted)]"
              >
                {outlet}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="shell section pt-10" aria-labelledby="coverage-heading">
        <h2 id="coverage-heading" className="sr-only">
          Coverage
        </h2>

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal as="li" key={item.url} delay={(i % 3) * 70} className="block">
              <PressCard item={item} />
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="card flex flex-col items-start gap-5 bg-[color:var(--color-tint)] md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="h3">Writing about Mabel?</h2>
              <p className="mt-2 max-w-[52ch] text-[0.9375rem] text-[color:var(--color-muted)]">
                Bios, high-resolution headshots and the logo pack are available to
                journalists on request — or email{" "}
                <a
                  className="underline underline-offset-4"
                  href={`mailto:${person.email}`}
                >
                  {person.email}
                </a>
                .
              </p>
            </div>
            <Link href="/bookings" className="btn btn-primary shrink-0">
              Media enquiries
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
