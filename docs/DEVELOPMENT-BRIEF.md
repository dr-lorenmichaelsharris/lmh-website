# LMH website rebuild — implementation specification

Prepared 20 October 2026. Source: https://lorenmichaelsharris.com/. Read with FULL-SITE-AUDIT.md and CONTENT-DECISIONS.md.

## 1. Product outcome and scope

Build a complete multipage website, including the less-visible public routes. The public WordPress API listed 30 pages and 11 posts. All 41 entries were fetched. One application route redirects to the show page's application anchor; it is not a separate existing application experience. This inventory excludes unpublished/private content, media attachment pages, arbitrary archives/query URLs, external sites, and authenticated systems.

Success means visitors understand the relevant offer, find credible evidence, and complete a useful inquiry without confusion. Commercial measurement should emphasize qualified leads and completed bookings, not animation engagement.

Initial audience ordering is an implementation assumption:
1. Event organizers evaluating a speaker.
2. Leaders, founders, educators, and emerging speakers seeking coaching.
3. People commissioning a keynote script.
4. Prospects evaluating The Mindset Revolution.
5. Bathrobe Moments viewers and prospective guests.

Do not conflate a paid show appearance with hiring Loren to speak. These need separate explanations, forms, and state handling.

## 2. Recommended architecture

Astro is appropriate for this content-heavy marketing, editorial, and media site. Prerendering and small interactive islands suit its needs; there is no demonstrated need for a whole-site React application. This is a technical recommendation, not a guarantee of performance or conversion gains.

- Astro + TypeScript strict mode; choose and pin the current stable compatible version at implementation time.
- Astro layouts/components, CSS custom properties, scoped CSS, and small TypeScript modules. Tailwind is optional if it improves maintainability; it must not dictate the design.
- No React dependency unless a specific interactive feature warrants it.
- Content collections with schema validation for articles, episodes, services, testimonials, case studies, and policies where useful.
- Local Markdown/structured data first. Add a CMS only after an actual editing workflow is established. Do not make runtime WordPress availability a prerequisite for normal page rendering.
- Download selected approved images to local source assets; use Astro image tooling for responsive variants and intrinsic sizing. Preserve source URLs/ownership notes in an asset register.
- Static marketing pages plus a hosting-compatible form endpoint or external form backend. If using an Astro endpoint, install/configure a supported server adapter and explicitly render that endpoint on demand. Do not implement a POST handler on a purely static host and call it functional.
- Select the actual deployment adapter once the host is known. Local development may use a Node-compatible adapter; document the production change if required. Do not assume access to hosting credentials.
- Newsletter and inquiry services are independent integrations. Centralize their provider interfaces.
- No accounts, course LMS, subscription billing, storefront, or proprietary CRM unless separately authorized. The program page markets the offer; it does not imply building a learning platform.

Official references checked during handoff:
- https://docs.astro.build/en/concepts/why-astro/
- https://docs.astro.build/en/guides/content-collections/
- https://docs.astro.build/en/guides/on-demand-rendering/
- https://docs.astro.build/en/recipes/build-forms-api/
- https://docs.astro.build/en/guides/images/

## 3. Information architecture

Recommended desktop navigation: Speaking, Coaching & Programs, About, Results, Resources, Bathrobe Moments; primary CTA “Inquire About an Event.” Contact remains available through the CTA and footer. Include Keynote Writing prominently in service navigation and the service hub. Grouping is a starting design choice and should remain understandable on mobile.

Coaching & Programs contains Coaching and The Mindset Revolution. Resources contains Blog, Media Kit, FAQs. Bathrobe Moments has clear Watch and Apply routes. The external book site can receive a restrained book link or editorial feature; do not rebuild or replace that separate project.

Keep existing URL paths initially. Improve labels without creating unnecessary migration risk. See route-migration.csv for exhaustive coverage.

## 4. Visual system

Direction: an editorial personal brand with stage presence, credibility, emotional honesty, and controlled luxury. Avoid visual clichés that make a real speaker look like a generic coaching template.

