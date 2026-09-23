import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import InsightRoomForm from "@/components/InsightRoomForm";
import JsonLd from "@/components/JsonLd";
import StickyRegisterBar from "@/components/StickyRegisterBar";
import Reveal from "@/components/Reveal";
import { ID, breadcrumbNode, graph, insightRoomNode, webPageNode } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";
import {
  formatSessionLong,
  formatSessionShort,
  sessionIso,
  upcomingSessions,
} from "@/lib/sessions";
import {
  SITE_URL,
  assets,
  insightRoom,
  insightRoomBannerSize,
  insightRoomPortraitSize,
  person,
} from "@/lib/site";

export const metadata = pageMetadata({
  title: "MAA Insight Room",
  description:
    "Mabel Adeteye's free monthly session on business strategy, brand and executive communications, leadership and reputation. First Friday of every month, 7:00 p.m. WAT. Register and submit your question.",
  path: "/insight-room",
});

/**
 * Session dates are computed from "first Friday, 19:00 Africa/Lagos", so the
 * page advances by itself. Revalidating hourly keeps "next session" current
 * without a redeploy — a statically baked date would silently go stale the
 * moment a session passed.
 */
export const revalidate = 3600;

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Mentorship", path: "/mentorship" },
  { name: "MAA Insight Room", path: "/insight-room" },
];

