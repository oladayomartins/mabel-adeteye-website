import Link from "next/link";
import Accordion from "@/components/Accordion";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { ID, breadcrumbNode, graph, webPageNode } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import { SITE_URL, faqs, insightRoom, mentorshipTracks, person, pillars } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Mentorship",
  description:
    "MAA Insight Room — free monthly sessions on the first Friday at 7pm WAT — plus one-to-one mentoring, in-house team training, workshops and advisory with Mabel Adeteye.",
  path: "/mentorship",
});

const faqSchema = {
  "@type": "FAQPage",
  "@id": `${SITE_URL}/mentorship#faq`,
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const serviceSchema = {
  "@type": "Service",
  "@id": `${SITE_URL}/mentorship#service`,
  serviceType: "Communications mentorship, training and advisory",
  provider: { "@id": ID.person },
  areaServed: "Worldwide",
  description:
    "Mentorship, in-house team training, workshops and communications advisory across strategic communications, brand management, PR, crisis management, campaigns, sustainability and storytelling.",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Mentorship formats",
    itemListElement: mentorshipTracks.map((t) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: t.title, description: t.body },
    })),
  },
};

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Mentorship", path: "/mentorship" },
];

export default function MentorshipPage() {
  return (
    <>
      <JsonLd
        data={graph([
          webPageNode({
            type: "WebPage",
            path: "/mentorship",
            name: "Mentorship",
            description: metadata.description as string,
            crumbs,
          }),
          breadcrumbNode(crumbs),
          serviceSchema,
          faqSchema,
        ])}
      />

      <Breadcrumbs crumbs={crumbs} />

      <PageHeader
        eyebrow="Mentorship"
        title="16 years of judgment, shared"
        lede="I mentor communications professionals and train teams — as a Fate Foundation trainer, a certified Speaker, Trainer and Communications Advisor, and a four-year member of the CIPR International Committee."
      />

      {/* Promo only — the detail and the registration form live on
          /insight-room, so the two pages do not compete on the same content. */}
      <section className="band band-ink mt-10" aria-labelledby="insight-heading">
        <div className="shell">
          <div className="grid items-center gap-8 md:grid-cols-[1fr_auto] md:gap-14">
            <div>
              <p className="eyebrow text-[color:var(--color-accent)]">
                Free · monthly · first Friday
              </p>
              <h2 id="insight-heading" className="h2 mt-3">
                {insightRoom.name}
              </h2>
              <p className="mt-4 max-w-[54ch] text-[0.9375rem] leading-relaxed text-white/70">
                {insightRoom.tagline} Sessions run at {insightRoom.time}, and your
                question shapes the running order.
              </p>
              <ul className="mt-6 flex flex-wrap gap-2">
                {insightRoom.topics.slice(0, 4).map((topic) => (
                  <li key={topic} className="chip !border-white/20 !text-white/70">
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/insight-room" className="btn btn-invert shrink-0">
              See dates &amp; register
            </Link>
          </div>
        </div>
      </section>

      <section className="shell section pt-10" aria-labelledby="formats-heading">
        <h2 id="formats-heading" className="h2">
          Formats
        </h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {mentorshipTracks.map((track, i) => (
            <Reveal as="li" key={track.title} delay={i * 70} className="block">
              <div
                className={`h-full rounded-[var(--radius-card)] p-6 ${
                  track.featured
                    ? "bg-[color:var(--color-ink)] text-white"
                    : "border border-[color:var(--color-rule)] bg-white"
                }`}
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="h3">{track.title}</h3>
                  {track.meta ? (
                    <span
                      className={`font-mono text-[0.625rem] uppercase tracking-[0.12em] ${
                        track.featured ? "text-white/50" : "text-[color:var(--color-muted)]"
                      }`}
                    >
                      {track.meta}
                    </span>
                  ) : null}
                </div>
                <p
                  className={`mt-3 text-[0.9375rem] leading-relaxed ${
                    track.featured ? "text-white/70" : "text-[color:var(--color-muted)]"
                  }`}
                >
                  {track.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
        <p className="mt-6 max-w-[58ch] text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
          Scope, duration and timing are shaped on a first conversation — send a brief
          and we will work out the right shape for it.
        </p>
      </section>

      <section className="shell pb-16 md:pb-24" aria-labelledby="areas-heading">
        <h2 id="areas-heading" className="h2">
          What I mentor on
        </h2>
        <ul className="mt-8 grid gap-x-8 gap-y-4 sm:grid-cols-2 lg:grid-cols-3">
          {pillars.map((pillar, i) => (
            <Reveal as="li" key={pillar.title} delay={(i % 3) * 70} className="block">
              <div className="border-t-2 border-[color:var(--color-burgundy)] pt-4">
                <h3 className="h3">{pillar.title}</h3>
                <p className="mt-2 text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
                  {pillar.lead}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="shell pb-16 md:pb-24" aria-labelledby="faq-heading">
        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <Reveal>
            <h2 id="faq-heading" className="h2">
              Questions
            </h2>
            <p className="lede mt-5 max-w-[42ch]">
              Anything not covered here, ask directly — the form and phone number are on
              the bookings page.
            </p>
          </Reveal>

          <Reveal delay={90}>
            <div className="md:mt-2">
              <Accordion items={faqs} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="rounded-[18px] bg-[color:var(--color-burgundy)] p-7 text-white md:p-12">
            <h2 className="h2">Let&rsquo;s talk</h2>
            <p className="mt-4 max-w-[58ch] text-[0.9375rem] leading-relaxed text-white/80">
              Tell me what you are working on and which format looks closest. If none of
              them fit, say so — most engagements get shaped on the first call anyway.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/bookings" className="btn btn-invert">
                Send a brief
              </Link>
              <a href={`tel:${person.phone}`} className="btn btn-invert">
                {person.phoneDisplay}
              </a>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