Starting tokens (validate actual combinations):
- Charcoal `#141412`: main dark surface and primary text on ivory.
- Warm ivory `#F7F3EA`: main reading surface.
- Gold `#D4AF37`: accent and button surface with charcoal text.
- Deep gold `#785A16`: optional text accent on ivory, subject to measured contrast.
- Muted text and borders must be selected by contrast testing, not opacity alone.

Use gold for emphasis, not as the background of every section. Use light editorial surfaces for long reading; use dark sections for stage imagery and conversion emphasis. Preserve logo proportions and inspect legibility at small sizes before changing it.

Typography: one expressive display family plus one highly readable sans family, both licensed/self-hosted when practical. Choose on actual content and test numerals, italics, long names, and mobile wrapping. A serif/sans pairing is a starting direction, not permission to use several unrelated type systems. Do not use all caps for long paragraphs.

Starting scale:
- Hero H1: fluid approximately 42–88px; tune to each page and avoid clipping.
- H2: fluid approximately 30–52px.
- H3: approximately 22–28px.
- Body: approximately 18px desktop, 16–18px mobile, 1.5–1.7 line height.
- Reading measure: approximately 60–75 characters.
- Main layout: approximately 1200–1280px maximum, with intentional breakouts for images.
- Horizontal gutters: 20–24px mobile, 32–64px larger screens.
- Section rhythm: approximately 56–80px mobile and 80–112px desktop; reduce around small utility sections.
- Desktop header: explore 80–96px. Mobile: approximately 64–76px. Avoid persistent banners that occupy the reading viewport.

These are design starting values, not rigid pixel acceptance rules. Rendered balance and accessibility decide the final values.

Components: Header, MobileMenu, Footer, PrimaryButton/SecondaryLink, Breadcrumbs, PageIntro, Hero, MediaPoster, EvidenceQuote, ServiceSummary, KeynoteDetail, ProcessSteps, FAQGroup, InquiryForm, NewsletterForm, EpisodeCard, ArticleCard, DownloadLink, ProgramTimeline, PackageComparison, FormStatus, EmptyState, ErrorPage.

Composition must vary. Home is a curated story; services support comparison; proof pages foreground evidence; articles are calm reading experiences; policies are utilitarian. Do not repeat the same oversized hero on all pages.

## 5. Page-by-page build requirements

### Home `/`

Order: clear offer/audience → primary inquiry + watch action → approved proof → speaking/keynotes → coaching and writing paths → concise story/P3 introduction → relevant testimonial → show/program/book editorial links → final inquiry.

Suggested provisional headline: “Keynotes that help your audience turn perspective into action.” Supporting copy may reference leadership, resilience, and personal storytelling. Do not promise measurable business outcomes without evidence. Keep Loren's story visible but do not make buyers read the full philosophy before seeing services.

Use one intentional photograph or a click-to-play reel poster. Make the main action visible at common laptop heights without forcing a fixed-height hero. Avoid autoplay YouTube in the critical rendering path.

### About `/about/`

Lead with who Loren is, who he serves, and his real story. Explain Pain → Perspective → Possibility in three clear steps. Use only approved credentials and dates. End with service-specific routes. Provide real media downloads only when the files exist; no `#` download buttons. Keep extended biography distinct from a buyer summary.

### Services `/services/`

Create a concise comparison page: audience, job to be done, deliverables, engagement format, next action. Include Speaking, Coaching, Keynote Writing; cross-link The Mindset Revolution as a named program. Remove the published internal design note. Primary labels should be “Explore Speaking,” “Explore Coaching,” and “Explore Keynote Writing,” because these links lead to details.

### Speaking `/services/speaking/`

Lead with event fit, speaker footage, and specific approved takeaways. Each keynote needs title, audience, challenge, three learning outcomes, available format/duration if approved, and inquiry CTA. Keep the existing four topics only after owner confirmation. Do not invent outcomes to fill an empty label.

Show the organizer process, verified testimonial excerpts, media-kit access, and practical FAQs. Inquiry fields: name, email, organization, event date/undecided, location or virtual, audience, and desired outcome. Make nonessential details optional. No “follow-up” label for a first interaction.

### Coaching `/services/coaching/`

