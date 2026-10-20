# Local verification — 21 October 2026

The optimized Astro/Node build was tested locally. Nothing was deployed, no live provider was called, no email was sent and no payment was made.

| Check | Observed result | Evidence |
|---|---|---|
| Strict type/content checks | 0 errors, 0 warnings, 0 hints from astro check | `pnpm check`; exact dependency versions in lockfile |
| Optimized build | Passed; 41 registered routes represented, marketing/archive pages prerendered and forms on demand | `pnpm build`; staging indexing retained |
| Automated tests | 13 passed | tests/content.test.ts, tests/evidence.test.ts and tests/forms.test.ts |
| Source integrity | All 11 article bodies match normalized raw source text; date/author/permalink tests pass; ten policies contain no legacy forms/scripts | tests/content.test.ts, docs/evidence/raw |
| Local HTTP flows | 7 checks passed: guest receipt/package, duplicate POST, neutral direct/query visit, 422 with field preservation, forged package, cross-origin rejection, newsletter consent | http-flow-tests.json |
| Registered routes and internal references | 41 routes, 1,375 internal links/images/forms/anchors; zero failures; actual 404 verified | route-coverage.json |
| Responsive layout/image checks | 120 combinations: 24 representative destinations × 320/390/768/1024/1440 CSS pixels; no horizontal overflow or broken images | browser-qa.json; screenshots/ |
| Automated accessibility | Zero violations on 7 representative routes using WCAG A/AA tag sets through 2.2 | browser-qa.json |
| Keyboard | Skip link first/targets main; native mobile menu opens with Enter | browser-qa.json |
| No JavaScript | Essential homepage content/links and program inquiry remain available | browser-qa.json |
| Error behavior | Unavailable provider preserves inquiry fields; local and mocked failure/timeout return no success receipt | browser-qa.json, tests/forms.test.ts |
| Production gate | Rejects missing content/identity/assets/forms/hosting approvals as intended | `pnpm release:check`; release-approvals.json |

## Visual review

Screenshots cover Home, three services, About, program, Results, Resources, Blog, a full essay, a full policy, show, application, contact, Vault, FAQs, policy hub, Media Kit, neutral receipt, error and 404.

Direct image inspection included Home at desktop/mobile, the mobile contact/application, Speaking at tablet, the show at 1024 and policy reading. Form acknowledgment wrapping was fixed. The hero uses a suitable original portrait; the stage photograph remains local with source/credit recorded. Below-fold photograph screenshots were refreshed after explicitly scrolling images into view and awaiting decode; an initially blank full-page capture was a screenshot timing issue, not a missing asset.

Useful review images:

- [Desktop first screen](screenshots/1440-home-first-screen.png)
- [Desktop full homepage](screenshots/1440-.png)
- [Mobile first screen](screenshots/390-home-first-screen.png)
- [Mobile guest form](screenshots/390-bathrobe-moments-apply-.png)
- [Tablet Speaking](screenshots/768-services-speaking-.png)
- [Show](screenshots/1024-bathrobe-moments-.png)

## Lab performance

Single cold Chromium run per route against the built local server: 390×844, 4× CPU slowdown, 150ms latency, 1.6Mbps download. These are reproducible lab observations, not field Core Web Vitals or a performance guarantee. Latest measurements are in performance.json.

| Route | LCP | CLS | Inline executable JS, gzip |
|---|---:|---:|---:|
| Home | 1.692s | 0 | 242 bytes |
| Speaking | 1.320s | 0 | 242 bytes |
| Speaking inquiry | 1.088s | 0 | 542 bytes |
| Essay | 1.052s | 0 | 242 bytes |

No external executable JavaScript resource was loaded on these routes. Astro inlined the reduced-motion-aware photograph enhancement and small form-pending enhancement. INP and field p75 were not measured. Browser timing varies between runs; use the recorded method and JSON rather than extrapolating a production guarantee.

## Limits and remaining verification

Automated accessibility scans plus limited keyboard/reflow inspection do not establish complete WCAG 2.2 conformance. Full screen-reader/manual review, approved media alternatives, production delivery/unsubscribe, provider payments if commissioned, real host redirects/headers/storage and field performance remain release tasks. Empty proof/download/episode collections emit expected content-loader warnings and intentionally render no fabricated records.

The source policies remain draft, including unresolved entity substitutions/operational facts. Detailed keynote outcomes, coaching/writing commercial terms and program timing are withheld until approved. Their independent templates/forms exist; approval-dependent content is not claimed complete or production verified. See launch-blockers.md.

## Cinematic redesign verification

The final optimized build uses self-hosted WOFF2 fonts and a static optimized header logo, including server-rendered form pages. Final built route checks returned zero failures across all 41 migration entries and 1,375 internal references. All 13 tests and seven local HTTP form checks passed. The existing 120 responsive screenshots cover five widths; interaction and accessibility checks were rerun on the final build. Preview-only testimonial exclusion is covered by automated tests.

Matching original, previous rebuild, and cinematic homepage captures are in comparison/. Direct visual review found a clearer name and offer, stronger photographic hierarchy, earlier evidence, and more concrete service paths. These are design judgments, separate from automated correctness results. Full publication review and business integrations remain outstanding.
