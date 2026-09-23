/**
 * Single source of truth for site content.
 * Everything Mabel is likely to want changed lives here, not in the components.
 */

const FALLBACK_SITE_URL = "https://mabeladeteye.com";

/**
 * Resolves the public origin.
 *
 * Deliberately defensive, because `metadataBase: new URL(SITE_URL)` runs at
 * build time and throws on anything malformed — which fails the whole build,
 * not just one page. Three cases that bit us or nearly did:
 *
 *  - **Empty string.** A host with the variable *defined but blank* is not
 *    caught by `??`, which only falls back on null/undefined.
 *  - **No protocol.** "mabeladeteye.com" is the obvious thing to paste into a
 *    dashboard field, and `new URL()` rejects it.
 *  - **Trailing slash or path.** `.origin` normalises both away.
 */
function resolveSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!raw) return FALLBACK_SITE_URL;

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return FALLBACK_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl();

export const person = {
  name: "Mabel Adeteye Aladenusi",
  shortName: "Mabel Adeteye",
  role: "Strategic Communications Expert",
  headline: "I am Mabel Adeteye, Strategic Comms Expert",
  tagline:
    "A member of the Forbes Communications Council and 3-time PR Power List honoree.",
  summary:
    "Thought leader and brand communications professional driving global brand success. Over 16 years in brand management, public relations and corporate communications strategy for brands including Wema Bank, Mastercard, Coca-Cola, British Airways and Google.",
  currentRole: {
    title: "Head of Brands & Marketing Communications",
    organisation: "Wema Bank",
  },
  email: "me@mabeladeteye.com",
  phone: "+2348163167152",
  phoneDisplay: "+234 816 316 7152",
  location: "Nigeria — working globally",
  socials: [
    { label: "LinkedIn", href: "https://ng.linkedin.com/in/mabelaladenusiadeteye" },
    { label: "Instagram", href: "https://www.instagram.com/mabelaladenusiadeteye/" },
    { label: "X", href: "https://x.com/MabelAdeteye/" },
  ],
  /** Used for twitter:creator. */
  xHandle: "@MabelAdeteye",
} as const;

/**
 * Official URLs for the organisations named in Mabel's credentials.
 *
 * These are used as `sameAs` in structured data, which is how search engines and
 * AI systems resolve "CIPR" to the actual institution rather than guessing.
 * VERIFY these before launch — a wrong URL links the wrong entity.
 */
export const orgUrls: Record<string, string> = {
  "Forbes Communications Council": "https://councils.forbes.com/forbescommunicationscouncil",
  "Public Relations and Communications Association (PRCA), UK": "https://www.prca.global/",
  "CIPR International Committee": "https://www.cipr.co.uk/",
  IABC: "https://www.iabc.com/",
  "Chartered Institute of Marketing (CIM), UK": "https://www.cim.co.uk/",
  "Chartered Institute of Public Relations (CIPR), UK": "https://www.cipr.co.uk/",
  "Nigerian Institute of Public Relations (NIPR)": "https://nipr.org.ng/",
  "IESE Business School": "https://www.iese.edu/",
  "Babcock University": "https://www.babcock.edu.ng/",
  "Ahmadu Bello University": "https://abu.edu.ng/",
  "Lagos Business School": "https://www.lbs.edu.ng/",
  "Wema Bank": "https://www.wemabank.com/",
};

/**
 * Short, self-contained factual statements.
 *
 * Written to be quotable: each line stands on its own without surrounding
 * context, which is what LLMs and answer engines extract and cite.
 */
export const quickFacts = [
  { label: "Full name", value: "Mabel Adeteye Aladenusi" },
  { label: "Current role", value: "Head of Brands & Marketing Communications, Wema Bank" },
  { label: "Experience", value: "16+ years in brand management, public relations and corporate communications" },
  { label: "Based", value: "Nigeria, working with international brands" },
  { label: "Memberships", value: "Forbes Communications Council, PRCA UK, CIPR, NIPR, CIM, IABC" },
  { label: "Accreditations", value: "MCIM, MCIPR, ANIPR; Strategy & Sustainability (IESE)" },
  { label: "Recognition", value: "3× PR Power List honoree; Top 50 Most Influential Women in Marketing (WIMCA)" },
  { label: "Speaks on", value: "Strategic communications, crisis management, brand storytelling, reputation" },
] as const;