Clarify suitable clients and differences between 6–12-week coaching, VIP day, and invite-only groups. Preserve useful message clarity, story architecture, delivery, and action-plan content. Confirm cadence, session length, access, deliverables, and eligibility before publishing. Explain how The Mindset Revolution differs from general coaching. Provide “Discuss Coaching” inquiry; pricing may be proposal-based if that is the actual business practice.

### Keynote Writing `/services/keynote-writing/`

Preserve concrete deliverables and the discovery → narrative → draft → revisions → optional rehearsal sequence. Distinguish included work from optional work. Confirm two revision rounds, 4–6-week schedule, rush claims, confidentiality and ownership terms. Rename the second “The Process” section to something useful only if it has real sample content. Do not fabricate client scripts. Inquiry should collect occasion, audience, talk length, deadline, starting material, and scope.

### The Mindset Revolution `/the-mindset-revolution/`

Build a complete program landing page: purpose and fit, approved inclusions, coherent 12-week timeline, personal application examples, delivery format, ongoing-access terms, FAQs, and real inquiry/application action. Fix duplicated month/week labels and repeated section headings. The second phase's timing is unconfirmed; do not silently decide it is weeks 5–12 without approval. Until enrollment terms are approved, use an accurate program inquiry instead of purchase/enrollment promises. The current `#application` target is absent.

### Results `/results/`

An evidence overview organized by service or audience. Lead with attributable evidence rather than paragraphs claiming transformation. Separate qualitative testimonials from measured results. No metric without source, baseline, timeframe, attribution, and permission. Keep links to Testimonials and Client Stories meaningful.

### Testimonials `/testimonials/`

Readable static quotes with proper names/roles/organizations where approved. Service grouping may be anchors; with a small dataset, filtering is optional. Retain full meaning and make excerpts transparent. Avoid an obligatory carousel. Remove repeated “Coaching Testimonials” labels and mixed service descriptions. Video needs named controls/captions or an accessible alternative.

### Client stories `/case-studies-client-stories/`

Use Challenge → Work → Observed outcome, with verified source notes held privately in the content register. Detailed story routes should exist only when real approved content supports them. Never create a full story around an unverified percentage. If no stories are approved, provide an honest editorial introduction plus approved testimonials and an inquiry path; record the missing stories as a launch content decision. No fake cards, lorem ipsum, or dead links.

### Resources `/resources/`

Replace the empty content area with an index for articles, organizer FAQs, media assets, and the show. Show actual available resources. Do not advertise downloadable guides that do not exist.

### FAQs `/faqs/`

Group by speaking, coaching, writing, program, and guest appearances only where real approved answers exist. Use native details/summary where appropriate. Deep-linkable questions, clear focus, no scroll jump. Commercial and accommodation commitments require confirmation; do not convert general aspirations into guaranteed services.

### Media Kit `/media-kit/`

Approved short/long bio, portrait/stage-image downloads, one-sheet if available, technical requirements if approved, reel link, and media contact. Downloads must state format and useful context. Do not infer availability from the heading “Download Assets.” Fix pronouns, surname placeholders, unsupported credentials and overly broad professional claims.

### Blog `/blog/` and eleven original post routes

Preserve all 11 public posts as articles or archival episode notes with their original URLs. Eight are general articles; three are guest-announcement posts (Windy Meyer, Cheryl Angela, Faith Jordan). Do not label archival announcements as upcoming episodes. Maintain author attribution until the owner confirms whether the displayed WordPress author is the actual writer or publisher. Preserve publication dates; do not change them to make the site look active.

Use readable type, restrained related content, article metadata, and appropriate inline media. Do not reintroduce WordPress comments unless a real moderation/backend workflow exists. If comments are removed, do not show a fake comment form. Episode announcements can carry an “Archive” label and actual date; do not infer the original broadcast date from “tomorrow.”

### Bathrobe Moments `/bathrobe-moments/`

Separate the viewer and guest journeys immediately: “Watch Conversations” and “Apply to Be a Guest.” Retain the show's strong personal visual character with legible text and controlled imagery. Display a real episode collection with title, guest, date, platform URL, and thumbnail, or an honest YouTube channel link if episode data is unavailable.

