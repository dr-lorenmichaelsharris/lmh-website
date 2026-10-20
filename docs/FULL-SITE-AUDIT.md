# Full public-site audit and rebuild implications

Audit date: 20 October 2026. Site: https://lorenmichaelsharris.com/.

## Executive finding

**Not ready for a premium relaunch.** The problem spans the website: unfinished pages and links, inconsistent visual systems, weak commercial-state handling, unverified evidence, and accessibility defects. A new homepage alone would leave serious friction in the actual buying and application journeys.

The original audit covered Home, Speaking, Coaching, Contact, Media Kit, and Calendly. This extension inventories all 41 published page/post entries returned by the site's public WordPress API (30 pages, 11 posts), fetches each route, and adds targeted desktop inspection of the remaining major layouts and critical flows.

All requested entries ultimately returned HTTP 200; that does **not** mean their functions work. `/bathrobe-moments/apply/` resolves to `/bathrobe-moments/#application`. Empty content and placeholder buttons can still return 200.

## Evidence boundaries

- **Browser confirmed:** visible desktop screenshots, rendered text, DOM link targets and anchor existence, and selected FAQ interaction.
- **Source confirmed:** public HTML/WordPress content. Hidden, duplicated, or popup content can appear here without being visible in the current browser state.
- **Assessment:** design/UX judgment based on inspected material; not a measured conversion effect.
- **Unverified:** mobile rendering, full keyboard/screen-reader use, server delivery, consent implementation, checkout amounts, payment fulfillment, credentials/testimonial authenticity, and business-policy accuracy.

No forms were submitted, no messages sent, and no purchases made. No changes were made to the live website. External booking was inspected, but external payment was not completed. The separate book website was not audited.

Source files:
- `evidence/wordpress-public-index.json`: public published-entry metadata.
- `evidence/public-site-inventory.json`: extracted HTML text, headings, links, input attributes and image tags per URL.
- `route-migration.csv`: proposed route treatment, including less-visible pages and all posts.
- `asset-register.csv`: image-tag inventory only; it does not include every CSS background, video poster, embedded image, or attachment.

## What should survive the redesign

Real photos and footage, personal storytelling, the P3 framework subject to approved wording, the three understandable service categories, attributable testimonial source material, the useful writing process/deliverables, and the show's distinctive personality. Preserve original article permalinks and content provenance. Retain black/gold as a brand cue while adding restrained neutral reading surfaces.

The current site does not require every section to be reinvented. It requires content integrity, coherent page hierarchy, and reliable transitions between pages and services.

## Ten highest-impact findings

| Priority | Problem and location | Visitor impact | Specific implementation |
|---|---|---|---|
| Critical | Guest application/confirmation mixes review, fee selection, payment, and scheduling; two thank-you payment CTAs point to `#`. | Applicant cannot reliably understand approval/payment status or complete selected tiers. | One approved package model, separate receipt/review/payment/scheduling states, server-verified payment, real tier destinations. Keep payments disabled until terms/mapping are approved. |
| Critical | Shared telephone is `tel:+1234567890%5D`; services show `546456456663`. | Failed contact and loss of trust at conversion. | Central approved contact record; no placeholder phone in public UI. |
| Critical | Footer newsletter has a single unlabeled text field named as a name, no email field. | Ambiguous input; email subscription interface is incomplete. | Labeled required email input and actual provider integration, validation, honest outcome states. Delivery untested. |
| High | Program hero points to `#application` but no element with that ID exists. | Primary program conversion action has no valid destination. | Dedicated approved program inquiry/application route or real anchor; accurate action label. |
| High | Resources has no main content; Services shows an internal design instruction. | Navigation ends in an empty page or unfinished editorial work. | Real resource index and concise service comparison; remove internal instructions. |
| High | Case-study links use `#`/missing href, while pages publish numerical result claims. | Visitors cannot inspect promised evidence. | Publish only owner-verified narratives and real links; hold unapproved numerical claims in the private editorial register. |
| High | Bio/photo/one-sheet download links on About point to `#`; Media Kit contains inconsistent pronouns and surname guidance. | Organizer handoff fails; incorrect copy may be reused. | Approved bios and real file assets; omit unsupported downloads rather than simulate them. |
| High | White 15px text on homepage gold-gradient CTA has approximately 1.49–2.10:1 contrast. | Label is difficult to read and fails AA normal-text contrast. | Dark labels on light gold; test all button/link states and text surfaces. |
| High | Speaking has empty learning-outcome labels and wrong customization FAQ answer. | Buyers cannot evaluate learning value or customization. | Approved audience/takeaway records per keynote; correct FAQ content and verify expanded answers. |
| Medium | Multiple visual systems: homepage sans hierarchy, generic serif inner banners, show-specific editorial treatment, gray program hero, bright Vault overlay. | Brand feels assembled from separate templates. | Shared tokens and shell; intentionally varied but related page templates; readable surfaces throughout. |

