# Visitor journey audit — 23 October 2026

This is an expert interface review supported by browser checks, not research with recruited users.

## Findings and changes

| Priority | Finding | Resolution |
|---|---|---|
| High | Work with Loren looked like a link but only toggled a menu. | Its text now opens the service overview; a separate labelled chevron button opens the submenu. Keyboard, Escape, outside-click and focus dismissal are supported. |
| High | Only three of nine original video testimonials were represented, and all were preview-only. | Registered and approved the nine original recordings explicitly requested by the owner. Home and Testimonials show all nine; Results and Program use a shorter selection. |
| High | Inquiry delivery targeted the old Gmail inbox and lacked configured production credentials. | The recipient is configurable and defaults to the owner-provided hello@lorenmichaelsharris.com. Resend delivery, private headshots, acceptance receipts and failure recovery are tested. Live acceptance remains blocked by missing provider/hosting credentials. |
| High | Newsletter signup had no working subscription provider. | Added signed, expiring confirmation emails and explicit confirmation before contact/segment creation. Existing unsubscribe choices are preserved. No campaign is sent. |
| Medium | The logo was small, low resolution, and had an opaque black square. | Used the higher-resolution original brand source, removed the background, enlarged it to 88px desktop/64px mobile, and deliver optimized responsive WebP variants. |
| Medium | Public preview labels distracted from visitor tasks. | Removed the banner and testimonial editorial notices. Internal approval data and indexing/release safeguards remain separate. |
| Medium | The service overview was vague, particularly about the program. | Four concrete cards explain audience, offer and destination. A shorter heading brings the choices higher on the page. |
| Medium | Evidence was split between Results and Testimonials without a clear complete collection. | Testimonials is the complete collection, linked from navigation, footer and Resources; Results remains a contextual introduction. |
| Medium | Long show/program pages required visitors to search for the next section. | Added labelled section links for watching, applying, curriculum, support, questions and enrollment. |
| Low | Desktop menu used a text glyph and a cramped old-style panel. | Replaced it with an SVG toggle and spacious rounded panel with service descriptions and active states. |

## Visitor paths reviewed

- Book buyer: header or prominent homepage feature → existing book website. No new checkout or invented purchase terms.
- Event organizer: Keynote Speaking → audience/process/reel → event inquiry with speaking intent retained. Organizer resources remain linked.
- Coaching prospect: Work with Loren → Coaching → relevant inquiry; Testimonials is available for evidence.
- Keynote-writing client: Work with Loren → Keynote Writing → inquiry retaining the writing context.
- Program applicant: overview → twelve-week program → curriculum/support/FAQs → enrollment inquiry.
- Show viewer: Bathrobe Moments → watch section → six recordings or official archive.
- Prospective guest: show invitation → on-page application → accepted-delivery receipt → discovery-call link. No appearance is promised.
- Returning visitor: direct menu, footer, Resources, contact email and Calendly links.

Common form fields remain in place when changing topic. Unused fields stay disabled. Invalid submissions preserve text and explain when an attachment must be selected again. No successful delivery is claimed on provider rejection.

## Evidence and limitations

See hostinger-v5-browser-qa.json, journey-v5-qa.json, http-flow-tests.json, and route-coverage.json. Matching header before/after captures and responsive page screenshots are in comparison-v5. The before captures come from the prior committed revision on an isolated local server.

One hosted recording has no verified speaker name in its source metadata; its card uses “Client coaching experience” rather than an invented identity. The source filename identifies Dr. Lynne Hurdle-Price for the other hosted recording. Quotes and star ratings have not been invented.

Hostinger account access, Resend credentials, verified sending domain and newsletter segment are not available in this session. Real inbox delivery, live unsubscribe settings and the hosted deployment cannot be claimed verified. See HOSTINGER-SETUP.md for the concrete activation steps. Historical policies, articles and unrelated editorial records retain their original review status; the existing production publication gate remains in place.