Replace confusing repeated sections with: show premise → watch → guest fit → approved package comparison → application process → FAQs → apply. Resolve Bronze/Silver/Gold counts and all fee discrepancies through one configuration. Do not publish $75, $97, $197, or $327 as approved merely because they appear in source HTML. Do not quantify “lives changed.” Historical 10-year/2,500-conversation claims also need approval.

### Guest application `/bathrobe-moments/apply/`

Create a dedicated form route instead of redirecting back into the long show page. Fields: name, email, optional phone, website/social, short introduction, proposed topic, and approved package selection if applicable. Carry package ID from the show page, validate server-side, and allow the applicant to change it. Keep marketing opt-in separate from application/terms acknowledgment. Do not force a payment sequence until owner-approved rules exist.

### Confirmation `/thank-you-page/`

Replace generic claims of a scheduled appearance with truthful state: application received, awaiting review, accepted, payment pending, or scheduled. A direct visit must not imply a submission succeeded. Public query strings are not proof of payment or approval. Keep state server-verified and avoid putting personal application data in URLs. Keep legacy route compatible and noindex; an improved nested success route may be added with an explicit mapping.

### Vault `/vault/`

Current standalone word collection is weakly integrated and has severely obscured text in the inspected desktop view. Preserve the route as a small readable public reflection resource in the local rebuild; do not invent gated/member behavior. Record owner decision on long-term inclusion. If later retired, use an agreed relevant redirect or deliberate 410, not a silent homepage redirect.

### Policies and Important Links

Keep all 10 policy/disclosure URLs and `/important-links/` using a consistent narrow reading layout. Policy hub can be labeled “Policies & Accessibility.” Preserve substantive terms until owner review, while flagging broken business-name substitutions, mixed content, and missing revision dates. Do not invent legal entity, jurisdiction, retention schedule, consent obligations, refund rights, or commercial guarantees. This project includes content/implementation reconciliation, not a legal compliance opinion.

The Testimonials & Reviews Policy contains guest-related form material in public HTML; remove misplaced form content from the new policy template. The Affiliate Disclosure contains a refund-request section; reconcile its purpose. Privacy/Terms and several other pages display “operating as Home”; obtain the approved business name.

### New supporting routes

Provide a real 404, form error/retry view, and transaction/application state views as needed. Use noindex for private-flow pages. Do not add them to the primary sitemap.

## 6. Content and asset models

Central site config: display name, approved pronouns, public email, optional verified phone, social links, booking event URLs, primary service priority, default metadata.

Content records must separate `sourceUrl`, `approvalStatus`, `approvedBy/approvedAt` where available, and `publish` from prose. Public HTML must never expose private approval notes. Local preview may show explicitly marked editorial drafts; release validation must prevent those drafts from entering production.

- Service: audience, summary, deliverables, formats, process, FAQ references, CTA intent.
- Testimonial: exact quotation, excerpt, person/role/organization, service, permission status, source reference, optional media.
- Case study: challenge, intervention, outcome, metrics with units/baseline/timeframe/source, approval state.
- Article: original slug/date/author, body, excerpt, image, category, canonical policy.
- Episode: guest/title, recorded/published date where known, actual watch URL, accessible summary, status (archive/upcoming/published), source.
- Program: approved inclusions, phases, time commitments, access terms, inquiry route.
- Guest package: ID, name, currency, amount, promotion count, deliverables, payment product mapping, approval state. One source powers cards, form, summary, and payment creation.
- Policy: approved title/body/revision date, business entity references, publication status.
- Asset: local path, public origin, intended role, meaningful alt text or decorative status, dimensions, credit/license if required.

`docs/evidence/public-site-inventory.json` contains full-page extracted source text, image tags and links. It is evidence, not a clean content export: repeated menus, hidden tabs, popup content, and footer text are included. Re-extract actual article bodies from the public WordPress API or document regions before migration. Preserve snapshots and raw source separately from editorial improvements.

## 7. Forms and commercial state

Progressive enhancement: readable labels, required indicators, correct input types/autocomplete, useful hints, input preserved on errors, submit pending state, server-side validation, accessible status, and retry path. Client-side validation is convenience, not trust.

