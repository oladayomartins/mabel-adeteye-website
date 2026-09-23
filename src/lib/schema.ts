/**
 * Structured data.
 *
 * Everything is emitted as a linked graph rather than as disconnected blocks:
 * every page node points back to the same `#person` and `#website` nodes via
 * `@id`. That is what lets a search engine or an LLM understand the whole site
 * as one entity instead of six unrelated documents.
 */
import {
  SITE_URL,
  aboutFaqs,
  accreditations,
  assets,
  brands,
  education,
  heroSize,
  insightRoom,
  memberships,
  orgUrls,
  person,
  pillars,
  press,
  recognitions,
  testimonials,
} from "./site";

export const ID = {
  person: `${SITE_URL}/#person`,
  website: `${SITE_URL}/#website`,
  image: `${SITE_URL}/#primaryimage`,
  org: (name: string) => `${SITE_URL}/#org-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
} as const;

/** An Organization node, linked to its official site so the entity resolves. */
function org(name: string) {
  const url = orgUrls[name];
  return {
    "@type": "Organization",
    "@id": ID.org(name),
    name,
    ...(url ? { url, sameAs: [url] } : {}),
  };
}

export const personNode = {
  // Plain Person. Do not union this with ProfessionalService/LocalBusiness —
  // those are Organization subtypes, so the union asserts that Mabel *is* a
  // business. Services are modelled separately on the Mentorship page.
  "@type": "Person",
  "@id": ID.person,
  name: person.name,
  alternateName: [person.shortName, "Mabel Aladenusi"],
  givenName: "Mabel",
  additionalName: "Adeteye",
  familyName: "Aladenusi",
  jobTitle: person.currentRole.title,
  description: person.summary,
  disambiguatingDescription:
    "Nigerian brand communications and public relations leader; Forbes Communications Council member and three-time PR Power List honoree.",
  url: SITE_URL,
  mainEntityOfPage: { "@id": ID.website },
  image: { "@id": ID.image },
  email: `mailto:${person.email}`,
  telephone: person.phone,
  sameAs: person.socials.map((s) => s.href),
  address: { "@type": "PostalAddress", addressCountry: "NG" },
  worksFor: org(person.currentRole.organisation),
  hasOccupation: {
    "@type": "Occupation",
    name: person.currentRole.title,
    occupationalCategory: "Brand and marketing communications",
  },
  knowsAbout: pillars.map((p) => p.title),
  knowsLanguage: "en",
  memberOf: memberships.map((m) => org(m.body)),
  hasCredential: accreditations.map((a) => ({
    "@type": "EducationalOccupationalCredential",
    name: a.note,
    credentialCategory: "Professional accreditation",
    recognizedBy: org(a.body),
  })),
  alumniOf: education.map((e) => ({
    "@type": "EducationalOrganization",
    name: e.school,
    ...(orgUrls[e.school] ? { url: orgUrls[e.school], sameAs: [orgUrls[e.school]] } : {}),
  })),
  award: recognitions.map((r) => `${r.title} (${r.year})`),
  subjectOf: press.map((item) => ({ "@type": "NewsArticle", "@id": item.url })),
};

export const imageNode = {
  "@type": "ImageObject",
  "@id": ID.image,
  url: assets.hero,
  contentUrl: assets.hero,
  width: heroSize.width,
  height: heroSize.height,
  caption: `${person.name}, ${person.currentRole.title} at ${person.currentRole.organisation}`,
};

export const websiteNode = {
  "@type": "WebSite",
  "@id": ID.website,
  url: SITE_URL,
  name: person.name,
  alternateName: person.shortName,
  description: person.summary,
  inLanguage: "en-GB",
  publisher: { "@id": ID.person },
  copyrightHolder: { "@id": ID.person },
  about: { "@id": ID.person },
};

/** The nodes every page carries. */
export const baseGraph = [personNode, imageNode, websiteNode];

type Crumb = { name: string; path: string };

export function breadcrumbNode(crumbs: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${SITE_URL}${crumbs[crumbs.length - 1].path}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}

type PageNodeInput = {
  /** A more specific WebPage subtype where one fits. */
  type?: string;
  path: string;
  name: string;
  description: string;
  crumbs?: Crumb[];
  /** CSS selectors whose text is the best spoken/extracted answer for this page. */
  speakable?: string[];
};

export function webPageNode({
  type = "WebPage",
  path,
  name,
  description,
  crumbs,
  speakable = ["h1", "main p"],
}: PageNodeInput) {
  const url = `${SITE_URL}${path}`;
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { "@id": ID.website },
    about: { "@id": ID.person },
    primaryImageOfPage: { "@id": ID.image },
    inLanguage: "en-GB",
    ...(crumbs ? { breadcrumb: { "@id": `${SITE_URL}${path}#breadcrumb` } } : {}),
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: speakable,
    },
  };
}

