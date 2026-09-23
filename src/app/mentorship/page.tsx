import Link from "next/link";
import Accordion from "@/components/Accordion";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { ID, breadcrumbNode, graph, insightRoomNode, webPageNode } from "@/lib/schema";
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
          insightRoomNode,
        ])}
      />

      <Breadcrumbs crumbs={crumbs} />

      <PageHeader
        eyebrow="Mentorship"
        title="16 years of judgment, shared"
        lede="I mentor communications professionals and train teams — as a Fate Foundation trainer, a certified Speaker, Trainer and Communications Advisor, and a four-year member of the CIPR International Committee."
      />

      {/* ---------------- MAA Insight Room ---------------- */}
      <section
        id="insight-room"
        className="band band-ink mt-10 scroll-mt-24"
        aria-labelledby="insight-heading"
      >
        <div className="shell">
          <div className="grid gap-10 md:grid-cols-[1fr_320px] md:gap-16">
            <div>
              <p className="eyebrow text-[color:var(--color-accent)]">
                Monthly · free to attend
              </p>
              <h2 id="insight-heading" className="h2 mt-3">
                {insightRoom.name}
              </h2>
              <p className="lede mt-5 max-w-[52ch] !text-white/70">
                {insightRoom.tagline}
              </p>

              <blockquote className="mt-8 border-l-2 border-[color:var(--color-accent)] pl-5 text-[0.9375rem] leading-relaxed text-white/80">
                &ldquo;{insightRoom.quote}&rdquo;
              </blockquote>

              <h3 className="eyebrow mt-10 text-white/50">How it works</h3>
              <ol className="mt-5 space-y-3">
                {insightRoom.howItWorks.map((stepText, i) => (
                  <li
                    key={stepText}
                    className="flex gap-4 text-[0.9375rem] leading-relaxed text-white/75"
                  >
                    <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-[color:var(--color-accent)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {stepText}
                  </li>
                ))}
              </ol>

              <h3 className="eyebrow mt-10 text-white/50">What it covers</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {insightRoom.topics.map((topic) => (
                  <li
                    key={topic}
                    className="chip !border-white/20 !text-white/70"
                  >
                    {topic}
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:sticky-media self-start rounded-[var(--radius-card)] bg-white/[0.06] p-6 ring-1 ring-white/10">
              <dl className="space-y-5">
                {[
                  { k: "When", v: insightRoom.schedule },
                  { k: "Time", v: insightRoom.time },
                  { k: "Cost", v: insightRoom.cost },
                  { k: "Who it is for", v: insightRoom.audience.join(", ") },
                ].map((row) => (
                  <div key={row.k}>
                    <dt className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-accent)]">
                      {row.k}
                    </dt>
                    <dd className="mt-1.5 text-[0.9375rem] leading-relaxed text-white/85">
                      {row.v}
                    </dd>
                  </div>
                ))}
              </dl>

              {/* No public registration link exists yet, so this routes to the
                  enquiry form rather than a guessed destination. */}
              {insightRoom.registerUrl ? (
                <a
                  href={insightRoom.registerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-invert mt-7 w-full"
                >
                  Register for the next session
                </a>
              ) : (
                <Link href="/bookings" className="btn btn-invert mt-7 w-full">
                  Ask about the next session
                </Link>
              )}

              <a
                href={insightRoom.source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-white/40 transition-colors hover:text-white/70"
              >
                Source: {insightRoom.source.label}
                <span aria-hidden="true">↗</span>
              </a>
            </div>
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