export const assets = {
  logo: "https://ik.imagekit.io/digit/Mabel/Mabel-Logo-1080-x-1920-px-1.png",
  hero: "https://ik.imagekit.io/digit/Mabel/Mabel-Aladenusi.png",
  loader: "https://ik.imagekit.io/digit/Mabel/Mabel%20Animation%20Logo.gif",
  /**
   * Social share card: the portrait padded onto brand burgundy at 1200x630.
   * The raw hero is a transparent PNG, which most platforms composite onto
   * black — this avoids that and gives the right aspect ratio for a link card.
   */
  ogImage:
    "https://ik.imagekit.io/digit/Mabel/Mabel-Aladenusi.png?tr=w-1200,h-630,cm-pad_resize,bg-6B1220",
  /**
   * Square face crop. Gives a genuinely different composition from the full
   * portrait without upscaling — the source is 543x750, so 520x520 stays inside
   * the native resolution.
   */
  heroSquare:
    "https://ik.imagekit.io/digit/Mabel/Mabel-Aladenusi.png?tr=w-520,h-520,fo-face",
  /** MAA Insight Room masthead lockup (1140x480, burgundy, transparent edges). */
  insightRoomBanner:
    "https://ik.imagekit.io/b492iukcb/MAA%20Personal%20Logo%20(1080%20x%201920%20px)%20(1280%20x%20240%20px).png",
  /**
   * Cartoon avatar for the site assistant. Background removed by ImageKit's AI
   * (`e-bgremove`), then cropped to head-and-shoulders — a full-body figure is
   * unreadable at the 56px launcher size.
   */
  assistantAvatar:
    "https://ik.imagekit.io/b492iukcb/transform-my-image-into-a-cartoon-style.jpg?tr=e-bgremove:cm-extract,x-330,y-20,w-700,h-700:w-240",
  /** Editorial portrait used for the Insight Room parallax band (720x1080). */
  insightRoomPortrait:
    "https://ik.imagekit.io/b492iukcb/PHOTO-2025-08-31-20-04-49%20(1).jpg",
} as const;

export const insightRoomBannerSize = { width: 1140, height: 480 } as const;
export const insightRoomPortraitSize = { width: 720, height: 1080 } as const;

/** True intrinsic size of the source portrait (543x750, transparent PNG). */
export const heroSize = { width: 543, height: 750 } as const;

export const nav = [
  { label: "About Me", href: "/about" },
  { label: "Gallery", href: "/gallery" },
  { label: "Events", href: "/events" },
  { label: "Mentorship", href: "/mentorship" },
  { label: "Insight Room", href: "/insight-room" },
  { label: "Press", href: "/press" },
  { label: "Bookings & Enquiries", href: "/bookings" },
] as const;

/**
 * Brands Mabel has led communications for.
 *
 * Each source PNG has its artwork floating on a differently-sized transparent
 * canvas — British Airways fills only 27% of its canvas height, Nokia 30%,
 * while Ford and Wema fill 100%. Dropped into equal boxes as-is, some would
 * render tiny and the row would not align. `crop` is the measured bounding box
 * of the real artwork, handed to ImageKit's extract transform so every URL
 * serves artwork only — then a single uniform box sizes them consistently.
 *
 * `ratio` is the trimmed artwork's aspect ratio, used for the intrinsic size.
 */
const BRAND_CDN = "https://ik.imagekit.io/b492iukcb";

type BrandSource = {
  name: string;
  file: string;
  /** Bounding box of the artwork within the source canvas. */
  crop: { x: number; y: number; w: number; h: number };
  /**
   * Set when the source has an opaque background rather than transparency.
   * Rendered with `mix-blend-mode: darken`, which drops a near-white backdrop
   * into our tint without touching the dark artwork — multiply would tint the
   * whole cell, and cropping alone still leaves a visible grey rectangle.
   */
  flatBg?: boolean;
};

const brandSources: BrandSource[] = [
  { name: "Etisalat Nigeria", file: "Etisalat%20Nigeria.png", crop: { x: 259, y: 194, w: 598, h: 697 } },
  { name: "Nokia", file: "Nokia-Logo.png", crop: { x: 20, y: 759, w: 3798, h: 642 } },
  { name: "Mastercard", file: "Mastercard%20logo.png", crop: { x: 22, y: 22, w: 175, h: 137 } },
  { name: "Wema Bank", file: "Wema-Bank-logo.png", crop: { x: 0, y: 0, w: 800, h: 444 } },
  { name: "British Airways", file: "British-Airways-Logo.png", crop: { x: 28, y: 781, w: 3787, h: 586 } },
  { name: "Coca-Cola", file: "Coca-Cola-logo%20.png", crop: { x: 166, y: 505, w: 3555, h: 1165 } },
  { name: "Ford", file: "Ford_Motor_Company_Logo.svg.webp", crop: { x: 0, y: 0, w: 3840, h: 1439 } },
  { name: "Google", file: "Google_2015_logo.svg.webp", crop: { x: 5, y: 6, w: 3807, h: 1254 } },
  { name: "Unilever", file: "unilever.jpg", crop: { x: 291, y: 48, w: 513, h: 568 }, flatBg: true },
  { name: "Intel", file: "Intel_logo_(2006-2020).svg", crop: { x: 0, y: 0, w: 1005, h: 663 } },
  { name: "Guinness Nigeria", file: "Guinness-Nigeria-Logo-header-2026.png", crop: { x: 0, y: 6, w: 294, h: 193 } },
  { name: "TVC Communications", file: "TVC-Communications-Logo-with-Trademark.png", crop: { x: 0, y: 0, w: 2419, h: 584 } },
];