/** Testimonials as Review nodes, so praise is machine-readable, not just prose. */
export const reviewNodes = testimonials.map((t, i) => ({
  "@type": "Review",
  "@id": `${SITE_URL}/about#review-${i + 1}`,
  itemReviewed: { "@id": ID.person },
  reviewBody: t.quote,
  author: {
    "@type": "Person",
    name: t.name,
    ...(t.image ? { image: t.image } : {}),
  },
}));

/**
 * Press coverage as NewsArticle nodes, each `about` the Person.
 *
 * This is the strongest third-party corroboration on the site: it tells search
 * engines and LLMs that independent publications have written about this
 * specific entity, which is exactly the signal they weigh for authority.
 */
export const pressNodes = press.map((item) => ({
  "@type": "NewsArticle",
  "@id": item.url,
  headline: item.title,
  url: item.url,
  ...(item.date ? { datePublished: item.date } : {}),
  publisher: { "@type": "Organization", name: item.outlet.split(" — ")[0] },
  about: { "@id": ID.person },
  mentions: { "@id": ID.person },
  description: item.summary,
}));

/**
 * The About FAQ as FAQPage data. List answers are flattened to sentences —
 * `acceptedAnswer.text` is a string, and bullets read fine as one block.
 */
export const aboutFaqNode = {
  "@type": "FAQPage",
  "@id": `${SITE_URL}/about#faq`,
  mainEntity: aboutFaqs.map((entry) => ({
    "@type": "Question",
    name: entry.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: [entry.a, ...(entry.items ?? [])].filter(Boolean).join(" "),
    },
  })),
};

/**
 * MAA Insight Room as a recurring EventSeries.
 *
 * `Schedule` expresses "first Friday monthly at 19:00 Africa/Lagos" precisely,
 * which is what lets a search engine or assistant answer "when is the next
 * session?" without parsing prose.
 */
export const insightRoomNode = {
  "@type": "EventSeries",
  "@id": `${SITE_URL}/mentorship#insight-room`,
  name: insightRoom.name,
  description: insightRoom.tagline,
  url: `${SITE_URL}/mentorship#insight-room`,
  organizer: { "@id": ID.person },
  performer: { "@id": ID.person },
  eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  isAccessibleForFree: true,
  inLanguage: "en",
  about: [...insightRoom.topics],
  audience: {
    "@type": "Audience",
    audienceType: [...insightRoom.audience].join(", "),
  },
  eventSchedule: {
    "@type": "Schedule",
    repeatFrequency: "P1M",
    byDay: "https://schema.org/Friday",
    byMonthWeek: 1,
    startTime: "19:00",
    scheduleTimezone: "Africa/Lagos",
  },
};

export const brandListNode = {
  "@type": "ItemList",
  "@id": `${SITE_URL}/#brands`,
  name: "Brands Mabel Adeteye has led communications for",
  itemListElement: brands.map((b, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: { "@type": "Organization", name: b.name },
  })),
};

/** Wraps a set of nodes into a single @graph document. */
export function graph(nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
