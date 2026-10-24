# Episode management and lineup review

## Visual and usability review

The schedule now brings a full-proportion guest banner forward, with the next broadcast beside its guest, topic and Chicago date. Selected-week cards use three columns on desktop, two on tablets and manual swiping on mobile. One short notice replaces repetitive empty weekday panels. Week navigation and the full upcoming list make distant dates discoverable. Episode pages use the banner only once, including when it serves as the recording poster.

The editor now distinguishes Save draft from Publish episode, explains the episode's placement, retains text on errors, and identifies missing publication fields. Episode inventory includes search, status filters, thumbnails, Trash and restore. This is an implementer visual/usability review, not user-testing evidence.

Comparison screenshots: `comparison-v8/before` and `comparison-v8/after`. Populated lineup screenshots use clearly labelled local QA fixtures, never real new show announcements. Live content was backed up before rollout. No real guest record was published, trashed, or rescheduled for testing.

## Technical checks

- 42 regression tests passed, including persistent Trash tombstones, private restoration, shared-banner visibility, Chicago dates and database-outage fail-closed behaviour.
- Astro check: 118 files, zero errors/warnings/hints. Node production build passed.
- Browser tests passed for manual publication without applications/bookings, inline validation and text recovery, trash/restore, public page/calendar removal, uploaded-banner privacy and stable URLs.
- Schedule, archive, episode and admin layouts checked at 320, 390, 768, 1024 and 1440 pixels with no document overflow. Mobile controls and no-JavaScript navigation passed; reduced motion used throughout screenshot review.
- All 41 migration routes and 2,148 internal references passed. Existing HTTP form-validation, receipt, duplicate and recovery tests passed in local simulation.

## Using episodes

Use Add an episode directly; no guest application or Calendly booking is required. Save draft keeps it private and can unpublish an existing episode. Publish episode requires the guest, topic, finished banner, weekday date, biography and description. The placement summary links to its scheduled week or archive. Scheduled episodes beyond next week remain accessible through All upcoming episodes.

Move to Trash opens a named confirmation. It removes public visibility but retains the row, slug, banner and audit trail. Restore as draft never republishes automatically. There is no permanent deletion or automatic purge. Calendar reservations remain independently managed in Calendly.

No database migration or credential change is required: the optional Trash fields live in existing episode JSON payloads. Backups include these records. Dynamic banner responses use no-store so removed publication permission is checked on each new request. Already downloaded copies cannot be recalled.

## Hosted preview

A fresh private backup downloaded successfully before rollout. The feature build completed on Hostinger. The authenticated inventory retained all eight episodes (two drafts and six published), including the user's manually created draft; all filters and Trash links rendered. No real publication states were changed. Matching empty-state/source-episode comparisons are retained separately from the populated local-fixture demonstrations (`populated-*`). Keyboard week navigation and 200% equivalent viewport reflow also passed.
