# Mabel Adeteye Aladenusi — personal brand website

Next.js 16 (App Router) + Tailwind v4. Built to the **1a editorial / reference-led**
wireframe direction, using the burgundy brand sheet from the design file.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — every page prerenders static
```

## Pages

| Route | Page |
| --- | --- |
| `/` | Home — editorial hero, practice band, next steps |
| `/about` | About Me — bio, stats, career timeline, testimonials |
| `/gallery` | Gallery — masonry grid with lightbox |
| `/events` | Events — speaking formats, upcoming, past appearances |
| `/mentorship` | Mentorship — engagement tracks, process, FAQ |
| `/press` | As seen in the press — verified third-party coverage |
| `/bookings` | Bookings & Enquiries — enquiry form, speaker kit, contact |

## Editing content

**Almost everything lives in [`src/lib/site.ts`](src/lib/site.ts)** — bio, stats,
testimonials, timeline, mentorship tracks, FAQs, events, gallery items, social links
and the contact email. Change it there; the pages read from it.

- **Events** — add entries to `upcomingEvents` / `pastEvents`. Upcoming events
  automatically emit `Event` structured data. The Upcoming section shows a
  "check availability" card when the list is empty.
- **Gallery** — add `{ src, alt, caption }` to `gallery`. Entries marked
  `placeholder: true` render as branded hatched tiles until a real image replaces
  them; nine are seeded so the grid reads as intentional before real photos arrive.
- **Long-form copy** on About lives inline in `src/app/about/page.tsx`.

## Before launch

1. **Set `NEXT_PUBLIC_SITE_URL`** to the live domain (see `.env.example`). It drives
   canonical URLs, the sitemap, robots.txt, Open Graph tags and JSON-LD. The default
   placeholder is `https://mabeladeteye.com`.

   `resolveSiteUrl()` in `lib/site.ts` is deliberately defensive: it falls back on a
   blank value, adds a missing `https://`, and normalises away trailing slashes and
   paths. `metadataBase: new URL(SITE_URL)` runs at build time, so a malformed value
   fails the entire build rather than one page — a blank variable on the host took
   down a Vercel deploy exactly this way.
2. **Set `NEXT_PUBLIC_FORM_ENDPOINT`** to a Formspree (or equivalent) endpoint. Until
   it is set, the enquiry form falls back to opening the visitor's mail client
   addressed to `person.email` — functional, but not ideal.
3. **Fill the remaining content gaps.** Biography, the seven pillars, recognitions,
   brands, testimonials, contact details and social links are all Mabel's own
   supplied copy. Still outstanding:
   - **Events** — `upcomingEvents` and `pastEvents` are empty; the page renders
     graceful empty states until real dates are added.
   - **Gallery** — one real image (the portrait) plus eight branded placeholder
     tiles awaiting real event photography.
   - **Mentorship terms** — formats are described without durations, response
     times, minimum terms or pricing, because none have been confirmed. Each
     entry in `mentorshipTracks` takes an optional `meta` line; fill it in and
     the page renders it.
4. **Supply a higher-resolution portrait.** The current hero
   (`Mabel-Aladenusi.png`) is only **543×750**. The desktop hero displays it at
   up to 660px wide, so it upscales and will look soft on high-DPI screens. A
   source around **1400×1930** would render crisply everywhere.
4. **Replace the gallery placeholders** with real event photography.

## Home page sections

1. Hero — animated backdrop, portrait, lead testimonial. The `<section>` runs
   **full width** so the backdrop bleeds to the viewport edges; the inner wrapper
   holds the 1360px measure. Constrained to the content width, the backdrop's
   wash and rings stop short on wide screens and leave bare strips either side.
2. Brands I've worked with — logo wall
3. What I do — ink band, seven pillar cards + accreditation strip
4. **Selected work** — signature campaigns carousel, "See more" → About
5. **Testimonials** — ink band, carousel
6. Next steps — Mentorship / Bookings cards

