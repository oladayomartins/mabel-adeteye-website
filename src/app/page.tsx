import Image from "next/image";
import Link from "next/link";
import BrandWall from "@/components/BrandWall";
import CampaignCarousel from "@/components/CampaignCarousel";
import JsonLd from "@/components/JsonLd";
import HeroBackdrop from "@/components/HeroBackdrop";
import Reveal from "@/components/Reveal";
import ReviewerAvatar from "@/components/ReviewerAvatar";
import TestimonialFeature from "@/components/TestimonialFeature";
import { graph, webPageNode } from "@/lib/schema";
import {
  assets,
  credentialStrip,
  heroSize,
  person,
  pillars,
  testimonials,
} from "@/lib/site";

export default function HomePage() {
  const [lead] = testimonials;

  return (
    <>
      <JsonLd
        data={graph([
          webPageNode({
            path: "/",
            name: `${person.name} — ${person.role}`,
            description: person.summary,
            speakable: ["h1", ".lede"],
          }),
        ])}
      />

      {/* ---------------- Hero ---------------- */}
      {/*
        The section runs full width so the backdrop can bleed to the viewport
        edges — constrained to the content width, its wash and rings stop short
        on wide screens and leave bare strips either side. The inner wrapper is
        wider than the standard shell so the portrait can scale up without
        crushing the rails beside it.
      */}
      <section className="relative isolate">
        <HeroBackdrop />

        <div className="mx-auto w-full max-w-[1360px] px-5 pt-10 pb-4 md:px-10 md:pt-16">
        <div className="rise flex justify-center">
          <span className="chip chip-solid">Strategic PR &amp; Communications</span>
        </div>

        <h1
          className="display rise mx-auto mt-7 max-w-[19ch] text-center text-balance"
          style={{ animationDelay: "60ms" }}
        >
          I am Mabel Adeteye,{" "}
          <span className="text-[color:var(--color-burgundy)]">
            Strategic Comms Expert
          </span>
        </h1>

        {/* Explicit centre track so the portrait is a known size rather than the
            result of a negotiation with the two rails either side of it. */}
        <div className="mt-10 grid items-center gap-8 md:mt-14 md:grid-cols-[1fr_330px_1fr] md:gap-8 lg:grid-cols-[1fr_420px_1fr] lg:gap-10 xl:grid-cols-[1fr_620px_1fr] xl:gap-12 2xl:grid-cols-[1fr_660px_1fr]">
          {/* Left rail — desktop order 1, mobile below the portrait */}
          <div className="rise order-2 md:order-1" style={{ animationDelay: "160ms" }}>
            <div className="border-l-2 border-[color:var(--color-burgundy)] pl-5">
              <p className="max-w-[28ch] text-[0.9375rem] leading-relaxed">
                {person.tagline}
              </p>
            </div>
            <p className="mt-7 text-[2.75rem] font-extrabold leading-none tracking-tight">
              16 yrs
            </p>
            <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[color:var(--color-muted)]">
              brand, PR &amp; corporate comms
            </p>
          </div>

          {/* Portrait */}
          <div className="rise order-1 md:order-2" style={{ animationDelay: "100ms" }}>
            {/*
              The arch now ends flush with the portrait, and the whole group is
              masked so figure and arch dissolve into the page together — without
              it, the cut-out PNG reads as floating above a hard arch edge.
            */}
            <div className="hero-portrait relative mx-auto w-full max-w-[330px] md:max-w-none">
              {/* Percentage insets so the arch scales with the portrait. */}
              <div
                aria-hidden="true"
                className="absolute inset-x-[7%] bottom-0 top-[18%] rounded-t-full bg-[color:var(--color-burgundy)]"
              />
              <Image
                src={assets.hero}
                alt={`${person.name}, ${person.role}`}
                width={heroSize.width}
                height={heroSize.height}
                priority
                fetchPriority="high"
                sizes="(max-width: 767px) 80vw, (max-width: 1023px) 330px, (max-width: 1279px) 460px, (max-width: 1535px) 620px, 660px"
                className="relative h-auto w-full object-contain"
              />
            </div>
          </div>

          {/* Testimonial */}
          <div className="rise order-3" style={{ animationDelay: "220ms" }}>
            <figure className="card md:ml-auto md:max-w-[300px] lg:max-w-[260px] xl:max-w-[290px]">
              {/* No star rating — these are written recommendations, not scored
                  reviews, so a rating would be invented. */}
              <span
                aria-hidden="true"
                className="block font-serif text-[2.75rem] leading-[0.7] text-[color:var(--color-burgundy)]"
              >
                &rdquo;
              </span>
              <blockquote className="mt-4 text-[0.9375rem] leading-relaxed">
                “{lead.quote}”
              </blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <ReviewerAvatar person={lead} size={32} />
                <span className="text-[0.8125rem] text-[color:var(--color-muted)]">
                  {lead.name}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>

        <div
          className="rise mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center"
          style={{ animationDelay: "280ms" }}
        >
          <Link href="/bookings" className="btn btn-primary">
            Contact me
          </Link>
          <Link href="/events" className="btn btn-secondary">
            Invite me to speak
          </Link>
        </div>
        </div>
      </section>

      {/* ---------------- Brands ---------------- */}
      <section className="shell pt-14 md:pt-20" aria-labelledby="brands-heading">
        <BrandWall />
      </section>

      {/* ---------------- Practice ---------------- */}
      <section className="shell section" aria-labelledby="practice-heading">
        <Reveal className="rounded-[18px] bg-[color:var(--color-ink)] p-7 text-white md:p-12">
          <h2 id="practice-heading" className="h2">
            What I do
          </h2>

          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pillars.map((pillar, i) => (
              <li
                key={pillar.title}
                className={`rounded-[12px] p-5 ${
                  i === 0
                    ? "bg-[color:var(--color-burgundy)]"
                    : "bg-white/6 ring-1 ring-white/10"
                }`}
              >
                <h3 className="h3">{pillar.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/75">
                  {pillar.lead}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-10 border-t border-white/12 pt-8">
            <h3 className="eyebrow text-white/50">Accredited &amp; affiliated</h3>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
              {credentialStrip.map((item) => (
                <li
                  key={item}
                  className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-white/70"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>

      {/* ---------------- Selected work ---------------- */}
      <section className="shell section" aria-labelledby="work-heading">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 id="work-heading" className="h2 mt-3">
              Let&rsquo;s have a look at{" "}
              <span className="text-[color:var(--color-burgundy)]">my work</span>
            </h2>
          </div>
          <Link href="/about" className="btn btn-secondary !min-h-[44px] !text-sm">
            See more ↗
          </Link>
        </div>

        <Reveal className="mt-8 block">
          <CampaignCarousel />
        </Reveal>
      </section>

      {/* ---------------- Testimonials ---------------- */}
      <section className="band band-ink" aria-labelledby="home-say-heading">
        <div className="shell">
          <div className="flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="eyebrow text-[color:var(--color-accent)]">In their words</p>
              <h2 id="home-say-heading" className="h2 mt-3 max-w-[20ch] text-balance">
                Testimonials that speak to{" "}
                <span className="text-[color:var(--color-accent)]">my results</span>
              </h2>
            </div>
          </div>

          <div className="mt-10">
            <TestimonialFeature />
          </div>
        </div>
      </section>

      {/* ---------------- Next steps ---------------- */}
      <section className="shell pb-20 md:pb-28" aria-labelledby="next-heading">
        <h2 id="next-heading" className="sr-only">
          Work with me
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Reveal>
            <div className="card flex h-full flex-col">
              <p className="eyebrow">Mentorship</p>
              <h3 className="h2 mt-3">Learn from 16 years in the room</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
                One-to-one mentoring, in-house team training, masterclasses and advisory
                for people and teams who have to communicate when it matters most.
              </p>
              <Link href="/mentorship" className="btn btn-secondary mt-6 self-start">
                See the formats
              </Link>
            </div>
          </Reveal>

          <Reveal delay={90}>
            <div className="card flex h-full flex-col bg-[color:var(--color-tint)]">
              <p className="eyebrow">Bookings &amp; enquiries</p>
              <h3 className="h2 mt-3">Have something coming up?</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
                Keynotes, panels, workshops, media requests and advisory briefs — send
                the details, or call {person.phoneDisplay} directly.
              </p>
              <Link href="/bookings" className="btn btn-primary mt-6 self-start">
                Start a conversation
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
