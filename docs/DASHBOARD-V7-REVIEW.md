# Dashboard update: review evidence

## Visual review

Kept the current brand and removed The Book from desktop/mobile navigation while preserving its other placements. The show now provides a weekly lineup, linked archive, and permanent episode pages with full-ratio guest banners and readable HTML text. The schedule opening is deliberately compact so the week controls and daily slots are easy to find. The private dashboard uses the same gold/black palette with readable controls and a mobile layout.

Matched before/after Home, show, application, and Contact screenshots are under `comparison-v7/`. Additional screenshots show the archive, episode, private editor, and actual embedded Calendly calendar. No confirmed upcoming guest details were supplied, so the live schedule must remain honest about unannounced slots. Local testing fixtures are explicitly labelled QA and are not imported into production.

This is an implementer visual/usability review, not user-testing evidence.

## Local technical verification

- Astro type check: 114 files, zero errors/warnings/hints.
- Hostinger Node production build: passed, including the packaged reconciliation job.
- 39 regression tests passed, including Chicago DST/week boundaries, single-use sign-in, resume expiry, persistent rate limits, optimistic edits, verified show/discovery states, cancellation/rescheduling and failure preservation.
- 41 migration routes, 2,147 internal references, zero failures.
- Existing HTTP validation/recovery/idempotency tests passed in local mode, without live mail.
- Browser: private login, draft/banner privacy, explicit publication, unpublishing, rescheduling with stable URLs, calendar downloads, CSRF rejection and same-page application-to-Calendly handoff passed.
- Schedule, archive, episode and dashboard checked at 320/390/768/1024/1440px with no document overflow. Reduced motion, no-JavaScript calendar links and 200% equivalent viewport reflow checked.
- Actual Calendly embed loaded in the mobile review; no mock was used for that rendering check.

Hosted database, credential, cron and booking verification are recorded during preview rollout. Do not describe a hosted integration as active based solely on these local results.