## Page-by-page findings

### Home `/`

**Evidence:** desktop rendered/DOM inspected in initial audit. Main H1 missing; prominent hero statements are H2. Header approximately 148px in a 610px-high inspected viewport. Biography heading 76px versus hero 73px. Hero CTA group was below the first captured view; header booking remained visible.

**Keep:** real content, clear service categories, repeated access to inquiry, attributed proof.

**Fix:** offer/audience specificity, oversized persistent header, contrast, competing footage/overlay, delayed proof, abstract biography and oversized self-quotation. Use one H1 and a clear hero decision. Missing H1 alone is not proof of a WCAG violation.

### About `/about/`

**Browser confirmed:** generic gold-overlay banner and `#` links for Download Bio, Download Photos, Download One-Sheet. Useful story/P3 content exists.

**Source concern:** experience claims include two decades/more than twenty years, while Media Kit uses over a decade. These are not necessarily logically incompatible but need one approved chronology and supported wording. Certification wording needs evidence.

**Action — High:** publish approved story and framework, remove fake downloads, use real assets and a clear service route. Avoid losing the personal history in generic corporate copy.

### Services `/services/`

**Browser/source confirmed:** visible internal note: “Work With Loren” or “Paths to Transformation” for visual hierarchy. Gold-overlay generic banner consumes the opening screen.

**Action — High:** remove editorial instruction; keep the three-service structure and provide audience/deliverable/format comparison with truthful detail-page CTA labels.

### Speaking `/services/speaking/`

**Browser confirmed:** four unfinished Learning Outcomes labels; repeated introduction; customization FAQ repeats booking timeline; “Book a Discovery Call” also leads to message form; placeholder phone.

**Action — High:** complete actual takeaways, correct FAQs and CTA semantics, foreground organizer fit and verified proof. Validate first-time versus follow-up scheduling.

### Coaching `/services/coaching/`

**Rendered content confirmed:** formats and deliverables provide useful decision support. Six audience groups make the positioning broad. Placeholder phone appears here too.

**Action — High:** clarify who benefits, cadence/inclusions and format selection. Distinguish general coaching from the named 12-week program. Confirm claims/testimonials before reuse; do not assume that presence on the old site establishes authenticity.

### Keynote Writing `/services/keynote-writing/`

**Browser/source confirmed:** large uppercase serif hero; concrete deliverables and five-step sequence; a later section repeats “The Process.” Published terms include two edit rounds, standard 4–6 weeks, possible rush 10–14 days, and broad IP ownership language.

**Action — High:** preserve useful process, shorten repetitive persuasive copy, define included versus optional work, and obtain approval for timeline/IP promises. Do not invent sample client scripts or evidence.

### The Mindset Revolution `/the-mindset-revolution/`

**Browser confirmed:** the hero CTA targets nonexistent `#application`; “Explore the experience ↓” links to the show-host's YouTube streams rather than a program explanation section. Repeated section captions and both timeline phases labeled Weeks 1–4 / Month one. Program offers 12 lessons and 12 private sessions but the timeline needs reconciliation.

**Assessment:** oversized text on the inspected gray hero is a separate visual language and pushes practical offer information downward. Background loading/render quality was not diagnosed from the one capture.

**Action — High:** complete timeline, program boundaries, actual inquiry flow, access/support details, and approved commercial terms. Preserve this offer in the rebuild even though the main navigation does not expose it.

### Results `/results/`

**Browser confirmed:** one Read Full Case Study element lacks href and two use `#`; View More leads to Testimonials. **Source confirmed:** 35% team engagement and 40% partnership-growth claims appear without substantiation in the page content inspected.

**Action — High:** lead with verifiable proof, reduce the long introductory sales copy, and make every story inspectable. No finding that these claims are false; their evidence was not supplied.

### Testimonials `/testimonials/`

**Browser/source evidence:** generic banner, long introduction, attributable legacy statements. Source repeats “Coaching Testimonials” three times and blends speaking/coaching/writing descriptions.

**Action — Medium:** keep approved quotes, correct grouping/copy, surface relevant excerpts and readable full versions. Avoid requiring interaction to see all critical proof. Confirm whether repeated labels are visible in each responsive/rendered state before describing them as a visual defect.