Use bounded field lengths, spam protection, rate limiting, provider error handling, and server-only secrets. Avoid logging full messages/personal details. Prevent accidental duplicate submissions; newsletter should handle existing subscriptions calmly. Newsletter consent is not implied by a service inquiry.

Local development adapter must return explicit test outcomes and never send real mail by default. Production must not fall back to the local adapter. A success response requires the backend's agreed acceptance criteria; distinguish provider acceptance from proven inbox delivery in documentation.

Guest state recommendation, subject to owner approval: submitted → under review → accepted → approved payment request → payment verified → scheduling → confirmed. The current site mixes review, payment, and scheduled appearance promises. Do not implement this recommendation as confirmed business policy without approval. Continue with a genuine application receipt and configurable state model meanwhile.

If payments are included, use hosted provider checkout. Resolve price/product on the server from approved package ID, never from browser-supplied amount. Verify signed webhooks and process them idempotently. A return URL is not evidence of payment. Distinguish canceled, pending, failed, refunded, and paid. Do not reuse the single existing Stripe link for every tier.

## 8. SEO and migration

- Account for all 41 existing entries in route-migration.csv; preserve original post URLs and trailing-slash policy.
- Normalize HTTP/HTTPS and chosen host via deployment configuration. Preserve useful legacy anchors with explicit IDs where feasible.
- Unique title/description, canonical URL, social image, one meaningful H1, consistent breadcrumbs.
- Structured data only for truthful Person, Service, Article, and episode/media records. Avoid aggregate ratings, fabricated review markup, or Event markup for old announcements.
- XML sitemap includes indexable approved canonical pages. RSS for articles if supported. robots.txt must not accidentally block production.
- Staging must be protected/noindex. Remove staging restrictions deliberately at release. Do not index success/payment/application-state screens.
- Preserve valid external links and media references. A book-site link does not authorize changes to the book website.
- Download links resolve to actual files; validate MIME/type, accessibility where applicable, and useful names.

## 9. Accessibility and performance acceptance

Target WCAG 2.2 AA. Verify text 4.5:1 (3:1 for qualifying large text), UI/focus contrast where applicable, visible keyboard focus, skip link, landmarks, labeled controls, sensible source order, meaningful alt text, caption alternatives, and no keyboard traps. Minimum pointer targets 24px subject to WCAG exceptions; use approximately 44px controls for comfort. Test zoom/reflow, menus, accordions, form errors and dialogs.

Reduced motion must remove nonessential movement. No scroll hijacking. Content must remain available if reveal scripts fail or JavaScript is off. If motion autoplays and persists, provide appropriate controls. Do not hide essential proof behind sliders.

Performance targets, measured rather than promised: LCP ≤2.5s, CLS ≤0.1, and INP ≤200ms at field p75 when enough data exists. Before field data, document repeatable lab runs without labeling them field Core Web Vitals. Keep initial first-party JavaScript small (aim ≤50KB gzip on ordinary marketing pages), defer video/Calendly, lazy-load below-fold images, reserve image dimensions, and avoid loading every font weight. Budget exceptions require a specific reason.

## 10. Delivery sequence and definition of done

1. Foundation: source inventory, content models, route plan, shell, tokens, images, metadata.
2. First rendered slice: Home + Speaking + Contact, responsive and working with a local form adapter. Refine the visual system here.
3. Commercial pages: Services, Coaching, Writing, About, program, proof pages, Media Kit, FAQs.
4. Publishing/media: Resources, all 11 posts, Bathrobe Moments, guest application, confirmation states, Vault, all policies.
5. Integration and migration: real provider boundaries, redirects, downloadable files, approved content, deployment configuration.
6. Validation: full route/link checks, responsive screenshots, keyboard checks, meaningful integration tests, build/type checks, measured performance, final blocker review.

Do not stop at step 2 unless the user pauses the task. External credentials or pending facts should block only their dependent features, not the rest of the site.

Required deliverables: source, lockfile, `.env.example` without secrets, README setup/deploy/editing guide, local preview, route coverage report, asset/content provenance, screenshots, test report, and `docs/launch-blockers.md` with actionable missing items.

Production launch is a separate action. Do not deploy to the live domain, mutate WordPress, change DNS, send live submissions, or charge a payment during this build.