The marquee, a "why work with me" stat panel and a latest-press strip were all
built and then removed: the marquee already runs on About, and the other two
restated content that About and /press cover properly. A homepage earns more
from being short than from mirroring every section of a reference design.

## About page layout

The page alternates deliberately rather than stacking identical sections:

| | Section | Treatment |
| --- | --- | --- |
| 1 | Intro | Split — sticky portrait column, biography scrolls past it |
| 2 | At a glance | Full-bleed **tint** band |
| 3 | Brands | Paper |
| 4 | Pull quote | Full-bleed **burgundy** band, circular face crop, parallax rings |
| 5 | What I do | **Ink band, eight numbered cards** — seven pillars plus a CTA cell |
| 5b | Marquee | Rotated burgundy band of practice areas, self-scrolling |
| 6 | Career | Sticky heading + **dot-connector** sourced timeline |
| 7 | Recognitions & Credentials | Full-bleed **tint** band, list beside accordion |
| 8 | Gallery teaser | Picture blocks with parallax, linking to /gallery |
| 9 | FAQ | Sticky heading + accordion |
| 10 | Testimonials | Full-bleed **ink** band, featured quote |
| 11 | CTA | Paper |

### Primitives

- `.band` / `.band-ink` / `.band-tint` / `.band-burgundy` — full-bleed colour.
  Sections are already full width, so these only carry colour and an inner
  `.shell` handles the measure. No `100vw` maths, which avoids the classic
  scrollbar-overflow bug.
- `.sticky-media` — holds a column in place while its sibling scrolls. Applied as
  `md:sticky-media` so it is `static` on mobile.
- `.marquee` / `.marquee-track` — the rotated scrolling band. The list renders
  twice and translates by exactly `-50%`, so the loop is seamless; the second
  copy is `aria-hidden` so each term is announced and crawled once. The band is
  rotated and over-wide, so **its wrapper must clip it** or it extends the
  document past the viewport.
- `.parallax` — scroll-driven parallax via `animation-timeline: view()`. Runs on
  the compositor with **no scroll listener and no JavaScript**. Guarded by
  `@supports`, so browsers without it (Firefox, currently) get the static image
  rather than a broken half-state, and it is off under
  `prefers-reduced-motion`. `.parallax-soft` is the slower variant for decorative
  motifs.

### Two traps worth remembering

**`max-w-[NNch]` must sit on the element that sets the font size.** On a wrapper
it resolves against 16px body text — a display heading inside a `max-w-[22ch]`
wrapper got crushed to ~176px and broke one word per line.

**Parallax wraps the image, never the link.** `.parallax > *` transforms every
direct child, so applying it to a tile that also contains a caption scales the
caption out of frame.

## FAQ

Two FAQs, on different URLs, each emitting its own `FAQPage` node:

- **About** (`aboutFaqs`) — Mabel's own copy, reshaped from headings into
  questions: what she does, who she works with, how she helps, her expertise,
  signature campaigns, and recognitions. Question-and-answer is the most
  extractable structure there is, which is why this content lives here rather
  than as more prose.
- **Mentorship** (`faqs`) — mentorship-specific questions.

`Accordion` renders prose, a bulleted list, or both (`{ q, a?, items? }`), and
still works with JavaScript disabled — it is built on native `<details>`.

**Questions are asked in the first person** ("What do I do?"), never the second
("What do you do?"). The whole site speaks as Mabel, and her own source copy used
"Who am i?" — second-person questions break that voice by turning the page into
an interview. Answers are first person for the same reason. "You" is correct when
it addresses the *reader* ("built around your own live cases").

Note: the "Who am I?" paragraph from the source copy is deliberately **not** in
the About FAQ. Her biography already opens that page, and repeating it a few
hundred pixels below would be duplicate content on the same URL.

## Career timeline

`career` in lib/site.ts, rendered on About. **Every entry carries a link to the
source it came from**, shown under the role.