/** Width served to the browser — comfortably above the 128px display box at 2x. */
const BRAND_WIDTH = 320;

export const brands = brandSources.map(({ name, file, crop, flatBg }) => ({
  name,
  src: `${BRAND_CDN}/${file}?tr=cm-extract,x-${crop.x},y-${crop.y},w-${crop.w},h-${crop.h}:w-${BRAND_WIDTH}`,
  width: BRAND_WIDTH,
  height: Math.round((BRAND_WIDTH * crop.h) / crop.w),
  flatBg: flatBg ?? false,
}));

export type Brand = (typeof brands)[number];

/** Verified credentials, used as the proof strip on the home page. */
export const credentialStrip = [
  "Forbes Communications Council",
  "3× PR Power List",
  "MCIM",
  "MCIPR",
  "ANIPR",
  "PRCA UK",
] as const;

/** The seven practice pillars, with Mabel's own copy for each. */
export const pillars = [
  {
    title: "Strategic Comms",
    lead: "Certified (MCIM, MCIPR, ANIPR) with 16+ years' experience leading global communications that align with business goals.",
    body: "I drive messaging that builds trust, elevates leadership, and navigates high-stakes moments including crises.",
  },
  {
    title: "Brand Management",
    lead: "With advanced brand certification, I've led rebrands and campaigns that boost engagement and recall.",
    body: "As a Forbes Council member and PR Power List honoree, I build authentic, resonant brand identities.",
  },
  {
    title: "Traditional & Digital PR",
    lead: "A CIPR and PRCA UK member, I fuse traditional PR with digital tactics for standout campaigns and coverage.",
    body: "My work spans headline news to YouTube monetisation — delivering impact with consistency and authenticity.",
  },
  {
    title: "Crisis Management",
    lead: "Known for calm crisis leadership, I manage brand threats with strategic messaging and stakeholder alignment.",
    body: "My award-winning work during 2020 turned disruption into trust, resilience, and renewed leadership.",
  },
  {
    title: "Campaign & Events Management",
    lead: "From Wema Bank to Coca-Cola, I lead large-scale, multi-channel campaigns from concept to delivery.",
    body: "My approach ensures emotional, cultural, and commercial relevance across every touchpoint.",
  },
  {
    title: "Sustainability & CSR",
    lead: "Certified in Strategy & Sustainability (IESE), I design CSR programmes that deliver purpose and real-world impact.",
    body: "I go beyond compliance — crafting transparent, values-driven storytelling for brands like Etisalat and TVC.",
  },
  {
    title: "Storytelling",
    lead: "As a Fate Foundation trainer, I craft stories that spark action — rooted in data and cultural insight.",
    body: "Trained by Google, CIM UK, and APCON, I create messages that travel across minds, markets, and media.",
  },
] as const;

/**
 * Career history.
 *
 * Each entry carries the source it came from. Periods are deliberately imprecise
 * where the sources are: no publication states the year she joined TVC, only
 * "over seven years" before the February 2023 Wema Bank appointment — so the
 * label says that rather than inventing a start date.
 */
export const career = [
  {
    period: "2023 — present",
    title: "Head, Brands & Marketing Communications",
    org: "Wema Bank",
    body: "Leading brand and marketing communications for one of Nigeria's oldest indigenous banks.",
    source: {
      label: "Brand Communicator",
      url: "https://brandcom.ng/2023/02/24/wema-bank-appoints-mabel-adeteye-as-head-brand-marketing-communications/",
    },
  },
  {
    period: "Seven years, to 2023",
    title: "Head, Corporate Communications, PR & Digital",
    org: "TVC Communications",
    body: "Corporate communications, public relations and digital strategy across TVC News, TVC Entertainment and Max FM.",
    source: {
      label: "BusinessDay",
      url: "https://businessday.ng/companies/article/cannes-lions-names-wema-banks-adeteye-to-2026-global-jury-panel/",
    },
  },
  {
    period: "Earlier career",
    title: "Agency & consultancy",
    org: "including The Quadrant Company",
    body: "Campaigns for British Airways, Coca-Cola, Ford Motors, Mastercard, Nokia, Unilever, Etisalat, Intel and Guinness Nigeria — across aviation, FMCG, banking, technology and telecoms.",
    source: {
      label: "Brand Times",
      url: "https://www.brandtimes.com.ng/from-media-to-banking-mabel-adeteye-joins-wema-bank-as-head-brand-marketing-communications/",
    },
  },
] as const;

