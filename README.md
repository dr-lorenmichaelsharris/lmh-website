# Loren Michaels Harris — Astro rebuild

Local multipage implementation of the 41-entry WordPress migration register. Marketing/archive pages are prerendered; inquiry, guest application, receipt and submission routes use the Node adapter. Nothing has been deployed or changed on WordPress.

## Run locally

Requires Node >=22.22 and pnpm 11.25.0. Dependencies are exact with a lockfile. Astro 7.4.1 and Node adapter 11.1.8 were checked against the registry/current official documentation. TypeScript 6.0.3 is intentional: current `astro check` rejects TypeScript 7.

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Open the printed address, normally http://127.0.0.1:4321. Default forms show delivery-unavailable and preserve inquiry fields.

For the built server:

```powershell
pnpm check
pnpm test
pnpm build
$env:HOST='127.0.0.1'
$env:PORT='4324'
node dist/server/entry.mjs
```

Serve the entire `dist` Node application. A static-file host alone cannot receive these forms. `dist/client` is not a complete deployment.

In this Codex environment, if pnpm is absent from PATH, use `C:/Users/ummah/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback/pnpm.cmd`.

## Test forms without sending email

Copy `.env.example` to `.env`, then set `FORM_ADAPTER=local`, `LOCAL_TEST_MODE=true`, `SITE_ENV=staging`. Restart the server. Simulation is permitted only on loopback origins and never in a production build. Receipts explicitly say local test; no email, subscription, payment or scheduled appearance is created. `LOCAL_TEST_OUTCOME=failure` simulates rejection. Use the default `unavailable` adapter for ordinary review.

`pnpm test:http` starts and closes an isolated built server on port 4330 with the local adapter and `.test` addresses. It never invokes a real provider. `pnpm test` covers mock provider acceptance/rejection, concurrency, duplicate behavior, newsletter consent, bounds, spam checks, rate limiting and package validation.

## Edit content

- `src/data/site.ts`: public contact fallback, show/book links, service priority and guest IDs. Unknown booking events/prices/product mappings remain empty.
- `src/data/services.json`: audiences, summaries, discussion points and process steps, consumed by service details and homepage service ordering.
- `src/data/articles.json`: 11 body-only API migrations with original URLs/dates/displayed authors and archival guest designation. `docs/evidence/raw` retains API responses. No WordPress runtime dependency or imported menus/comments.
- `src/data/policies.json`: ten substantive policy bodies. Misplaced guest form removed. Legacy entity substitutions, operational claims and the affiliate refund paragraph remain review issues; no legal facts invented.
- `src/data/programs.json`: timeline/inclusions/access fields. Empty timing is deliberate until C11 is reconciled. Approved content renders without new page code.
- `src/data/testimonials.json`: three source-attributed preview-only records authorized for local review. `case-studies.json`, `episodes.json`, `downloads.json`: schema-validated collections awaiting approved records. `ApprovedContent.astro` renders only `publish: true` / `approvalStatus: approved` records.
- `src/pages`: marketing copy/composition; `src/components`, `src/layouts`, `src/styles/global.css`: shared system. Native menus/FAQs work without JavaScript.

Records require an `id`, `sourceUrl`, `approvalStatus`, `publish` and the fields in `src/content.config.ts`. Approval notes remain under `docs`, outside public output. Never put private evidence or secrets in `public`.

## Migration and assets

All 41 original paths remain. The old application redirect is replaced by a dedicated form. Nothing is silently retired or redirected home. The Bathrobe Moments `#application` and program `#application` / `#experience` targets exist. A real 404 and error/retry view are included.

`docs/route-coverage.json` records HTTP/link checks; `docs/route-migration.csv` records implementation status. Articles retain sanitized `content.rendered`, publication metadata and displayed authors. Guest notes are historical announcements.

Images are local and use Astro responsive processing. `docs/asset-usage.json` records the two photographs, origins, credit and pending rights review. The social image is copied unchanged to `public/social.webp`. Event photographs imply no endorsement. No nonexistent download is advertised.

`scripts/fetch-sources.mjs` / `scripts/migrate-content.mjs` are intentional source-refresh tools, not build steps. Refreshing requires editorial comparison and may overwrite edits. Original handoff audit tools and ZIP remain preserved.

