# Book launch and media revision

Implemented October 23, 2026. Baseline: `codex/baseline-before-book-launch` (`dbead61`).

## Visual and wording review

The supplied book now has the first substantial section after Loren’s opening hero, with live, readable text and a real link to the book website. The once-per-visit dialog waits for 30 seconds and for the visitor to pass that section. It does not interrupt forms or playing films.

The homepage’s service cards use genuine photographs in two moving rows on desktop and swipeable rows on mobile. Reduced motion removes the movement. About and Bathrobe Moments have landscape video galleries. Testimonials use portrait-led video cards without invented ratings or quotations; existing publication restrictions remain in place.

Bathrobe Moments restores the original narrative sequence, its fiery branding introduction and conversation montage, host message, pillars, guest profiles, invitation, offer, and an on-page application. The conflicting paid-package copy is removed. The free offer ends after January 1, 2027 in America/Chicago; the server then presents an invitation to discuss arrangements.

The Power of We poster is a verified audience frame at 16.5 seconds from the official film. The supplied speaker reel replaces the old reel on Speaking and Media Kit, and is available in About’s gallery.

The header explicitly exposes Keynote Speaking. Work with Loren includes Keynote Writing, Coaching, Mindset Revolution, and Contact. The contact topic selector changes fields in place and preserves the visitor’s drafts.

Visual judgments are based on rendered local screenshots, not on the test counts below. Crops, heading wraps, the book composition, and form layout were inspected. A 320px overflow in the Bathrobe hero and contact form was corrected. Source recordings vary in resolution and retain their original quality; no synthetic imagery is used.

## Technical verification

- Astro type check: no errors, warnings, or hints.
- 22 unit/regression tests, including expiry, headshot type/size, provider failure, and signed receipt validation.
- Node and Vercel-adapter builds pass.
- 41 migration routes and 1,524 internal references pass.
- 30 representative layouts across 320, 390, 768, 1024, and 1440px: no overflow or broken media.
- Six accessibility scans: no reported WCAG A/AA violations.
- Actual Chrome page zoom at 200%: all six representative pages fit without horizontal overflow. This uses an isolated QA browser profile, not the user’s browser preferences.
- Keyboard navigation, popup dismissal, topic switching, no-JavaScript forms, reduced motion, and gallery pause pass.
- Media checks exercise real local video playback and actual YouTube playback. Ambient hero tests cover mobile tap-to-play, desktop muted playback, reduced-motion fallback, offscreen pause, and persistent manual pause. Starting another player stops the current player.
- Form HTTP checks use the local simulation adapter. Resend acceptance/rejection is tested using a mocked provider. No live email was sent.

Evidence: `launch-browser-qa.json`, `launch-zoom-qa.json`, `media-qa-v3.json`, `launch-media-extras.json`, `http-flow-tests.json`, and `route-coverage.json`.

## Screenshots

`comparison-v3/before/` contains the saved baseline rendered at 390px and 1440px. These captures were regenerated from an isolated baseline checkout after waiting for every image to decode. `comparison-v3/after/` contains the new layouts at all five widths and 200% zoom captures. Both sets use 900px viewport height for the unzoomed comparisons.

Home: [before desktop](comparison-v3/before/1440-home.png) / [after desktop](comparison-v3/after/1440-home.png), [before mobile](comparison-v3/before/390-home.png) / [after mobile](comparison-v3/after/390-home.png).

Bathrobe Moments: [before desktop](comparison-v3/before/1440-bathrobe-moments.png) / [after desktop](comparison-v3/after/1440-bathrobe-moments.png), [before mobile](comparison-v3/before/390-bathrobe-moments.png) / [after mobile](comparison-v3/after/390-bathrobe-moments.png).

## Live form activation still required

Set these on the existing Vercel project, then redeploy:

- `FORM_ADAPTER=resend`
- `FORMS_APPROVED=true`
- `RESEND_API_KEY`: the account’s API key.
- `RESEND_FROM`: an address on a verified sending domain.
- `RECEIPT_SECRET`: a securely generated secret of at least 32 characters.

Inquiries and guest applications go only to `lorenmichaelsharris@gmail.com`, with the visitor as Reply-To. Headshots are attached privately, not stored publicly. The older general webhook deliberately cannot accept guest uploads. The newsletter retains its separate consent-aware webhook; Resend inquiry notifications do not pretend to create newsletter subscriptions.

Until credentials are configured, the site returns an honest unavailable message, retains entered text, and offers email and Calendly alternatives. A provider-accepted submission displays a signed, expiring confirmation and the discovery-call link. This confirms neither a show appearance nor inbox delivery.

Calendly currently points to Loren’s general profile, as selected. A dedicated pre-show event can be configured later without changing the form flow. Existing publication-review restrictions and business-release approvals remain unchanged.