/**
 * `logo` is optional and belongs to the awarding body, not to Mabel. Cannes
 * Lions is deliberately NOT in `brands` — she sat on its jury, she did not run
 * its communications, and putting it in a "brands I've worked with" wall would
 * misrepresent the relationship.
 */
export type Recognition = { year: string; title: string; logo?: string };

export const recognitions: Recognition[] = [
  {
    year: "2026",
    title: "Jury Member, Cannes Lions International Festival of Creativity — Brand Experience & Activation",
    logo: "https://ik.imagekit.io/b492iukcb/585698534f6ae202fedf2749.png?tr=w-260",
  },
  { year: "2026", title: "Jury Member, SABRE Awards Africa (PRovoke Media)" },
  { year: "2024", title: "Forbes Communications Council Member" },
  { year: "2022–2025", title: "3× PR Power List Honoree" },
  { year: "2024", title: "Top 50 Most Influential Women in Marketing (WIMCA)" },
  { year: "2024", title: "Chair, Communications Committee — WIMBIZ" },
  { year: "2024", title: "Admirable Women in Leadership Award" },
  { year: "2021–2024", title: "4× Committee Member, CIPR International" },
  { year: "2024", title: "Member — NIPR, CIPR, CIM, PRCA, IABC" },
  { year: "2024", title: "Speaker, Trainer and Communications Advisor" },
  { year: "2022", title: "Most Outstanding Corporate Comms Professional" },
];

/**
 * Testimonials.
 *
 * `image` is only set where the supplied filename identifies the person
 * unambiguously. Entries without one fall back to a neutral avatar rather than
 * risk putting a real person's face against someone else's words.
 */
const REVIEWER_CDN = "https://ik.imagekit.io/b492iukcb";

export type Testimonial = { quote: string; name: string; image?: string };

/*
 * Unassigned reviewer photos, pending confirmation:
 *   - Managing-Partner-at-RHG-Consulting-Ltd.jpg  (Kesiena Ogbemi or Stephen Shofu?)
 *   - Kehinde-Bamigbetan.jpg  (no matching testimonial — held back deliberately)
 * Add the URL to the matching entry below once confirmed.
 */

export const testimonials: Testimonial[] = [
  {
    quote:
      "She is a problem solver and a determined leader who knows how to get her team to achieve set objectives.",
    name: "Dr. Morayo Afolabi-Brown",
    image: `${REVIEWER_CDN}/Morayo-Afolabi-Brown.jpg?tr=w-160,h-160,fo-face`,
  },
  {
    quote:
      "Mabel is, without doubt, one of the hardest working, most creative and talented PR and Corp Comms professionals I have worked with. Give her her wings and she will fly high for your company and your brand.",
    name: "Andrew Halon",
    image: `${REVIEWER_CDN}/Adrew.jpg?tr=w-160,h-160,fo-face`,
  },
  {
    quote:
      "I worked with Mabel when she was a Public Relations Analyst at the Quadrant Company. She showed exceptional aptitude towards media relations and management and she was very meticulous in the delivery of her role. She knows how to own whatever role she finds herself in and bring out the best in it.",
    name: "Oreoluwa Ettu",
    image: `${REVIEWER_CDN}/Oreoluwa-Ettu.jpg?tr=w-160,h-160,fo-face`,
  },
  {
    quote:
      "You will meet a lot of people in your career; one of those you should keep like stolen treasure is Mabel. She is thorough, dedicated, precise, honest and intelligent. I thoroughly enjoyed working with her. A solid team player, she has the charisma and energy of a natural born leader. I expect greater things from her in the days to come.",
    name: "Kesiena Ogbemi",
  },
  {
    quote:
      "Mabel is a very articulate person who looks into detail and keeps a very close relationship with her customers. I have worked closely with you and understood how important it is for you that the customer is satisfied.",
    name: "Ademola Sanya",
    image: `${REVIEWER_CDN}/Ad.jpg?tr=w-160,h-160,fo-face`,
  },
  {
    quote:
      "Mabel's creative thinking, expertise, positive can-do attitude and drive as a Public Relations professional makes her an absolute pleasure to work with. She continually delivers results; goes above and beyond in providing exceptional service and support to all clients under her portfolio; and shows genuine integrity and respect as a service provider. Mabel is enthusiastic, personable and a brilliant networker. Her strengths in staying across issues, pro-actively offering solutions and ideas and being adept at all aspects of communications make her a valuable contributor to any situation or team.",
    name: "Stephen Shofu",
  },
];

