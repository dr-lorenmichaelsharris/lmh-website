# Content, integration, and approval register

Prepared 20 October 2026. Missing facts do not block the entire build; isolate dependent features and continue the rest. Never fill these gaps with invented commercial content.

| ID | Decision / missing input | Existing evidence | Safe development treatment | Production requirement |
|---|---|---|---|---|
| C01 | Actual primary conversion and revenue priority | Three services plus show/program; no analytics supplied | Speaking-first configurable hierarchy | Owner confirms ordering; track qualified inquiries |
| C02 | Correct public business phone | Placeholder footer/service numbers; Calendly lists another number | Omit telephone; retain verified-source email link as fallback | Owner approves one number before publication |
| C03 | Public name, pronouns, entity and credential wording | He/him elsewhere, she/her in media kit; Home in policies | Use name-based neutral draft copy and central config; preserve submitted source privately | Approved identity/short bio/long bio, legal entity, title/credential verification |
| C04 | Actual contact inbox and provider | Gmail in footer; hello@ domain email in policies | Use Gmail as existing public source fallback; configurable recipients; local-only mail adapter | Confirm recipient mailbox and provider credentials/delivery |
| C05 | Approved Calendly event URLs/duration/attendee | General profile lists multiple meetings; contact says 15 minutes with team | Inquiry-first CTAs; record existing profile as a scheduling-directory link only | Approved direct event mapping for each relevant action |
| C06 | Testimonials and logos | Named legacy quotes plus newer abbreviated examples | Keep provenance; exclude from public production unless approved; no invented logos | Permission and exact approved text/attribution |
| C07 | Quantitative case-study evidence | 35%, 40%, 37%, $1.2M and 42% claims appear | Mark unverified; do not produce new detail stories from them | Source, permission, timeframe, baseline, attribution, approved narrative |
| C08 | Speaking topics/takeaways/formats | Four titles; empty learning outcomes | Build data model/layout; use only supported description in local draft | Approved topics and takeaways; confirmed durations/customization |
| C09 | Coaching cadence/inclusions and testimonials | 6–12 weeks, VIP day, group by invitation | Preserve source in editorial drafts; concise inquiry path | Session count/length, delivery, availability and approved proof |
| C10 | Writing deliverables/terms | Two revisions; 4–6-week standard; 10–14-day rush; IP promises | Separate included/optional fields, do not promise unapproved terms | Owner confirms scope/timeline/confidentiality/IP contract wording |
| C11 | Program structure | 12 lessons/12 private sessions; both phases say Month one/Weeks 1–4 | Real program inquiry; draft timeline pending approval | Actual phase dates, session schedule, support/access terms and price if public |
| C12 | Guest tier amounts and promotion counts | Cards $97/$197/$327, Gold nine broadcasts vs form one; hidden HTML says $75 | Configurable draft packages; disable purchase; do not show approved pricing by implication | Approved prices/currency/inclusions and consistent package IDs |
| C13 | Guest approval/payment order/refunds | Review and scheduled confirmation language mixed; thank-you asks for payment | Application receipt only with honest review state; no automatic charge | Owner approves workflow, exceptions, refund/cancel terms |
| C14 | Guest payment mapping | One existing Stripe URL; other tiers # | Server integration interface and local test adapter | Approved products/prices, keys, webhook secret, idempotency and provider testing |
| C15 | Show episodes and historical counts | YouTube channel/streams links, 10 years/2,500 conversations claims | Link actual channel; no invented episode feed/dates/reach | Approved episodes/guests/replay links, cleared imagery and history claims |
| C16 | Media files | About downloads #; media-kit heading/guidance | Omit nonexistent download CTAs; use real on-page bio if approved | Actual photo set, bio files, one-sheet, reel and rights/credits |
| C17 | Newsletter provider/consent/cadence | Unlabeled field; footer says 1–2 times/month | Proper local form and unavailable production state if provider missing | Provider/list credentials, consent wording and working unsubscribe |
| C18 | Policies/actual integrations | Home substitutions, conditional provider and retention statements | Preserve substantive draft text outside release, correct layout and mark approval status | Approved entity, contact, operational facts and revision dates; qualified review as needed |
| C19 | Article authorship and dates | API dates; guest posts display Shakil Hossain | Preserve original metadata; no automatic reassignment | Confirm author/publisher distinction and any archival edits |
| C20 | Vault purpose | Standalone reflection words, poor readability | Preserve as small public resource in local build | Owner confirms inclusion or explicit retirement mapping |
| C21 | Book-site relationship | Public link to https://fromsplinteredtocentered.com/ in popup/source | Preserve external link where editorially relevant | Confirm preferred placement; do not alter external project |
| C22 | Hosting/runtime/editor workflow | Empty current workspace apart from Git and this handoff | Astro local content + documented server boundary, no paid service signup | Target host/runtime, deployment access, editing needs and maintenance owner |

## Copy rules

- Keep Loren's voice: personal, direct, emotionally honest, focused on stories and possibility.
- Use “who this is for,” “what is included,” “what happens next” before broad transformation language.
- Avoid guaranteeing applause, revenue, funding, healing, or lasting measurable change.
- Do not invent response times, availability, scarcity, discounts or guarantees.
- Keep first-time inquiry language distinct from follow-up meetings.
- Do not rename client organizations, infer missing names, or change quotations to increase their commercial force.
- Do not let internal approval status, editor notes, or placeholder text appear in public page output.
- Unknown facts belong in the internal launch-blockers file. Public interim copy should be truthful and useful, not a wall of “TBD.”

## Suggested action labels

| Context | Label | Destination intent |
|---|---|---|
| Global primary | Inquire About an Event | Speaking inquiry |
| Service card | Explore Speaking / Coaching / Keynote Writing | Relevant service detail |
| Speaker footage | Watch Loren Speak | Actual verified reel |
| Coaching | Discuss Coaching | Coaching inquiry |
| Writing | Discuss Your Keynote | Writing scope form |
| Program | Ask About the Program | Program inquiry until application terms exist |
| Show viewer | Watch Bathrobe Moments | Actual channel/episode |
| Show applicant | Apply to Be a Guest | Dedicated application |
| Booking | Book a Discovery Call | Approved direct booking event only |
| Media | Download Speaker Bio (PDF) | Existing approved file, with actual format |

## Launch gate

Release validation must distinguish local preview completeness from production readiness. Draft marketing layouts may be finished while claims, payment rules or service credentials remain unapproved. Keep the project moving, but never publish false success states or unreviewed promises to hide missing inputs.

## Cinematic redesign preview — 20 October 2026

The user explicitly authorized reuse of named, already-published testimonials in the local redesign. Three records (Elsa Montoya, Ali P., Deborah Feldman) preserve the original quotation, attribution, and homepage source. Homepage excerpts link to full local quotations. These records have `previewOnly: true`, `publish: false`, and `approvalStatus: pending`. They are excluded when SITE_ENV is production, even if publish/approval fields are changed accidentally. Final publication review remains required.

The about-page narrative references foster care from the existing public About biography. Unsupported tenure, certification, guaranteed results, numerical metrics, pricing, and booking promises remain omitted. Promotional show artwork is explicitly historical, not a current schedule or proof of a published episode.