Periods are deliberately imprecise where the sources are. No publication states
the year she joined TVC Communications — only "over seven years" before the
February 2023 Wema Bank appointment — so the label reads "Seven years, to 2023"
rather than inventing a start date. Do not tighten these without a source that
states the dates.

## Carousels

`src/components/Carousel.tsx` is the shared mechanism, used by
`CampaignCarousel` and `TestimonialCarousel`.

Native **scroll-snap** does the work — the track is a real horizontal scroller,
so touch swipe, trackpad, keyboard and screen readers all behave correctly for
free. The arrow buttons are an enhancement over that, not the mechanism, so the
carousel still works with JavaScript disabled. `tone="dark"` inverts the
controls for carousels on an ink or burgundy band.

**Signature campaigns** — each card shows the brand's logo, pulled from the same
`brands` array as the logo wall via `brandLogo()`, so a campaign's `brand` must
match a brand name exactly. Campaigns with no logo (TVC) fall back to a
typographic block rather than a placeholder image.

**Testimonials** use `TestimonialFeature`, not the carousel. The quotes run from
18 to 90 words, so a card row reads badly either way: equal heights leave voids,
natural heights end raggedly (290px next to 631px). Showing one at a time lets
each quote set at a readable size whatever its length.

Every quote stays in the DOM — inactive ones are stacked in the same grid cell
and hidden with `visibility`, never unmounted. That keeps all six crawlable, and
makes the container as tall as the longest, so switching never shifts layout.
The avatar rail doubles as the index and the control.

### No star ratings

Testimonials carry an oversized quotation mark, not stars. These are written
recommendations, not scored reviews — none of them came with a rating, so five
stars would be inventing one. If they are ever collected through a platform that
records an actual score, add a rating field and the stars can come back.

## Press page

`src/app/press/page.tsx`, data in `press` (lib/site.ts).

**Every entry was fetched and read before being added** — headline, publication
date and subject confirmed against the live page, and all URLs re-checked for a
200 response. Do not add a link here that has not been opened and verified: a
dead or misattributed citation on a reputation consultant's own press page is
worse than no citation at all.

Cards carry a typographic masthead block, **not** the article's own image. Every
one of these articles exposes an OG image, but hotlinking them would put load
time and availability outside our control and the hosting rights belong to the
publishers. If Mabel supplies the press photographs, they drop straight in.

Entries without a `date` are ones where the source does not state a reliable
publication date (some outlets show only "2 years ago"); the layout omits the
date line rather than guessing.

Each item also emits a `NewsArticle` node `about` the Person, and the Person node
carries them as `subjectOf`. That is the strongest third-party corroboration on
the site — independent publications writing about this specific entity is exactly
the signal search engines and LLMs weigh for authority — and the same list is
mirrored into `/llms.txt`.

## Brand logo wall

`src/components/BrandWall.tsx`, data in `brands` (lib/site.ts). Used on both the
home page and About.

Each supplied logo is a transparent PNG whose artwork sits on a differently-sized
canvas — British Airways fills 27% of its canvas height, Nokia 30%, Coca-Cola 54%,
while Ford and Wema fill 100%. Dropped into equal boxes untouched, those would
render at wildly different sizes and the row would not align.

So each entry carries a `crop`: the measured bounding box of its real artwork,
passed to **ImageKit's `cm-extract` transform** so the CDN serves artwork only.
Every logo is then fitted into one uniform 124×40 box with `object-contain`, which
is what makes the row line up. Fitting to a *box* rather than a fixed height also
evens out optical weight — without a width cap, British Airways (6.5:1) would run
five times wider than Etisalat (0.9:1).

The grid uses 2 / 4 / 8 columns, all of which divide 8 evenly, so no row is ever
left short.

**To add a brand:** add it to `brandSources` with its file name and the bounding
box of its artwork. To find the box:

```python
from PIL import Image
im = Image.open("logo.png").convert("RGBA")
print(im.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox())
# -> (x0, y0, x1, y1); crop is { x: x0, y: y0, w: x1-x0, h: y1-y0 }
```