export const memberships = [
  { body: "Forbes Communications Council", note: "Official member" },
  {
    body: "Public Relations and Communications Association (PRCA), UK",
    note: "The world's largest and most influential PR and communications membership body",
  },
  { body: "CIPR International Committee", note: "Four years of service, 2021–2024" },
  { body: "IABC", note: "International Association of Business Communicators" },
] as const;

export const accreditations = [
  {
    body: "Chartered Institute of Marketing (CIM), UK",
    note: "MCIM — digital marketing, integrated communications and marketing",
  },
  {
    body: "Chartered Institute of Public Relations (CIPR), UK",
    note: "MCIPR — accredited in public relations",
  },
  {
    body: "Nigerian Institute of Public Relations (NIPR)",
    note: "ANIPR — accredited in public relations",
  },
  {
    body: "IESE Business School",
    note: "Certified in Strategy & Sustainability",
  },
  {
    body: "Advanced Branding & Google certifications",
    note: "Certified Advanced Branding expert, plus Google Digital Sales, YouTube Channel Growth and Campaign Manager certifications",
  },
] as const;

export const education = [
  { school: "Babcock University", note: "Department of Business Administration" },
  { school: "Ahmadu Bello University", note: "" },
  { school: "Lagos Business School", note: "" },
] as const;

/**
 * Mentorship formats.
 *
 * Deliberately free of durations, response times, minimum terms and pricing —
 * none of those have been confirmed by Mabel. Add them here once they are, and
 * the page will pick them up (each entry supports an optional `meta` line).
 */
/**
 * MAA Insight Room — Mabel's own monthly mentorship platform.
 *
 * Every detail below is verified against the launch coverage (Tribune, Brand
 * Icon Image, BusinessDay, Brand Communicator, Streamline Feed, August 2026).
 * The timezone appears in none of those sources — it was confirmed directly by
 * Mabel as Lagos / West African Time.
 *
 * Registration happens on /insight-room itself — that page is the destination
 * promoted on social, so there is no external sign-up link to store.
 */
export const insightRoom = {
  name: "MAA Insight Room",
  tagline:
    "A monthly room for the thinking behind business and career decisions — not quick answers, not generic advice.",
  schedule: "First Friday of every month",
  time: "7:00 p.m. WAT (Lagos)",
  cost: "Free to attend — registration required",
  firstSession: "7 August 2026",
  audience: ["Professionals", "Founders", "Business leaders", "Emerging talents"],
  topics: [
    "Business strategy",
    "Brand and executive communications",
    "Leadership",
    "Professional positioning",
    "Organisational reputation",
    "Marketing",
  ],
  howItWorks: [
    "Register for the session — attendance is free.",
    "Submit the questions and issues you want addressed when you register.",
    "Access details arrive by email once you are registered.",
    "Sessions are built around what participants actually brought.",
  ],
  quote:
    "We live in a time where people have access to more information, more opinions, and more tools than ever before, but access does not automatically produce insight.",
  source: {
    label: "Tribune Online",
    url: "https://tribuneonlineng.com/brand-expert-launches-leadership-platform-to-promote-conversations-on-business/",
  },
} as const;

export type Track = { title: string; meta?: string; body: string; featured?: boolean };

export const mentorshipTracks: Track[] = [
  {
    title: "One-to-one mentoring",
    body: "Direct mentoring for communications professionals and leaders — on career direction, handling high-stakes moments, and building authority in the room.",
    featured: true,
  },
  {
    title: "In-house team training",
    body: "Training for communications, marketing and leadership teams, built around your own live cases rather than generic material.",
  },
  {
    title: "Workshops & masterclasses",
    body: "Sessions for conferences, associations and corporate academies across any of the seven practice areas below.",
  },
  {
    title: "Advisory",
    body: "Communications counsel for organisations that need senior judgment on reputation, positioning or a live issue.",
  },
];

/**
 * About FAQ.
 *
 * Mabel's own copy, reshaped from headings into questions. Question-and-answer
 * is the most extractable structure there is: it feeds FAQPage schema, and it is
 * the format answer engines quote back most reliably.
 *
 * "Who am I?" from the source copy is intentionally not repeated here — her
 * biography already opens this page, and restating it verbatim a few hundred
 * pixels below would be duplicate content on the same URL.
 *
 * Questions are asked in the FIRST person ("What do I do?"), never the second
 * ("What do you do?"). The whole site speaks as Mabel, and her own source copy
 * used "Who am i?" — second-person questions break that voice by turning the
 * page into an interview. Keep any new entry in the same voice. "You" is fine
 * when it addresses the reader ("built around your own live cases").
 */
export type FaqEntry = {
  q: string;
  a?: string;
  items?: readonly string[];
};

