import Link from "next/link";
import GalleryGrid from "@/components/GalleryGrid";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { gallery } from "@/lib/site";
import { breadcrumbNode, graph, webPageNode } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gallery",
  description:
    "Stages, panels, masterclasses and press moments from Mabel Adeteye's work in strategic communications, brand management and public relations.",
  path: "/gallery",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Gallery", path: "/gallery" },
];

export default function GalleryPage() {
  return (
    <>
      <JsonLd
        data={graph([
          webPageNode({
            type: "CollectionPage",
            path: "/gallery",
            name: "Gallery",
            description: metadata.description as string,
            crumbs,
          }),
          breadcrumbNode(crumbs),
        ])}
      />

      <Breadcrumbs crumbs={crumbs} />

      <PageHeader
        eyebrow="Gallery"
        title="Stages, rooms and moments"
        lede="Keynotes, panels, in-house masterclasses and press — a running record of the work."
      />

      <section className="shell section pt-8 md:pt-10">
        <Reveal>
          <GalleryGrid items={gallery} />
        </Reveal>

        <Reveal delay={120}>
          <div className="card mt-10 flex flex-col items-start gap-5 bg-[color:var(--color-tint)] md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="h3">Photographed me at an event?</h2>
              <p className="mt-2 text-[0.9375rem] text-[color:var(--color-muted)]">
                Send images and credits through and they will be added here.
              </p>
            </div>
            <Link href="/bookings" className="btn btn-primary shrink-0">
              Get in touch
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
