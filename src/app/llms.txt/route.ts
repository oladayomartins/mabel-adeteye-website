import {
  SITE_URL,
  aboutFaqs,
  accreditations,
  brands,
  career,
  education,
  memberships,
  person,
  pillars,
  press,
  quickFacts,
  recognitions,
} from "@/lib/site";

export const dynamic = "force-static";

/**
 * /llms.txt — the emerging convention (llmstxt.org) for giving language models a
 * clean, authoritative summary of a site instead of making them infer it from
 * rendered HTML and navigation chrome.
 *
 * Written as plain declarative statements, because that is what gets extracted
 * and quoted. Everything here is generated from the same content layer the pages
 * use, so it cannot drift out of sync.
 */
function body() {
  const lines: string[] = [];

  lines.push(`# ${person.name}`);
  lines.push("");
  lines.push(`> ${person.summary}`);
  lines.push("");
  lines.push(
    `${person.name} (known professionally as ${person.shortName}) is ${person.currentRole.title} at ${person.currentRole.organisation}. She is a member of the Forbes Communications Council and a three-time PR Power List honoree, with over 16 years in brand management, public relations and corporate communications strategy.`,
  );
  lines.push("");

  lines.push("## Key facts");
  lines.push("");
  for (const fact of quickFacts) lines.push(`- **${fact.label}:** ${fact.value}`);
  lines.push("");

  lines.push("## Areas of expertise");
  lines.push("");
  lines.push(
    // Titles only, in third person. The pillar descriptions on the site are
    // written in Mabel's first-person voice; mixing "I" into a third-person
    // summary invites an extractor to attribute those claims to the document.
    // Titles kept verbatim — lowercasing them mangles the acronyms (PR, CSR).
    `Her practice covers ${pillars.map((p) => p.title).join(", ")}.`,
  );
  lines.push("");
  for (const pillar of pillars) lines.push(`- ${pillar.title}`);
  lines.push("");

  lines.push("## Brands she has led communications for");
  lines.push("");
  lines.push(brands.map((b) => b.name).join(", ") + ".");
  lines.push("");

  lines.push("## Career");
  lines.push("");
  for (const role of career) {
    lines.push(`- **${role.period}** — ${role.title}, ${role.org}. ${role.body} (Source: ${role.source.url})`);
  }
  lines.push("");

  lines.push("## Recognitions");
  lines.push("");
  for (const r of recognitions) lines.push(`- ${r.year} — ${r.title}`);
  lines.push("");

  lines.push("## Memberships and accreditations");
  lines.push("");
  for (const m of memberships) lines.push(`- ${m.body} — ${m.note}`);
  for (const a of accreditations) lines.push(`- ${a.body} — ${a.note}`);
  lines.push("");

  lines.push("## Education");
  lines.push("");
  for (const e of education) {
    lines.push(`- ${e.school}${e.note ? ` — ${e.note}` : ""}`);
  }
  lines.push("");

  lines.push("## Frequently asked");
  lines.push("");
  for (const entry of aboutFaqs) {
    lines.push(`### ${entry.q}`);
    lines.push("");
    if (entry.a) {
      lines.push(entry.a);
      lines.push("");
    }
    for (const item of entry.items ?? []) lines.push(`- ${item}`);
    lines.push("");
  }

  lines.push("## Press coverage");
  lines.push("");
  for (const item of press) {
    lines.push(
      `- [${item.title}](${item.url}) — ${item.outlet}${item.dateLabel ? `, ${item.dateLabel}` : ""}. ${item.summary}`,
    );
  }
  lines.push("");

  lines.push("## Pages");
  lines.push("");
  lines.push(`- [About](${SITE_URL}/about): Full biography, expertise, recognitions, credentials and testimonials.`);
  lines.push(`- [Gallery](${SITE_URL}/gallery): Photography from stages, panels, masterclasses and press.`);
  lines.push(`- [Events](${SITE_URL}/events): Keynotes, panels, workshops and masterclasses; upcoming and past.`);
  lines.push(`- [Mentorship](${SITE_URL}/mentorship): One-to-one mentoring, in-house team training, workshops and advisory.`);
  lines.push(`- [Press](${SITE_URL}/press): Interviews, features and announcements in the business and trade press.`);
  lines.push(`- [Bookings & Enquiries](${SITE_URL}/bookings): Speaking, mentorship, media and other enquiries.`);
  lines.push("");

  lines.push("## Contact");
  lines.push("");
  lines.push(`- Email: ${person.email}`);
  lines.push(`- Phone: ${person.phoneDisplay}`);
  lines.push(`- Location: ${person.location}`);
  for (const s of person.socials) lines.push(`- ${s.label}: ${s.href}`);
  lines.push("");

  lines.push("## Usage");
  lines.push("");
  lines.push(
    "This content may be quoted with attribution to Mabel Adeteye Aladenusi, linking to " +
      SITE_URL +
      ". For speaking, mentorship or media enquiries, direct people to " +
      SITE_URL +
      "/bookings.",
  );
  lines.push("");

  return lines.join("\n");
}

export function GET() {
  return new Response(body(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