export const aboutFaqs: FaqEntry[] = [
  {
    q: "What do I do?",
    items: [
      "I lead strategic marketing and communications that drive brand growth and business alignment.",
      "I develop integrated campaigns across PR, digital, and traditional platforms to enhance visibility, engagement and ROI.",
      "I build and manage brand identity through strategic storytelling, positioning, and stakeholder engagement.",
      "I guide executive communications and crisis response, ensuring reputational protection and leadership visibility.",
      "I use data and insight to optimise messaging, improve ROI, and elevate consumer and customer experience.",
    ],
  },
  {
    q: "Who are the clients and brands I work with?",
    items: [
      "Senior executives and C-suite leaders seeking strategic visibility and positioning",
      "Corporate global and local brands across banking, media, aviation, telecommunications, technology, automobile and consumer goods",
      "Agencies, institutions and NGOs in need of integrated communications or brand-building strategies",
      "Startups and founders looking for brand clarity, campaign development and public relations guidance",
      "Mission-driven organisations and thought leaders looking to drive visibility and penetration",
    ],
  },
  {
    q: "How can I help?",
    items: [
      "Brand strategy and development — from identity design to market positioning",
      "Corporate and executive communications — messaging, crisis response, internal alignment",
      "PR and media relations — storytelling, press engagement, reputation management",
      "Digital transformation and campaigns — multichannel marketing, social media, YouTube monetisation",
      "Leadership and team development — mentoring, cross-functional alignment, communication training",
    ],
  },
  {
    q: "What is the highlight of my expertise?",
    items: [
      "Integrated marketing communications and brand strategy across digital, PR, social and ATL/BTL",
      "Executive and thought leadership positioning and amplification across verticals",
      "Crisis and reputation management during high-pressure and sensitive moments",
      "Youth and culture-driven campaigns with innovation at the core",
      "Global campaign execution for multinational brands with cross-country reach",
      "Content strategy and storytelling that connects emotionally with diverse audiences and drives impact",
      "Strategic leadership recognised by multiple industry awards and advisory board roles",
    ],
  },
  {
    q: "What are my signature campaigns and projects?",
    items: [
      "Coca-Cola “Share a Coke” Nigeria",
      "British Airways Leaders of Tomorrow",
      "Wema Bank One Day MD/CEO",
      "Wema Bank 80th Anniversary",
      "ALAT by Wema — Sounds of ALAT",
      "TVC crisis communications during the End SARS movement",
      "Rebranding of TVC Communications (formerly Continental Broadcasting Services)",
    ],
  },
  {
    q: "What recognitions and leadership roles do I hold?",
    items: recognitions.map((r) => `${r.title} — ${r.year}`),
  },
];

/**
 * Signature campaigns — the portfolio.
 *
 * `brand` must match a name in `brands` so the card can show that logo. Where
 * there is no logo (TVC), the card falls back to a typographic treatment rather
 * than a placeholder image.
 */
export type Campaign = {
  title: string;
  brand?: string;
  sector: string;
  tags: readonly string[];
};

export const campaigns: Campaign[] = [
  {
    title: "“Share a Coke” Nigeria",
    brand: "Coca-Cola",
    sector: "FMCG",
    tags: ["Campaign", "Youth & culture"],
  },
  {
    title: "Leaders of Tomorrow",
    brand: "British Airways",
    sector: "Aviation",
    tags: ["Campaign", "Youth & culture"],
  },
  {
    title: "One Day MD/CEO",
    brand: "Wema Bank",
    sector: "Banking",
    tags: ["Engagement", "Youth & culture"],
  },
  {
    title: "80th Anniversary",
    brand: "Wema Bank",
    sector: "Banking",
    tags: ["Brand", "Milestone"],
  },
  {
    title: "Sounds of ALAT",
    brand: "Wema Bank",
    sector: "Digital banking",
    tags: ["Digital", "Music & culture"],
  },
  {
    title: "Crisis communications, End SARS",
    brand: "TVC Communications",
    sector: "Media — TVC Communications",
    tags: ["Crisis", "Reputation"],
  },
  {
    title: "Rebranding TVC Communications",
    brand: "TVC Communications",
    sector: "Media — formerly Continental Broadcasting Services",
    tags: ["Rebrand", "Identity"],
  },
];

/** Logo for a campaign's brand, if one exists in the brand wall. */
export function brandLogo(name?: string) {
  return name ? brands.find((b) => b.name === name) : undefined;
}

export const faqs = [
  {
    q: "Do I take work outside Nigeria?",
    a: "Yes. I have led communications for global brands including Mastercard, British Airways, Coca-Cola, Nokia and Google, and served four years on the CIPR International Committee.",
  },
  {
    q: "What can I mentor on?",
    a: "Strategic communications, brand management, traditional and digital PR, crisis management, campaign and events management, sustainability and CSR, and storytelling — the seven practice areas set out on this page.",
  },
  {
    q: "What are my training credentials?",
    a: "I am a Fate Foundation trainer and a certified Speaker, Trainer and Communications Advisor, trained by Google, CIM UK and APCON, and accredited with CIPR, NIPR, CIM and PRCA.",
  },
  {
    q: "How do we start?",
    a: "Send a brief through the enquiry form or call directly. Format, scope and timing are shaped on a first conversation.",
  },
] as const;