### Client Stories `/case-studies-client-stories/`

**Browser confirmed:** all three Read Full Case Study links use `#`. **Source confirmed:** claims include +37% engagement, a $1.2M seed round, and 42% donation growth; no detailed evidence pages are linked.

**Action — High:** obtain permission, measurement context and source; publish actual case studies or remove unapproved cards. Do not build new fabricated detail pages from brief claims.

### Resources `/resources/`

**Browser confirmed:** header directly followed by footer; no useful main content. This is an empty destination in primary navigation.

**Action — High:** add a resource index using actual blog posts, media-kit materials, FAQs and show links.

### FAQs `/faqs/`

**Browser/source evidence:** a large generic banner delays question content. Answers contain deposit/payment timing, rescheduling and accommodation commitments. Those are commercial statements that need business confirmation.

**Action — Medium:** compact intro, grouped question navigation, concise answers, deep links, accessible disclosure controls. Keep FAQs/policies/contracts consistent without inventing new terms.

### Media Kit `/media-kit/`

**Browser confirmed in initial audit:** she/her inconsistencies relative to the rest of site, “Loren [Surname]” guidance, generalized biographies. A Download Assets heading does not establish that usable files exist.

**Action — High:** one approved set of bios, actual licensed photo/download inventory, verified reel, clear media contact. Do not publish editing notes.

### Blog `/blog/`

**Browser/source evidence:** repeated Blog title treatment, generic banner, capitalization inconsistency, imported-looking dates and “No Comments.” The displayed dates are facts of the current site, not confirmed original writing dates.

**Action — Medium:** a compact editorial index, consistent titles, actual dates, useful excerpts, and readable articles. Do not fabricate new publication dates or unnecessarily add search/filtering to eleven posts.

### Contact `/contact/`

**Browser confirmed:** “Next Standing Ovation” banner precedes promotional copy, inquiry tabs/forms and a separate calendar invitation. The page favors events even when someone seeks other services.

**Action — High:** move the actual inquiry task upward and preserve originating service context. The old search-engine version differs from the current page and should not guide implementation.

### Bathrobe Moments `/bathrobe-moments/`

**Browser confirmed:** distinctive expressive visual direction; separate watch/apply links exist. Several show-premise paragraphs repeat. Text buttons contain YouTube/Instagram spelling errors. Gold package card promises nine broadcasts while its form option says one. Package cards show $97/$197/$327.

**Source-only concern:** hidden/alternate content also refers to $75 and contains unrelated blog titles in Upcoming Conversations material. These were not visible in the captured rendered text and should not be described as current visible pricing or episodes.

**Action — High:** one approved package source, real episode records, clearer viewer/guest paths, shorter repetition, honest historical claims, and a dedicated application. Do not treat every visitor as a prospective paid guest.

### Guest application `/bathrobe-moments/apply/`

**HTTP confirmed:** redirects to the show page's `#application` section. Not a separately implemented application page today.

**Action — High:** build a dedicated route with package state, labels, validation, privacy information, and truthful next-step explanation. Submission/delivery remains untested.

### Thank-you `/thank-you-page/`

**Browser confirmed:** copy says application is under review and also promises an email confirming a scheduled appearance. Then asks visitors who have not paid to pay. First Pay Now link goes to Stripe; second/third use `#`. Stripe price/fulfillment were not verified.

**Action — Critical:** state-aware receipt/review/payment/scheduling sequence; no false confirmation on direct visits. Fix payment mapping only after commercial approval. Noindex this utility route.

### Vault `/vault/`

**Browser confirmed:** standalone composition without ordinary navigation in the captured view; large bright orange overlay makes the hero text nearly invisible. Source has three short groups of reflection words.

**Action — Medium:** preserve the route as a readable reflection resource pending owner direction. Do not invent gated access or turn a word list into an unsupported product.

### Important Links `/important-links/`

**Source confirmed:** seven additional policy/disclosure destinations beyond the primary three footer policies; no H1 in source inventory.

**Action — Medium:** create a named policy/accessibility hub with the actual documents; preserve legacy route and improve navigation.

## All eleven posts

Each post's public text and metadata were retrieved. Visual inspection was at the blog-template level, not a full scroll audit of each individual article. Apply a shared article template without rewriting personal stories into generic conversion copy.