If a logo has no transparency, set `crop` to the full canvas.

## Legacy URLs

`/contact-mabel` and `/contact` permanently redirect (308) to `/bookings`, for
continuity with links pointing at the previous WordPress site. Add more in
`next.config.ts` if other old paths are in circulation.

## Brand tokens

Defined once in `src/app/globals.css` under `@theme`:

| Token | Value | Use |
| --- | --- | --- |
| `--color-burgundy` | `#6B1220` | Primary |
| `--color-burgundy-hover` | `#8F2130` | Hover |
| `--color-tint` | `#F3E9EA` | Tinted surfaces |
| `--color-ink` | `#141414` | Text, dark bands |
| `--color-paper` | `#F7F5F1` | Page background |
| `--color-accent` | `#C9A227` | Accent |

Type is **Archivo** (self-hosted via `next/font`) across the display, heading, body and
mono-styled eyebrow scale.

## Hero background animation

`src/components/HeroBackdrop.tsx` + the `.hero-*` rules in `globals.css`.

Motifs come from the brand: concentric rings echoing the circular swoosh in the
logo, centred on the arch behind the portrait, plus two slow-drifting brand-colour
gradients and a fine dot texture.

Built for smoothness:

- **No JavaScript and no canvas** — pure CSS and inline SVG, so nothing runs on
  the main thread and the bundle is unchanged.
- **Only `transform` and `opacity` animate**, which the compositor handles on the
  GPU. Nothing triggers layout or paint per frame.
- **Each rotating ring set is its own element.** Rotating a `<g>` inside a single
  SVG would repaint the whole SVG every frame instead of compositing a layer.
- **No blur filters** — softness comes from radial gradients, which are free to
  composite. A `filter: blur()` on elements this size is not.
- Cycles are long (34s–150s) and opacities low (0.1–0.2), so it reads as ambient
  texture rather than movement competing with the headline.
- Fully disabled under `prefers-reduced-motion`, leaving the static composition.
- `aria-hidden`, `pointer-events: none`, and behind the content on a negative
  z-index inside the hero's own stacking context.

Three **ripple** rings sit inside the static ones, each growing outward from behind
the portrait and fading as it expands, on a staggered 12s cycle so one is always
in motion (`.hero-ripple` / `@keyframes hero-ripple`).

To tune it: ring opacity is `.hero-ring--hair` / `.hero-ring--dashed` /
`.hero-ring--ripple`, rotation speed is the `hero-spin` durations, ripple speed and
reach are the `hero-ripple` duration and its final `scale`, and the drifting colour
is in `.hero-orb--one` / `--two`.

### Header transparency

The header is transparent over the hero and gains a paper background, hairline
border, blur and soft shadow once the page scrolls past it. The switch is driven
by an IntersectionObserver on a zero-width sentinel pinned to the top of the
document (`Header.tsx`), so no scroll handler runs per frame.

For that transparency to be *visible*, something has to sit behind the bar — with
a paper page background, a transparent header over paper looks identical to a
solid one. So `.hero-backdrop` extends upward by `--header-h` and `.hero-wash`
lays a tint across the top of the hero, giving the nav band something of the hero
to sit on.

The mobile drawer is rendered as a **sibling** of `<header>`, not a child: the
header carries `backdrop-blur`, and an element with a backdrop-filter becomes the
containing block for its `position: fixed` descendants — nested inside, the drawer
resolved `bottom: 0` against the header box and collapsed to zero height.

### Portrait blend

The hero portrait is a cut-out PNG, so it would otherwise end on a hard edge and
read as floating above the arch. The arch now ends flush with the image, and
`.hero-portrait` masks the whole group with a multi-stop gradient so figure and
arch dissolve into the page together. The ramp uses five stops rather than a plain
two-stop fade, which would leave a visible band where the arch edge disappears.
Adjust the stops in `.hero-portrait` to move the blend up or down.

## Mobile & performance notes