## Live integration boundary

Enable `FORM_ADAPTER=webhook` only after C04/C17 approval, destination setup and verification. Configure separate HTTPS `INQUIRY_WEBHOOK_URL` / `NEWSLETTER_WEBHOOK_URL`, server-only `FORM_WEBHOOK_TOKEN`, and `FORMS_APPROVED=true`. The provider receives JSON `{kind, fields}`, Bearer authentication and an `Idempotency-Key`. A 2xx means provider acceptance, not proven inbox delivery. The receiver must durably deduplicate keys and implement the chosen retry policy, newsletter list, consent and unsubscribe behavior. No provider was contacted in this build.

Forms enforce server validation, bounded requests/fields, honeypot, origin checks, process-local throttling and duplicate suppression. Errors preserve inputs. Receipt cookies contain opaque tokens, are HTTP-only/SameSite and expire after ten minutes. The receipt store holds only service, package preference and simulation status. Queries cannot create success/payment states. Restarting safely expires receipts.

Before production scaling, move rate limits, receipts and duplicate coordination to host-appropriate durable/shared storage, and configure trusted proxy behavior (C22). Keep credentials server-side; do not log messages/personal details.

Payments are disabled. `paymentBoundary()` returns unavailable and is tested. There is no checkout or payment webhook pretending funds were received. Implement hosted payment only after C12–C14 approval; separately test signed webhooks, idempotency, failure/cancellation/refunds and server-resolved product IDs.

## Validation

```powershell
pnpm check
pnpm test
pnpm build
pnpm test:http
$env:PREVIEW_URL='http://127.0.0.1:4324'
pnpm verify
pnpm test:browser
pnpm test:performance
```

Browser scripts use isolated headless Google Chrome, not the user's profile. Evidence is in `docs`: QA JSON, route coverage, HTTP flow tests, lab performance JSON and screenshots at 320/390/768/1024/1440 pixels. See `docs/TEST-REPORT.md` for results/limits. Representative template tests are not accessibility certification or field Core Web Vitals.

## Release and hosting

Default staging uses noindex, disallow-all robots, an empty sitemap and a design-preview label. Canonicals target intended live URLs. Production includes approved article/policy records and builds the sitemap from approved routes. Success/error routes remain noindex.

`SITE_ENV=production pnpm build` is gated by `scripts/release-check.mjs` and `docs/release-approvals.json`. It fails deliberately until content, assets, identity, forms and hosting approvals are recorded. Do not bypass this gate. Confirm HTTPS/proxy behavior and the exact host allowlist in `astro.config.mjs`; normalize HTTP/alternate hosts at the deployment edge while preserving paths. The proxy must sanitize forwarded headers before Node receives them.

Remaining inputs: `docs/launch-blockers.md`. Host setup, credentials, real delivery checks and replacing WordPress require separate work/authorization. No DNS, deployment, live test message or payment was performed.

Official references: [content collections](https://docs.astro.build/en/guides/content-collections/), [on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/), [Node adapter](https://docs.astro.build/en/guides/integrations-guide/node/), [images](https://docs.astro.build/en/guides/images/). Installed source/types were checked for Astro 7 host/origin validation.

## Cinematic redesign

The active visual system is `src/styles/cinematic.css`, layered over the existing structural stylesheet. Fonts are self-hosted Barlow Condensed and Manrope; licenses are included under `public/fonts`. The current logo, additional genuine photographs, book cover, and historical show artwork have source records in `docs/asset-usage.json`.

The homepage and Speaking, Coaching, Writing, About, Results, Testimonials, show, and program pages have distinct compositions. Article bodies and original permalinks are unchanged. Reading routes use warm-white surfaces. Motion respects reduced-motion preferences and never hides essential content when JavaScript is unavailable.

`docs/comparison` contains original/current/before screenshots. `node scripts/cinematic-review.mjs` refreshes original-vs-redesign home and Speaking captures. `docs/screenshots` contains the full responsive QA set.

A pre-edit source/docs/public backup, including the previously untracked files, is stored alongside the workspace as `LMH-before-cinematic-20261020-025751.zip`.