export type EventItem = {
  title: string;
  kind: "Keynote" | "Panel" | "Workshop" | "Masterclass";
  date: string; // ISO — used for schema.org and sorting
  dateLabel: string;
  location: string;
  body: string;
  href?: string;
};

/** Upcoming events. Add entries here; ordering is handled in the page. */
export const upcomingEvents: EventItem[] = [];

/** TODO: replace with Mabel's real past engagements. */
export const pastEvents: EventItem[] = [];

export type GalleryItem = {
  src?: string;
  /** True intrinsic size, so the lightbox reserves the right box. */
  width?: number;
  height?: number;
  /** object-position for the grid crop, where centring cuts badly. */
  focus?: string;
  alt: string;
  caption?: string;
  /** Placeholder tiles render as branded blocks until a real image is dropped in. */
  placeholder?: boolean;
  /** Tiles that should run taller in the masonry grid. */
  tall?: boolean;
};

const GALLERY_CDN = "https://ik.imagekit.io/b492iukcb";

/**
 * Portrait gallery.
 *
 * These are all studio and press portraits — there is no event photography yet,
 * which is why the page speaks about portraits rather than promising keynotes
 * and panels it cannot show. Add event images here and reword the page lede.
 */
export const gallery: GalleryItem[] = [
  {
    src: `${GALLERY_CDN}/PHOTO-2025-08-31-20-04-49%20(1).jpg`,
    width: 720,
    height: 1080,
    alt: "Mabel Adeteye seated in a navy suit with feathered cuffs against a pale grey backdrop",
    caption: "Editorial portrait",
    tall: true,
  },
  {
    src: `${GALLERY_CDN}/Mabel%20.jpg`,
    width: 1024,
    height: 683,
    alt: "Mabel Adeteye in a black outfit against a warm brown studio backdrop",
    caption: "Studio portrait",
  },
  {
    src: `${GALLERY_CDN}/Mabel%20photoshoot.jpg`,
    width: 1080,
    height: 711,
    alt: "Mabel Adeteye leaning forward in a dark feathered jacket against a charcoal backdrop",
    caption: "Photoshoot",
  },
  {
    src: `${GALLERY_CDN}/Mabel-Adeteye-Headshot-e1723633885974.jpg`,
    width: 768,
    height: 641,
    alt: "Mabel Adeteye in a white outfit against a brown studio backdrop",
    caption: "Headshot",
    tall: true,
  },
  {
    src: `${GALLERY_CDN}/Mabel-Adeteye.png`,
    width: 601,
    height: 602,
    alt: "Mabel Adeteye seated in a pale pink outfit, wearing glasses",
    caption: "Portrait",
  },
  {
    src: `${GALLERY_CDN}/WEB-13.jpg`,
    width: 600,
    height: 300,
    focus: "center 35%",
    alt: "Mabel Adeteye seated in a pale pink outfit against a brown backdrop",
    caption: "Seated portrait",
  },
  {
    src: `${GALLERY_CDN}/fMcJL5ZZ_400x400.jpg`,
    width: 400,
    height: 400,
    alt: "Mabel Adeteye in a white outfit, hand to chin",
    caption: "Profile portrait",
  },
  {
    src: `${GALLERY_CDN}/images%20(2).jpeg`,
    width: 225,
    height: 225,
    alt: "Mabel Adeteye at her desk in a magenta blazer",
    caption: "At work",
  },
];

export type PressItem = {
  outlet: string;
  title: string;
  url: string;
  /** ISO date — omitted where the source does not state one. */
  date?: string;
  dateLabel?: string;
  kind: "Interview" | "Feature" | "Announcement" | "Appointment" | "Profile";
  summary: string;
};

/**
 * Press coverage.
 *
 * Every entry below was fetched and read before being added — headline, date and
 * subject confirmed against the live page. Do not add a link here that has not
 * been opened and verified; a dead or misattributed citation on a reputation
 * consultant's own press page is worse than no citation.
 */