- Mobile-first throughout; full-screen drawer nav under `lg`, 48px minimum tap
  targets, 16px form inputs (stops iOS zoom-on-focus).
- Above-the-fold blocks animate with **transform only, never opacity**, so the hero
  is eligible for LCP the moment it paints. Below-the-fold content fades in on scroll.
- The brand loader GIF shows **once per browser session**, is skipped entirely for
  `prefers-reduced-motion`, and never gates content — the page is in the DOM beneath it.
- Images come from ImageKit through `next/image` (AVIF/WebP, explicit `sizes`);
  the origin is preconnected in the document head.
- All motion respects `prefers-reduced-motion`.

## SEO, schema and LLM visibility

### Metadata

Per-page metadata is built by `src/lib/seo.ts` — canonical URL, Open Graph,
Twitter card (with `@MabelAdeteye` as site/creator), and a 1200×630 social card
generated from the portrait on brand burgundy. Robots directives allow large
image previews and unlimited snippets, which is what lets Google show a full
answer-style excerpt.

### Structured data

`src/lib/schema.ts` builds a **linked graph**, not scattered blocks. Every page
node references the same `#person`, `#website` and `#primaryimage` nodes by
`@id`, so the whole site resolves to one entity rather than six documents.

| Page | Nodes |
| --- | --- |
| All | `Person`, `ImageObject`, `WebSite`, `ItemList` (brands) |
| `/` | `WebPage` |
| `/about` | `ProfilePage`, `BreadcrumbList`, 6 × `Review` |
| `/gallery` | `CollectionPage`, `BreadcrumbList` |
| `/events` | `CollectionPage`, `BreadcrumbList`, `Event` per upcoming date |
| `/mentorship` | `WebPage`, `BreadcrumbList`, `Service`, `FAQPage` |
| `/bookings` | `ContactPage`, `BreadcrumbList` |

The `Person` node carries `jobTitle`, `worksFor`, `memberOf`, `hasCredential`,
`alumniOf`, `award`, `knowsAbout`, `sameAs`, `telephone` and `email`. Each
organisation is an `Organization` node with its official URL as `sameAs`, which
is how a search engine resolves "CIPR" to the actual institution instead of
guessing. **Those URLs live in `orgUrls` (lib/site.ts) and should be verified
before launch** — a wrong URL links the wrong entity.

Do not union `Person` with `ProfessionalService` or `LocalBusiness`: those are
Organization subtypes, so the union asserts that Mabel *is* a business. Services
are modelled separately on the Mentorship page.

### LLM / answer-engine visibility

- **`/llms.txt`** — the [llmstxt.org](https://llmstxt.org) convention: a plain,
  authoritative summary so models do not have to infer facts from rendered HTML.
  Generated from the same content layer as the pages, so it cannot drift. Written
  in third person throughout: the pillar copy on the site is first-person, and
  mixing "I" into a third-person summary invites an extractor to misattribute it.
- **`robots.ts` allows AI crawlers explicitly** — GPTBot, OAI-SearchBot,
  ClaudeBot, PerplexityBot, Google-Extended, Applebot-Extended and others. This is
  a visibility decision: leaving `Google-Extended` undeclared keeps Mabel out of
  AI Overviews and Gemini grounding. Bytespider and Amazonbot are disallowed —
  they scrape without citing. Edit the `AI_CRAWLERS` list to change the policy.
- **"At a glance" on About** — a definition list of short, self-contained facts.
  Each row stands alone without surrounding prose, which is the shape answer
  engines extract and quote accurately.
- **`speakable`** markup names the selectors carrying each page's best one-line
  answer.
- **Testimonials as `Review` nodes**, so praise is machine-readable rather than
  prose an extractor has to guess at.
- Everything is **statically prerendered** — no client-side data fetching, so
  every crawler sees the full content in the initial HTML.

### Also generated

`sitemap.xml` (with image entries), `robots.txt`, `manifest.webmanifest`, and
visible `BreadcrumbList`-backed breadcrumbs on every inner page.
