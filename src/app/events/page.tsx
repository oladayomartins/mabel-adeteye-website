import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { SITE_URL, pastEvents, upcomingEvents, type EventItem } from "@/lib/site";
import { ID, breadcrumbNode, graph, webPageNode } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Events",
  description:
    "Keynotes, panels, workshops and masterclasses with Mabel Adeteye on strategic communications, crisis management and brand perception. See upcoming and past appearances.",
  path: "/events",
});

const formats = ["Keynote", "Panel", "Workshop", "Masterclass"];

function eventSchema(event: EventItem) {
  return {
    "@type": "Event",
    "@id": `${SITE_URL}/events#${event.date}`,
    name: event.title,
    startDate: event.date,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: { "@type": "Place", name: event.location, address: event.location },
    description: event.body,
    performer: { "@id": ID.person },
  };
}

function EventRow({ event, muted }: { event: EventItem; muted?: boolean }) {
  return (
    <article
      className={`grid gap-3 border-t border-[color:var(--color-rule)] py-7 md:grid-cols-[150px_1fr_auto] md:gap-8 ${
        muted ? "opacity-85" : ""
      }`}
    >
      <p className="font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-[color:var(--color-muted)]">
        {event.dateLabel}
      </p>
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="chip chip-solid">{event.kind}</span>
          <span className="text-[0.8125rem] text-[color:var(--color-muted)]">
            {event.location}
          </span>
        </div>
        <h3 className="h3 mt-3">{event.title}</h3>
        <p className="mt-2 max-w-[62ch] text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
          {event.body}
        </p>
      </div>
      {event.href ? (
        <a
          href={event.href}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-secondary self-start md:!min-h-[44px]"
        >
          Details
        </a>
      ) : null}
    </article>
  );
}

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Events", path: "/events" },
];

export default function EventsPage() {
  const upcoming = [...upcomingEvents].sort((a, b) => a.date.localeCompare(b.date));
  const past = [...pastEvents].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <>
      <JsonLd
        data={graph([
          webPageNode({
            type: "CollectionPage",
            path: "/events",
            name: "Events & Speaking",
            description: metadata.description as string,
            crumbs,
          }),
          breadcrumbNode(crumbs),
          ...upcoming.map(eventSchema),
        ])}
      />

      <Breadcrumbs crumbs={crumbs} />

      <PageHeader
        eyebrow="Speaking"
        title="Keynotes, panels & masterclasses"
        lede="I speak and train on strategic communications, crisis management, brand storytelling and reputation — for conferences, corporate academies and leadership teams."
      />

      <section className="shell pt-8">
        <Reveal>
          <ul className="flex flex-wrap gap-2">
            {formats.map((f) => (
              <li key={f} className="chip">
                {f}
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section className="shell section pt-10" aria-labelledby="upcoming-heading">
        <h2 id="upcoming-heading" className="h2">
          Upcoming
        </h2>
        <Reveal className="mt-6 block">
          {upcoming.length ? (
            upcoming.map((event) => <EventRow key={event.title} event={event} />)
          ) : (
            <div className="card bg-[color:var(--color-tint)]">
              <p className="text-[0.9375rem] leading-relaxed">
                No public dates are listed at the moment. If you have something coming up,
                send the details and I will come back to you on availability.
              </p>
              <Link href="/bookings" className="btn btn-primary mt-5">
                Check availability
              </Link>
            </div>
          )}
        </Reveal>
      </section>

      <section className="shell pb-16 md:pb-24" aria-labelledby="past-heading">
        <h2 id="past-heading" className="h2">
          Recent appearances
        </h2>
        <div className="mt-6">
          {past.length ? (
            past.map((event, i) => (
              <Reveal key={event.title} delay={i * 70} className="block">
                <EventRow event={event} muted />
              </Reveal>
            ))
          ) : (
            <p className="max-w-[58ch] border-t border-[color:var(--color-rule)] pt-6 text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
              Past engagements are being added. In the meantime, the{" "}
              <Link
                href="/about"
                className="underline underline-offset-4 hover:text-[color:var(--color-burgundy)]"
              >
                recognitions on the About page
              </Link>{" "}
              cover speaking, training and advisory work to date.
            </p>
          )}
        </div>
      </section>

      <section className="shell pb-20 md:pb-28">
        <Reveal>
          <div className="rounded-[18px] border border-[color:var(--color-burgundy)]/25 bg-[color:var(--color-tint)] p-7 md:p-12">
            <h2 className="h2 text-[color:var(--color-burgundy)]">Invite me to speak</h2>
            <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed">
              Share the audience, the date and what you need the room to walk away with.
              A speaker kit — bio, headshots, past topics and AV requirements — is
              available on request.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link href="/bookings" className="btn btn-primary">
                Send a brief
              </Link>
              <Link href="/bookings#speaker-kit" className="btn btn-secondary">
                Request speaker kit
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
