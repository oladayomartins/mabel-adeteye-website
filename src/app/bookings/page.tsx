import EnquiryForm from "@/components/EnquiryForm";
import Breadcrumbs from "@/components/Breadcrumbs";
import JsonLd from "@/components/JsonLd";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";
import { person } from "@/lib/site";
import { breadcrumbNode, graph, webPageNode } from "@/lib/schema";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Bookings & Enquiries",
  description:
    "Book Mabel Adeteye for keynotes, panels, workshops, media requests and communications advisory. Call +234 816 316 7152, email me@mabeladeteye.com, or send a brief.",
  path: "/bookings",
});

const lanes = [
  { title: "Speaking", body: "Keynotes, panels, fireside chats and conference workshops." },
  { title: "Mentorship", body: "One-to-one mentoring, in-house team training, masterclasses and advisory." },
  { title: "Media", body: "Interviews, commentary, bylines and podcast appearances." },
  { title: "Other", body: "Partnerships, judging, advisory boards and anything that does not fit a box." },
];

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Bookings & Enquiries", path: "/bookings" },
];

export default function BookingsPage() {
  return (
    <>
      <JsonLd
        data={graph([
          webPageNode({
            type: "ContactPage",
            path: "/bookings",
            name: "Bookings & Enquiries",
            description: metadata.description as string,
            crumbs,
          }),
          breadcrumbNode(crumbs),
        ])}
      />

      <Breadcrumbs crumbs={crumbs} />

      <PageHeader
        eyebrow="Contact / Booking"
        title="Start a conversation"
        lede="Tell me what is coming up. Every brief is read personally."
      />

      <section className="shell section pt-10">
        <div className="grid gap-10 md:grid-cols-[1fr_minmax(0,460px)] md:gap-14">
          <div>
            <Reveal>
              <h2 className="eyebrow">What I take on</h2>
              <ul className="mt-6 divide-y divide-[color:var(--color-rule)] border-y border-[color:var(--color-rule)]">
                {lanes.map((lane) => (
                  <li key={lane.title} className="py-5">
                    <h3 className="h3">{lane.title}</h3>
                    <p className="mt-2 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
                      {lane.body}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={90} className="mt-10 block">
              <h2 id="speaker-kit" className="eyebrow scroll-mt-28">
                Speaker kit &amp; media
              </h2>
              <p className="mt-4 max-w-[52ch] text-[0.9375rem] leading-relaxed text-[color:var(--color-muted)]">
                Short and long bios, high-resolution headshots, the logo pack and past
                topics are available to organisers and journalists. Mention “speaker kit”
                in your message and it will come back with the reply.
              </p>
            </Reveal>

            <Reveal delay={150} className="mt-10 block">
              <h2 className="eyebrow">Need my expertise?</h2>
              <ul className="mt-4 space-y-3 text-[0.9375rem]">
                <li>
                  <span className="block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-muted)]">
                    Phone
                  </span>
                  <a
                    href={`tel:${person.phone}`}
                    className="underline underline-offset-4 hover:text-[color:var(--color-burgundy)]"
                  >
                    {person.phoneDisplay}
                  </a>
                </li>
                <li>
                  <span className="block font-mono text-[0.625rem] uppercase tracking-[0.12em] text-[color:var(--color-muted)]">
                    Email
                  </span>
                  <a
                    href={`mailto:${person.email}`}
                    className="underline underline-offset-4 hover:text-[color:var(--color-burgundy)]"
                  >
                    {person.email}
                  </a>
                </li>
                <li className="text-[color:var(--color-muted)]">{person.location}</li>
              </ul>
            </Reveal>
          </div>

          <Reveal delay={60}>
            <EnquiryForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