export default function InsightRoomPage() {
  const sessions = upcomingSessions(4);
  const [next, ...later] = sessions;
  const nextLabel = formatSessionLong(next);

  return (
    <>
      <JsonLd
        data={graph([
          webPageNode({
            path: "/insight-room",
            name: "MAA Insight Room",
            description: metadata.description as string,
            crumbs,
          }),
          breadcrumbNode(crumbs),
          insightRoomNode,
          // Each upcoming date as its own Event, so "when is the next session?"
          // has a dated answer rather than only a recurrence rule.
          ...sessions.map((date) => ({
            "@type": "Event",
            "@id": `${SITE_URL}/insight-room#${date.toISOString().slice(0, 10)}`,
            name: `${insightRoom.name} — ${formatSessionShort(date)}`,
            startDate: sessionIso(date),
            eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
            eventStatus: "https://schema.org/EventScheduled",
            isAccessibleForFree: true,
            location: {
              "@type": "VirtualLocation",
              url: `${SITE_URL}/insight-room`,
            },
            organizer: { "@id": ID.person },
            performer: { "@id": ID.person },
            superEvent: { "@id": `${SITE_URL}/mentorship#insight-room` },
            description: insightRoom.tagline,
          })),
        ])}
      />

      <Breadcrumbs crumbs={crumbs} />

      <StickyRegisterBar
        heroId="hero-cta"
        formId="register"
        label={`Register for ${formatSessionShort(next)}`}
      />

      {/* ---------------- Next session ---------------- */}
      <header className="shell pt-8 md:pt-12">
        <div className="rise">
          {/* The banner is the masthead and the heading: its alt text is the h1,
              so the brand lockup and the semantics are the same element. */}
          <h1 className="max-w-[560px]">
            <Image
              src={assets.insightRoomBanner}
              alt={insightRoom.name}
              width={insightRoomBannerSize.width}
              height={insightRoomBannerSize.height}
              priority
              fetchPriority="high"
              sizes="(max-width: 767px) 92vw, 560px"
              className="h-auto w-full rounded-[var(--radius-card)]"
            />
          </h1>
          <p className="eyebrow mt-6">{insightRoom.cost}</p>
          <p className="lede mt-3 max-w-[54ch]">{insightRoom.tagline}</p>

          {/* Campaign traffic lands here and needs the action immediately —
              this sits above the fold and jumps straight to the form. */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a id="hero-cta" href="#register" className="btn btn-primary">
              Register for {formatSessionShort(next)}
            </a>
            <p className="text-[0.875rem] text-[color:var(--color-muted)]">
              Free · {insightRoom.schedule} · {insightRoom.time}
            </p>
          </div>
        </div>
      </header>

      <section className="shell pt-10 md:pt-14" aria-labelledby="next-session-heading">
        <Reveal>
          <div className="rounded-[18px] bg-[color:var(--color-ink)] p-7 text-white md:p-12">
            <p className="eyebrow text-[color:var(--color-accent)]">Next session</p>
            <h2 id="next-session-heading" className="h1 mt-4 text-balance">
              <time dateTime={sessionIso(next)}>{nextLabel}</time>
            </h2>
            <p className="mt-4 text-[1.0625rem] text-white/70">{insightRoom.time}</p>

            <dl className="mt-10 grid gap-6 border-t border-white/12 pt-8 sm:grid-cols-3">
              {[
                { k: "Runs", v: insightRoom.schedule },
                { k: "Cost", v: insightRoom.cost },
                { k: "Format", v: "Online — access details on registration" },
              ].map((row) => (
                <div key={row.k}>
                  <dt className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-accent)]">
                    {row.k}
                  </dt>
                  <dd className="mt-2 text-[0.9375rem] leading-relaxed text-white/85">
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>

            <a href="#register" className="btn btn-invert mt-8">
              Register for this session
            </a>

            {later.length ? (
              <div className="mt-10 border-t border-white/12 pt-8">
                <h3 className="eyebrow text-white/50">Also coming up</h3>
                <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
                  {later.map((date) => (
                    <li
                      key={date.toISOString()}
                      className="font-mono text-[0.75rem] uppercase tracking-[0.12em] text-white/60"
                    >
                      <time dateTime={sessionIso(date)}>{formatSessionShort(date)}</time>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </Reveal>
      </section>

      {/* ---------------- Portrait band ---------------- */}
      <section className="relative mt-16 md:mt-24" aria-hidden="true">
        <div className="parallax relative h-[380px] overflow-hidden md:h-[520px]">
          <Image
            src={assets.insightRoomPortrait}
            alt=""
            width={insightRoomPortraitSize.width}
            height={insightRoomPortraitSize.height}
            sizes="100vw"
            className="h-full w-full object-cover object-[72%_35%]"
          />
        </div>
        {/* Burgundy veil so the quote holds contrast over a light photograph. */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[color:var(--color-burgundy)]/92 via-[color:var(--color-burgundy)]/70 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="shell">
            <p className="h2 max-w-[18ch] text-balance text-white">
              Better questions, not quicker answers.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- About + register ---------------- */}
      <section className="shell section" aria-labelledby="register-heading">
        <div className="grid gap-12 md:grid-cols-[1fr_minmax(0,460px)] md:gap-16">
          <div>
            <Reveal>
              <h2 id="register-heading" className="h2">
                What happens in the room
              </h2>
              <blockquote className="mt-6 border-l-2 border-[color:var(--color-burgundy)] pl-5 text-[1.0625rem] leading-relaxed">
                &ldquo;{insightRoom.quote}&rdquo;
              </blockquote>
              <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-muted)]">
                {person.name}
              </p>
            </Reveal>

            <Reveal delay={80} className="mt-10 block">
              <h3 className="eyebrow">How it works</h3>
              <ol className="mt-5 space-y-3">
                {insightRoom.howItWorks.map((item, i) => (
                  <li key={item} className="flex gap-4 text-[0.9375rem] leading-relaxed">
                    <span className="font-mono text-[0.6875rem] tracking-[0.14em] text-[color:var(--color-burgundy)]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </Reveal>

            <Reveal delay={140} className="mt-10 block">
              <h3 className="eyebrow">What it covers</h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {insightRoom.topics.map((topic) => (
                  <li key={topic} className="chip chip-solid">
                    {topic}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={200} className="mt-10 block">
              <h3 className="eyebrow">Who it is for</h3>
              <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
                {insightRoom.audience.join(", ")} — anyone who would rather examine the
                thinking behind a decision than be handed a generic answer.
              </p>
              <Link
                href="/mentorship"
                className="btn btn-secondary mt-7"
              >
                Other ways to work with Mabel
              </Link>
            </Reveal>
          </div>

          <Reveal delay={60}>
            <div id="register" className="md:sticky-media scroll-mt-24">
              <h2 className="h3">Register for {formatSessionShort(next)}</h2>
              <p className="mt-2 text-[0.9375rem] text-[color:var(--color-muted)]">
                Free. Your question shapes the session.
              </p>
              <div className="mt-5">
                <InsightRoomForm sessionLabel={nextLabel} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
