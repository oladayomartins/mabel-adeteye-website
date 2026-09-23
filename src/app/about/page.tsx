import Image from "next/image";
import Link from "next/link";
import Accordion from "@/components/Accordion";
import Breadcrumbs from "@/components/Breadcrumbs";
import BrandWall from "@/components/BrandWall";
import CampaignCarousel from "@/components/CampaignCarousel";
import JsonLd from "@/components/JsonLd";
import Marquee from "@/components/Marquee";
import Reveal from "@/components/Reveal";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import {
  aboutFaqNode,
  breadcrumbNode,
  graph,
  reviewNodes,
  webPageNode,
} from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import {
  aboutFaqs,
  accreditations,
  assets,
  career,
  education,
  gallery,
  heroSize,
  memberships,
  person,
  pillars,
  quickFacts,
  recognitions,
} from "@/lib/site";

export const metadata = pageMetadata({
  title: "About Me",
  description:
    "Mabel Adeteye is a Forbes Communications Council member and 3× PR Power List honoree with 16+ years in brand management, PR and corporate communications for Wema Bank, Mastercard, Coca-Cola, British Airways, Google and more.",
  path: "/about",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About Me", path: "/about" },
];

const membershipEntries = [
  {
    q: "Memberships",
    items: memberships.map((m) => `${m.body} — ${m.note}`),
  },
  {
    q: "Accreditations",
    items: accreditations.map((a) => `${a.body} — ${a.note}`),
  },
  {
    q: "Education",
    items: education.map((e) => (e.note ? `${e.school} — ${e.note}` : e.school)),
  },
];

const galleryTeaser = gallery.slice(0, 3);

export default function AboutPage() {
  return (
    <>
      <JsonLd
        data={graph([
          webPageNode({
            type: "ProfilePage",
            path: "/about",
            name: "About Mabel Adeteye",
            description: metadata.description as string,
            crumbs,
          }),
          breadcrumbNode(crumbs),
          aboutFaqNode,
          ...reviewNodes,
        ])}
      />

      <Breadcrumbs crumbs={crumbs} />

      {/* ---------------- Intro ---------------- */}
      <header className="shell pt-8 md:pt-12">
        <div className="rise">
          <p className="eyebrow">About me</p>
          {/* max-w in ch must sit on the element that sets the font-size —
              on the wrapper it resolves against 16px body text, not the display size. */}
          <h1 className="h1 mt-4 max-w-[15ch] text-balance">
            A thought leader driving global brand success
          </h1>
        </div>
      </header>

      <section className="shell pt-12 md:pt-16" aria-label="Biography">
        <div className="grid gap-10 md:grid-cols-[minmax(0,360px)_1fr] md:gap-16">
          {/* Portrait holds position while the biography scrolls past it. */}
          <Reveal className="md:sticky-media block self-start">
            <div className="parallax relative aspect-[3/4] overflow-hidden rounded-[var(--radius-card)] bg-[color:var(--color-tint)]">
              <Image
                src={assets.hero}
                alt={`${person.name}, ${person.currentRole.title} at ${person.currentRole.organisation}`}
                width={heroSize.width}
                height={heroSize.height}
                sizes="(max-width: 767px) 92vw, 360px"
                className="h-full w-full object-cover object-top"
              />
            </div>

            <div className="mt-4 rounded-[var(--radius-card)] bg-[color:var(--color-ink)] p-5 text-white">
              <p className="eyebrow text-white/50">Currently</p>
              <p className="mt-3 text-[0.9375rem] font-semibold leading-snug">
                {person.currentRole.title}
              </p>
              <p className="mt-1 text-[0.9375rem] text-white/60">
                {person.currentRole.organisation}
              </p>
            </div>
          </Reveal>

          <Reveal delay={90} className="prose-body max-w-[60ch] text-[1.0625rem] leading-relaxed">
            <p className="lede !text-[color:var(--color-ink)]">
              {person.tagline}
            </p>
            <p>
              My name is Mabel. I&rsquo;m a thought leader and brand communications
              professional driving global brand success.
            </p>
            <p>
              With over 16 years of experience in brand management, public relations and
              corporate communications strategy, I have developed comprehensive
              communication strategies while managing brand reputation and stakeholder
              relations.
            </p>
            <p>
              My career includes leading communications for global brands like Etisalat
              Nigeria, Nokia, Mastercard, Wema Bank, British Airways, Coca-Cola, Ford and
              Google, with expertise in crisis communications, strategic communication and
              campaign management.
            </p>
            <p>
              I have served on the CIPR International Committee for four years, and I am
              recognised for my strategic thinking and innovative approach to corporate
              storytelling.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/bookings" className="btn btn-primary">
                Contact me
              </Link>
              <Link href="/press" className="btn btn-secondary">
                As seen in the press
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------------- At a glance ---------------- */}
      <section className="band band-tint mt-16 md:mt-24" aria-labelledby="facts-heading">
        <div className="shell">
          <h2 id="facts-heading" className="eyebrow">
            At a glance
          </h2>
          {/*
            Plain, self-contained statements. Each row stands on its own without
            surrounding prose, which is the shape answer engines extract cleanly.
          */}
          <dl className="mt-8 grid gap-x-14 sm:grid-cols-2">
            {quickFacts.map((fact, i) => (
              <Reveal key={fact.label} delay={(i % 2) * 60} className="block">
                <div className="border-t border-[color:var(--color-burgundy)]/15 py-5">
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-burgundy)]">
                    {fact.label}
                  </dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed">{fact.value}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------------- Brands ---------------- */}
      <section className="shell section" aria-labelledby="brands-heading">
        <BrandWall />
      </section>

      {/* ---------------- Pull quote ---------------- */}
      <section className="band band-burgundy relative overflow-hidden" aria-label="In her words">
        {/* Decorative ring motif, drifting slowly against the scroll. */}
        <div
          aria-hidden="true"
          className="parallax parallax-soft pointer-events-none absolute inset-0"
        >
          <svg
            viewBox="0 0 800 800"
            fill="none"
            className="absolute -right-[18%] top-1/2 h-[190%] w-auto -translate-y-1/2 opacity-[0.16]"
          >
            <circle cx="400" cy="400" r="384" stroke="#fff" strokeWidth="1" />
            <circle cx="400" cy="400" r="300" stroke="#fff" strokeWidth="1" strokeDasharray="2 14" />
            <circle cx="400" cy="400" r="216" stroke="#fff" strokeWidth="1" />
          </svg>
        </div>

        <div className="shell relative">
          <div className="grid items-center gap-10 md:grid-cols-[180px_1fr] md:gap-14">
            <Reveal className="block">
              <div className="relative mx-auto aspect-square w-[150px] overflow-hidden rounded-full ring-1 ring-white/25 md:mx-0 md:w-full">
                <Image
                  src={assets.heroSquare}
                  alt=""
                  width={520}
                  height={520}
                  sizes="180px"
                  className="h-full w-full object-cover"
                />
              </div>
            </Reveal>

            <Reveal delay={90}>
              <blockquote className="h2 max-w-[22ch] text-balance">
                I blend creative intuition with analytical thoroughness to build
                meaningful connections between brands and audiences.
              </blockquote>
              <p className="mt-6 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-white/55">
                {person.name}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- What I do ---------------- */}
      <section className="band band-ink" aria-labelledby="pillars-heading">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow text-[color:var(--color-accent)]">Practice</p>
              <h2 id="pillars-heading" className="h2 mt-3">
                What I do
              </h2>
            </div>
            <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-white/60">
              Seven practice areas, built over sixteen years across telecommunications,
              technology, aviation, media, banking, FMCG and agency leadership.
            </p>
          </div>

          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar, i) => (
              <Reveal as="li" key={pillar.title} delay={(i % 4) * 60} className="block">
                <div
                  className={`flex h-full flex-col rounded-[var(--radius-card)] p-6 ${
                    i === 0
                      ? "bg-[color:var(--color-burgundy)]"
                      : "bg-white/[0.06] ring-1 ring-white/10"
                  }`}
                >
                  {/* Brighter on the burgundy card: white/45 only clears AA
                      against ink, not against burgundy. */}
                  <span
                    className={`font-mono text-[0.6875rem] tracking-[0.14em] ${
                      i === 0 ? "text-white/70" : "text-white/45"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="h3 mt-4">{pillar.title}</h3>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/70">
                    {pillar.lead}
                  </p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/55">
                    {pillar.body}
                  </p>
                </div>
              </Reveal>
            ))}

            {/* Eighth cell completes the 4-column grid and carries the action. */}
            <Reveal as="li" delay={180} className="block">
              <Link
                href="/mentorship"
                className="group flex h-full flex-col justify-between rounded-[var(--radius-card)] bg-[color:var(--color-accent)]/15 p-6 ring-1 ring-[color:var(--color-accent)]/30 transition-colors hover:bg-[color:var(--color-accent)]/25"
              >
                <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-[color:var(--color-accent)]">
                  →
                </span>
                <span className="mt-8">
                  <span className="h3 block">Work with me</span>
                  <span className="mt-3 block text-[0.9375rem] leading-relaxed text-white/70">
                    Mentoring, in-house training, workshops and advisory.
                  </span>
                </span>
              </Link>
            </Reveal>
          </ul>
        </div>
      </section>

      {/* Practice areas as a moving band, breaking the vertical rhythm.
          The band is rotated and over-wide, so the wrapper must clip it —
          otherwise it extends the document past the viewport. */}
      <div className="my-16 overflow-hidden md:my-24">
        <Marquee />
      </div>

      {/* ---------------- Signature campaigns ---------------- */}
      <section className="shell pb-16 md:pb-24" aria-labelledby="campaigns-heading">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 id="campaigns-heading" className="h2 mt-3">
              Signature campaigns
            </h2>
          </div>
          <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
            Campaigns and projects led across FMCG, aviation, banking and media.
          </p>
        </div>

        <Reveal className="mt-8 block">
          <CampaignCarousel />
        </Reveal>
      </section>

      {/* ---------------- Career ---------------- */}
      <section className="shell pb-16 md:pb-24" aria-labelledby="career-heading">
        <div className="grid gap-10 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16">
          <Reveal className="md:sticky-media block self-start">
            <h2 id="career-heading" className="h2">
              Career
            </h2>
            <p className="lede mt-5 max-w-[30ch]">
              Every role below links to the reporting that documents it.
            </p>
          </Reveal>

          <ol>
            {career.map((role, i) => (
              <Reveal as="li" key={role.title} delay={i * 80} className="block">
                <div className="grid grid-cols-[auto_1fr] gap-x-5 md:grid-cols-[150px_auto_1fr] md:gap-x-8">
                  {/* Period sits in its own column on desktop, above on mobile. */}
                  <p className="col-start-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[color:var(--color-muted)] md:col-start-1 md:row-start-1 md:pt-1 md:text-right">
                    {role.period}
                  </p>

                  {/* Connector: dot, plus a rule that stops at the last item. */}
                  <div
                    aria-hidden="true"
                    className="relative col-start-1 row-span-2 row-start-1 flex w-3 justify-center md:col-start-2"
                  >
                    <span className="absolute top-1.5 h-3 w-3 rounded-full border-2 border-[color:var(--color-burgundy)] bg-[color:var(--color-paper)]" />
                    {/* Rule is omitted on the last item so it does not trail
                        past the final role. */}
                    {i < career.length - 1 ? (
                      <span className="mt-1.5 w-px flex-1 bg-[color:var(--color-rule)]" />
                    ) : null}
                  </div>

                  <div className="col-start-2 pb-10 md:col-start-3">
                    <h3 className="h3">{role.title}</h3>
                    <p className="mt-0.5 text-[0.9375rem] font-medium text-[color:var(--color-burgundy)]">
                      {role.org}
                    </p>
                    <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
                      {role.body}
                    </p>
                    <a
                      href={role.source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-muted)] transition-colors hover:text-[color:var(--color-burgundy)]"
                    >
                      Source: {role.source.label}
                      <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------- Recognitions & credentials ---------------- */}
      <section className="band band-tint" aria-labelledby="recognitions-heading">
        <div className="shell">
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <h2 id="recognitions-heading" className="h2">
                Recognitions
              </h2>
              <ol className="mt-8">
                {recognitions.map((item) => (
                  <li
                    key={item.title}
                    className="grid gap-1 border-t border-[color:var(--color-burgundy)]/15 py-4 md:grid-cols-[110px_1fr] md:gap-4"
                  >
                    <span className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[color:var(--color-burgundy)]">
                      {item.year}
                    </span>
                    <span className="text-[0.9375rem] font-medium leading-snug">
                      {item.title}
                    </span>
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={90}>
              <h2 className="h2">Credentials</h2>
              <div className="mt-8">
                <Accordion items={membershipEntries} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------- Gallery teaser ---------------- */}
      <section className="shell section" aria-labelledby="gallery-heading">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <h2 id="gallery-heading" className="h2">
            In the room
          </h2>
          <Link
            href="/gallery"
            className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[color:var(--color-burgundy)] underline underline-offset-4"
          >
            See the gallery ↗
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
          {galleryTeaser.map((item, i) => (
            <Reveal as="li" key={item.alt} delay={i * 80} className="block">
              {/* Image-only links need a name describing the destination. Left to
                  the portrait's alt, a screen reader announces the photo, not
                  where the link goes. */}
              <Link
                href="/gallery"
                aria-label={`${item.caption ?? item.alt} — view the gallery`}
                className="relative block aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-[color:var(--color-tint)]"
              >
                {item.src ? (
                  /* Parallax wraps the image only. Applied to the Link it would
                     also scale a placeholder's caption out of the frame. */
                  <span className="parallax absolute inset-0 block">
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      sizes="(max-width: 767px) 48vw, 30vw"
                      className="object-cover"
                    />
                  </span>
                ) : (
                  <span className="hatch absolute inset-0 flex items-end p-4">
                    <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-burgundy)]/70">
                      {item.caption}
                    </span>
                  </span>
                )}
              </Link>
            </Reveal>
          ))}
        </ul>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="shell pb-16 md:pb-24" aria-labelledby="faq-heading">
        <div className="grid gap-10 md:grid-cols-[minmax(0,300px)_1fr] md:gap-16">
          <Reveal className="md:sticky-media block self-start">
            <h2 id="faq-heading" className="h2">
              Frequently asked
            </h2>
            <p className="lede mt-5 max-w-[30ch]">
              What I do, who I do it for, and the work it has produced.
            </p>
          </Reveal>
          <Reveal delay={90}>
            <Accordion items={aboutFaqs} />
          </Reveal>
        </div>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="band band-ink" aria-labelledby="say-heading">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow text-[color:var(--color-accent)]">In their words</p>
              <h2 id="say-heading" className="h2 mt-3 max-w-[20ch] text-balance">
                Testimonials that speak to{" "}
                <span className="text-[color:var(--color-accent)]">my results</span>
              </h2>
            </div>
            <p className="max-w-[34ch] text-[0.9375rem] leading-relaxed text-white/60">
              Written recommendations from the leaders, clients and colleagues I have
              worked alongside.
            </p>
          </div>

          <div className="mt-10">
            <TestimonialCarousel />
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="shell section">
        <Reveal>
          <div className="card flex flex-col items-start gap-5 bg-[color:var(--color-tint)] md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="h2">Let&rsquo;s talk about your next campaign</h2>
              <p className="mt-2 max-w-[48ch] text-[0.9375rem] text-[color:var(--color-muted)]">
                Speaking, mentorship, media or advisory — tell me what is coming up.
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
