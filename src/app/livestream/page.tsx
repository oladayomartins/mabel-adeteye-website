import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import LivestreamRoom from "@/components/LivestreamRoom";
import { pageMetadata } from "@/lib/seo";
import { insightRoom } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Watch live — MAA Insight Room",
  description:
    "Watch the MAA Insight Room live with Mabel Adeteye. First Friday of every month, 7:00 p.m. WAT — the stream opens here an hour before.",
  path: "/livestream",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "MAA Insight Room", path: "/insight-room" },
  { name: "Watch live", path: "/livestream" },
];

/**
 * The countdown and player are entirely client-side (see LivestreamRoom), so
 * this page is static: nothing here depends on the date.
 */
export default function LivestreamPage() {
  return (
    <>
      <Breadcrumbs crumbs={crumbs} />

      <section className="shell pt-8 pb-16 md:pt-12 md:pb-24">
        <p className="eyebrow">{insightRoom.name}</p>
        <h1 className="h1 mt-3">Watch live</h1>
        <p className="lede mt-3 max-w-[54ch]">
          {insightRoom.schedule}, {insightRoom.time}.
        </p>

        <div className="mt-10">
          <LivestreamRoom
            embedUrl={insightRoom.livestreamEmbedUrl}
            joinUrl={insightRoom.livestreamUrl}
          />
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link href="/insight-room#register" className="btn btn-primary">
            Register and send your question
          </Link>
          <p className="text-[0.875rem] text-[color:var(--color-muted)]">
            Free · Questions sent in advance shape the session.
          </p>
        </div>
      </section>
    </>
  );
}
