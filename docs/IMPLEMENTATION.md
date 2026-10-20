# Route and content implementation

All 41 original paths are preserved with trailing slashes. Nothing is retired or redirected to an unrelated destination. `route-migration.csv` remains the authoritative inventory; `route-coverage.json` records current local HTTP results.

| Group | Local implementation | Approval boundary |
|---|---|---|
| Home, About, service hub and three service routes | Editorial shell, original local photography, configured service ordering, reusable service data/template and service-specific inquiries | Final biography, keynote details and commercial inclusions |
| The Mindset Revolution | Purpose/fit, questions to discuss, valid experience/application anchors and program inquiry; timeline/inclusions renderer | Actual phase dates, 12-week structure, support/access/inclusions |
| Results, Testimonials, Client Stories | Useful evaluation/inquiry routes and approved-only quote/story rendering | No invented evidence to fill empty collections |
| Resources, FAQs, Media Kit | Real resource navigation, native deep-linked disclosures, media request path and actual-file download renderer | No missing files or unconfirmed operational promises advertised |
| Blog and 11 original posts | Clean API article bodies, original dates/displayed author/permalinks; three guest notes labeled historical | Attribution/editorial approval before release |
| Bathrobe Moments and dedicated Apply | Distinct show heading, real channel link, watch/apply separation, centralized package preferences and server-rendered form | Episode feed, commercial packages/payment order and fees |
| Thank-you | Opaque, expiring, HTTP-only server receipt; neutral direct visit, noindex and no-store | No scheduling/payment state inferred from queries |
| Vault | Original Light/Power/Growth word collections, readable layout | Long-term inclusion/retirement decision |
| 10 policies and Important Links | Narrow reading template, substantive draft policy text, misplaced guest form removed, real policy hub | Legal/entity/operational reconciliation before release |
| Additional 404/error/API/robots/sitemap | Actual 404, retry/unavailable view, POST validation and staging-aware indexing | Host configuration and final approvals |

## Architecture

Astro 7.4.1, strict TypeScript 6.0.3, Node standalone adapter. Marketing output is prerendered. Contact/guest forms and receipt/submission routes are on demand. No React or client framework is needed. The only enhancement is a small inline form-pending script; all essential content and submissions work without it.

Source snapshots and approval registers are outside `public`. Public HTML never includes approval evidence/notes. Staging explicitly labels draft content and has noindex/disallow-all robots. Production builds deliberately fail before unapproved material can be packaged.

## Source preservation

Article bodies come from WordPress `content.rendered`, not the full-page crawl. Sanitization removes executable markup, legacy layout attributes, forms and unapproved media while preserving article text. Tests compare normalized body text against the raw API source and verify every original permalink/date/author. Original API responses remain in docs/evidence/raw.

Policy bodies retain substantive language for review rather than inventing entity, retention or legal terms. Elementor wrappers/heading levels are cleaned and the misplaced testimonial-policy form removed. Existing “Home” substitutions and affiliate refund material remain explicit C18 decisions.

## Known limits

There is no approved proof dataset, keynote outcome set, program timeline, downloadable kit, episode feed, credentialed mail service or commercial/payment mapping. Those content/integration gaps are documented, not filled with fiction. Templates and independent flows are implemented. The build is not launch-ready until those dependent decisions and production validation are complete.

## Cinematic revision (20 October 2026)

The shared header uses a preoptimized 116px public WebP logo. This avoids runtime image transformation on server-rendered forms; the Node standalone runtime did not resolve Sharp for those requests. Static content photographs remain Astro responsive images.

Fonts use official Latin WOFF2 subsets: Barlow Condensed 700 and Manrope variable 200–800, self-hosted with OFL licenses. Original TTF downloads remain available but are not requested by the page. No third-party font request occurs at runtime.

`PhotoMotion.astro` uses a small IntersectionObserver to animate photographs once when they enter view. Content is never hidden in CSS, and reduced motion disables the observer and animations.

`visibleEvidence` is the single preview/production predicate for testimonials. The early homepage proof and full/compact testimonial components use the same predicate. Existing release approvals remain required.