| Original route | Treatment |
|---|---|
| `/these-branches-are-many/` | Preserve essay and URL; normalize display casing only if approved; provide readable prose layout. |
| `/staying-the-course/` | Preserve essay/date; remove unnecessary all-caps display treatment if editorially approved. |
| `/the-world-of-podcasting-the-impact-on-todays-entrepreneur/` | Preserve long permalink and article; allow title to wrap comfortably. |
| `/swimming-in-the-shallow-side-of-life/` | Preserve personal narrative and provenance; review media and readability. |
| `/reading-between-the-lines/` | Preserve content; verify author attribution before changing it. |
| `/gathering-the-pennies-of-your-life/` | Preserve original story; use consistent article navigation and appropriate related content. |
| `/a-lifetime-of-forever/` | Preserve content and permalink discovered through post navigation. |
| `/one-day-from-tomorrow/` | Preserve content and permalink discovered through post navigation. |
| `/windy-meyer/` | Historical guest announcement, not an upcoming event. Use an archive label and actual watch link if verified. |
| `/cheryl-angela/` | Historical guest announcement with time-relative copy; do not invent broadcast date or replay. |
| `/faith-jordan/` | Historical guest announcement; retain original source context and review personal-media permissions. |

The last three display October 21, 2025; eight essays display November 24, 2025 in the public metadata. The displayed WordPress author is Shakil Hossain for inspected guest posts. Actual authorship must be confirmed, not silently reassigned.

## All ten policy/disclosure pages and the policy hub

This is an editorial/implementation review, not a legal determination. Preserve substantive terms pending owner/professional review and reconcile them against actual operations.

| Route | Confirmed source issue / required review |
|---|---|
| `/privacy-policy/` | Browser confirms “operating as Home” and website identified as Home. Confirm entity/contact/provider facts and real revision date. |
| `/terms-and-conditions/` | Several entity substitutions say Home; verify actual offer/contract relationship. |
| `/cookie-policy/` | Describes consent/preferences conditionally; actual cookies/consent behavior not verified. Document actual integrations before final policy. |
| `/accessibility-statement/` | Home substitutions; references WCAG 2.1 aspirations. Describe actual tested status/limitations; do not claim 2.2 compliance automatically. |
| `/data-processing-protection/` | Home substitutions and operational/retention claims need owner confirmation. |
| `/disclaimer/` | Home substitutions; align actual name and offerings while retaining approved substantive content. |
| `/refund-cancellation-policy/` | Home substitutions and conditional terms; reconcile guest fees and services. |
| `/affiliate-disclosure/` | Home substitutions and a refund-request section after affiliate content; review misplaced material. |
| `/e-commerce-shipping-policy/` | Home substitutions and hypothetical physical/digital offerings; confirm what the business actually sells. |
| `/testimonials-reviews-policy/` | Guest-related acknowledgment form material appears in HTML after policy content; remove from policy template. |
| `/important-links/` | Policy index: preserve the route and provide a clearly named hub linking all relevant documents. |

There are ten policy/disclosure documents, plus the Important Links hub (eleven utility entries total). The full 41-entry inventory is authoritative.

## Desktop/mobile and scores

Desktop visual evidence now includes Home, About, Services, Keynote Writing, Results, Testimonials, Client Stories, Resources, FAQs, Blog, Contact, Privacy, Bathrobe Moments, The Mindset Revolution, Thank-you, and Vault; other pages have source/content coverage and selected prior DOM inspection.

No mobile layouts were inspected. Do not copy desktop judgments into a mobile score. Mobile testing is an implementation acceptance requirement, including all unique templates, long program/guest forms, and package comparison tables.

Provisional expert scores for the inspected experience: visual 4.5/10, UX 3.5/10, typography 4/10, branding 5/10, conversion readiness 3/10, accessibility 3/10 based on limited checks. Overall 3.8/10. Mobile unscored. Scores are qualitative; stronger evidence of unfinished destinations lowers readiness relative to the homepage-focused first audit.

## Design/interaction direction and benchmark

Keep black/gold, real images, P3 storytelling, useful service explanations, verified proof and the show's personality. Remove internal notes, decorative repetition, empty destinations, misleading CTAs and fictional completeness.

Use progressive form feedback, clear focus/hover, intentional video play, and short state transitions. Do not add animation as a substitute for a working funnel. Reduce motion for users who request it and keep essential content available without JavaScript.

Live references reviewed in the first audit: https://simonsinek.com/ for clear audience/offer routing and https://www.melrobbins.com/ for named content destinations and attributed authority placement. Neither site's conversion performance was established. Adapt patterns, not claims, visuals or their business model.

## Release verdict

**Not Ready.** Highest-priority work: fix contact/subscription, complete the program and service actions, reconcile guest pricing/payment states, establish approved evidence/assets, and implement a consistent accessible design system across all routes. Technical rebuild can proceed while unapproved business facts are held out of production.
