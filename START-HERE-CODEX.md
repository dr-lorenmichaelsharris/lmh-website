# LMH Astro rebuild: development kickoff

Copy the prompt below into Codex with this folder attached. The supporting files are part of the specification. This package was prepared on 20 October 2026; it is a development handoff, not an implemented website.

---

You are implementing a complete, premium redesign of https://lorenmichaelsharris.com/ using Astro and TypeScript. Build the website, not another audit or a single-page mockup.

First read:
1. `docs/DEVELOPMENT-BRIEF.md`
2. `docs/FULL-SITE-AUDIT.md`
3. `docs/CONTENT-DECISIONS.md`
4. `docs/route-migration.csv`
5. `docs/evidence/wordpress-public-index.json` and `docs/evidence/public-site-inventory.json`

Inspect the working tree and applicable AGENTS.md instructions before editing. Preserve unrelated work. Do not reset or overwrite existing changes. Use the installed stable Astro release compatible with the deployment runtime, verify current official documentation, and pin dependencies in a lockfile. Do not blindly use outdated Astro examples.

## Objective

Create an accessible, fast, visually distinctive personal-brand website for Dr. Loren Michaels Harris. Make event inquiries, coaching inquiries, keynote-writing scopes, program inquiries, and Bathrobe Moments viewing/applications easy to understand and complete.

Treat speaking as the initial primary commercial journey, with coaching and writing next. This is a working assumption, not a confirmed revenue ranking. Keep the priority configurable. Preserve The Mindset Revolution, Bathrobe Moments, the public article archive, policy routes, and the separate book-site relationship.

## Design direction

Editorial authority with human warmth: charcoal, warm ivory, restrained gold, large intentional real photography, expressive but readable headings, disciplined spacing, and concise customer-focused copy. Retain Loren's personality and genuine imagery. Give Bathrobe Moments a distinct show identity inside the same design system. Apply the direction to every route.

Avoid generic SaaS styling, repeated gold-gradient banners, unreadable gold/white combinations, autoplay background video, endless carousels, and decorative animation. Build varied compositions appropriate to the content rather than cloning a card grid onto every page.

## Implementation requirements

- Astro components and semantic HTML by default; minimal client JavaScript. Use islands only for interactions that actually need them.
- Prerender marketing/editorial pages. Use a documented server or external-provider boundary for forms; static output alone cannot receive submissions.
- Use validated content collections and centralized business/booking configuration.
- Implement every route in the migration register as a real page, working redirect, or an explicitly documented staged retirement. Do not silently discard legacy URLs.
- Preserve approved article text, publication dates, and original permalinks. Do not scrape navigation/footer text into article bodies.
- Treat scraped claims as source material, not verified facts. Do not invent testimonials, metrics, credentials, affiliations, customer logos, pricing, policies, video IDs, or download assets.
- Reuse suitable existing public brand imagery after documenting its source and intended use. Do not hotlink production hero assets. Do not fabricate a celebrity/client photograph or endorsement.
- Implement the responsive homepage, Speaking, and shared shell first, then continue through the entire route matrix in the brief. Do not stop after the homepage.
- Complete real inquiry/subscribe behavior where credentials and approved destinations exist. Provide a local development adapter for testing. Missing credentials must produce an honest unavailable state, never a fake success.
- Do not enable payment collection until package prices, inclusions, approval/payment order, and provider mapping are confirmed. Implement the selectable package model and tested integration boundary without guessing commercial terms.
- Keep unapproved evidence and commercial promises out of public production content. Record missing approvals in `docs/launch-blockers.md`; continue independent implementation.
- Use an approved direct Calendly event URL when available. Until then, use accurate inquiry CTAs and the existing email as a fallback; do not label a generic scheduling profile as a confirmed 15-minute booking flow.
- Target WCAG 2.2 AA, including keyboard navigation, focus visibility, reduced motion, labels, errors, contrast, and reflow.
- Maintain proper metadata, canonical URLs, social previews, sitemap, robots rules, and legacy redirects. Noindex staging, success, and transaction-state pages appropriately.
- Do not publish, alter DNS, replace the live WordPress site, send live test emails, or make payments as part of this implementation task.

## Quality and completion

Run type/content checks and the production build. Test important flows with local adapters: inquiry validation/delivery outcome, newsletter outcomes, selected guest package propagation, and payment/confirmation state handling if implemented. Check every registered route and internal link, including anchor targets and downloadable files.

Inspect rendered layouts at 320, 390, 768, 1024, and 1440 CSS pixels. Check keyboard navigation and representative pages with accessibility tooling. Test image loading, reduced motion, and no-JavaScript access to essential content. Capture screenshots and fix problems you observe. If browser testing is unavailable, explicitly report that limitation and do not claim visual validation.

Deliver a running local preview, complete route coverage, reusable components, editable content, `.env.example`, setup/deployment instructions, test evidence, screenshot references, route migration status, and a concise remaining-blockers list. Distinguish implemented, locally verified, and production-verified functionality. Do not describe the project as launch-ready if credentials, content approval, payments, or delivery verification remain unresolved.

Begin implementation now. Make reasonable reversible choices and continue. Ask only for facts or access that genuinely block dependent work, while progressing everything else.