export const press: PressItem[] = [
  {
    outlet: "BusinessDay",
    title: "Cannes Lions names Wema Bank’s Adeteye to 2026 global jury panel",
    url: "https://businessday.ng/companies/article/cannes-lions-names-wema-banks-adeteye-to-2026-global-jury-panel/",
    date: "2026-05-10",
    dateLabel: "10 May 2026",
    kind: "Feature",
    summary:
      "Named to the Brand Experience & Activation jury for the 2026 festival in Cannes, 22–26 June.",
  },
  {
    outlet: "THISDAY",
    title: "Cannes Lions Names Mabel Adeteye to 2026 Global Jury Panel",
    url: "https://www.thisdaylive.com/2026/05/12/cannes-lions-names-mabel-adeteye-to-2026-global-jury-panel/",
    date: "2026-05-12",
    dateLabel: "12 May 2026",
    kind: "Feature",
    summary:
      "“Creativity is no longer defined by geography. Some of the most exciting brand experiences today are coming from markets that understand people deeply.”",
  },
  {
    outlet: "Vanguard",
    title: "Wema Bank’s Mabel Adeteye appointed jury member for 2026 SABRE Awards Africa",
    url: "https://www.vanguardngr.com/2026/03/wema-banks-mabel-adeteye-appointed-jury-member-for-2026-sabre-awards-africa/",
    date: "2026-03-11",
    dateLabel: "11 March 2026",
    kind: "Feature",
    summary:
      "Judging over 500 submissions alongside senior communications professionals from across Africa.",
  },
  {
    outlet: "BusinessDay",
    title: "Wema Bank’s Mabel Adeteye makes jury members list for SABRE Awards Africa",
    url: "https://businessday.ng/news/article/wema-banks-mabel-adeteye-makes-jury-members-list-for-sabre-awards-africa/",
    date: "2026-03-11",
    dateLabel: "11 March 2026",
    kind: "Feature",
    summary:
      "“The SABRE Awards remain one of the most respected global benchmarks for strategic communications.”",
  },
  {
    outlet: "BusinessDay",
    title: "Adeteye moves to deepen conversations around business, executive communications",
    url: "https://businessday.ng/news/article/adeteye-moves-to-deepen-conversations-around-business-executive-communications/",
    date: "2026-08-07",
    dateLabel: "7 August 2026",
    kind: "Feature",
    summary:
      "On the launch of MAA Insight Room, a monthly platform for deeper conversations on business strategy, leadership and executive communications.",
  },
  {
    outlet: "Brand Communicator",
    title: "Mabel Adeteye Launches MAA Insight Room to Drive Conversations on Business, Leadership",
    url: "https://brandcom.ng/2026/08/07/mabel-adeteye-launches-maa-insight-room-to-drive-conversations-on-business-leadership/",
    date: "2026-08-07",
    dateLabel: "7 August 2026",
    kind: "Announcement",
    summary:
      "“The real advantage is no longer simply knowing more. It is being able to ask better questions.”",
  },
  {
    outlet: "BusinessDay — Women in Business",
    title: "Mabel Adeteye, Head, Brand & Marketing Communications, Wema Bank",
    url: "https://businessday.ng/interview/women-in-business/article/mabel-adeteye-head-brand-marketing-communications-wema-bank/",
    date: "2025-03-21",
    dateLabel: "21 March 2025",
    kind: "Interview",
    summary:
      "On building a career in corporate communications and brand management, and holding on to your values and authenticity while doing it.",
  },
  {
    outlet: "The Comms Avenue",
    title: "The Comms Spotlight: Mabel Adeteye, Head, Brand & Marketing Communications, Wema Bank",
    url: "https://thecommsavenue.com/the-comms-spotlight-mabel-adeteye-head-brand-marketing-communications-wema-bank/",
    date: "2024-08-21",
    dateLabel: "21 August 2024",
    kind: "Interview",
    summary:
      "From nearly studying medicine to leading communications strategy at a national bank — and what she tells emerging professionals.",
  },
  {
    outlet: "Marketing Edge",
    title: "Meet MARKETING EDGE’s 1st Quarterly Virtual Summit Panelist — Mabel Adeteye",
    url: "https://marketingedge.com.ng/meet-marketing-edges-1st-quarterly-virtual-summit-panelist-mabel-adeteye/",
    kind: "Feature",
    summary:
      "Announced as a panelist for the magazine’s inaugural quarterly virtual summit.",
  },
  {
    outlet: "Brand Communicator",
    title: "Wema Bank Appoints Mabel Adeteye As Head, Brand & Marketing Communications",
    url: "https://brandcom.ng/2023/02/24/wema-bank-appoints-mabel-adeteye-as-head-brand-marketing-communications/",
    date: "2023-02-24",
    dateLabel: "24 February 2023",
    kind: "Appointment",
    summary:
      "Joining Wema Bank from TVC Communications, where she was Head of Corporate Communications, PR & Digital.",
  },
  {
    outlet: "Cannes Lions",
    title: "Mabel Adeteye — Brand Experience & Activation Jury",
    url: "https://www.canneslions.com/awards/jury/mabel-adeteye-411226",
    kind: "Profile",
    summary:
      "Official jury profile for the Brand Experience & Activation Lions.",
  },
];

export const enquiryTopics = ["Speaking", "Mentorship", "Media", "Other"] as const;
