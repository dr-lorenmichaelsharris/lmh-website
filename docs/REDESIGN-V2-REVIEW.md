# Media-rich redesign review

22 October 2026. Baseline: `3153087`, preserved on `codex/baseline-before-media-redesign`. Implementation: `codex/cinematic-media-redesign`.

## Visual and content assessment

The newer raspberry, blue, floral, and hat portraits give Home, Program, About, and Bathrobe Moments distinct identities. Natural colour provides energy against black, warm white, and gold. Full-width event footage and genuine workshop/audience photographs replace repeated portrait treatments. The original logos and photographic credits remain intact.

The opening screens identify Loren, the offer, and a concrete action. Body copy is 18px; controls/navigation are at least 16px and secondary labels at least 14px. Navigation collapses before it needs smaller text. Home now moves from introduction to film/evidence, services, the actual program, biography, testimony, show/book, and an event inquiry.

The program replaces vague promises with its schedule, twelve modules and exercises, six pieces of participant work, eight pathways, and qualified access/support terms. Bathrobe Moments has six verified recordings and its real branding. Videos load on request, except the eligible muted desktop homepage film. No fabricated scenes, unsupported statistics, press-logo claims, prices, or payment flows were added.

These are design judgments, not proof of higher conversion. The program is necessarily long; expandable modules and phase navigation make it navigable. Some archival photography and video posters remain softer than the new portraits. Hosted videos depend on YouTube availability.

## Technical evidence

- Astro check: 63 files, zero errors, warnings, or hints.
- Unit/regression tests: 18 passed.
- Node build and local form-flow checks passed; program validation preserves service context and message. No live email sent.
- Vercel adapter build passed; serverless function and static assets generated in ignored `.vercel/output`. Source and configuration belong in Git; generated `dist` does not.
- All 41 migration entries and 1,467 internal references passed route/link verification.
- 120 rendered layouts across 320, 390, 768, 1024, and 1440 CSS pixels: no overflow or broken media.
- Nine representative axe scans: zero detected violations. Keyboard menu/skip link, no-JavaScript content/forms and curriculum expansion passed.
- Eleven media behavior checks passed. Real YouTube playback advanced on Home, Show, and Program, with pause, sound, resume, and offscreen pause confirmed. Local introduction playback passed. Mock-based API checks are distinguished in `media-qa.json`.
- Ten 200% desktop reflow-equivalence checks passed using half-width CSS viewports at device scale 2. This is not a claim of a manual browser-toolbar zoom test.

Detailed reports: `browser-qa.json`, `route-coverage.json`, `http-flow-tests.json`, `media-qa.json`, and `zoom-and-typography-review.json`.

## Comparison and delivery

Matched desktop/mobile screenshots for Home, Program, and Show are in `comparison-v2`. The baseline is the previous local design, not a browser challenge from the public source site. Full responsive captures are in `screenshots`.

Local preview: http://127.0.0.1:4323/. GitHub PR: https://github.com/dr-lorenmichaelsharris/lmh-website/pull/3. Vercel successfully deployed the branch to https://lmh-website-git-codex-cinematic-media-redesign-lmh8.vercel.app/. The hosted preview redirects unauthenticated requests to Vercel sign-in. Both browser-control entry points failed with a Windows sandbox helper lock error, so hosted visual review is explicitly incomplete. Main remains unchanged pending an accessible preview or the owner’s instruction to proceed using completed local review and the successful hosted build. Production publication review and live form/provider setup remain separate from this design preview.
