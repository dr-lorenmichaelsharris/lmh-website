# Hostinger deployment and delivery setup

The site is an Astro application with a Node server, not a static upload. Vercel configuration remains available; do not remove the current deployment until the Hostinger copy has been verified.

## Hostinger Business/Cloud

Connect the existing GitHub repository as a Node.js web application. Use Node 24, install with `pnpm install --frozen-lockfile`, build with `pnpm build:hostinger`, and start with `pnpm start`. For the hPanel build settings, set Output directory to `dist` and Entry file to `server/entry.mjs` (relative to that output directory). The repository start command remains `node ./dist/server/entry.mjs`; retain both `dist/server` and `dist/client`. The server reads Hostinger's PORT and must bind to HOST=0.0.0.0. Do not upload only dist/client.

Set DEPLOY_TARGET=hostinger. PUBLIC_SITE_URL=https://lorenmichaelsharris.com controls newsletter confirmation destinations. If reviewing on a Hostinger temporary domain, set PUBLIC_SITE_URL to that exact HTTPS origin and HOSTINGER_PREVIEW_HOST to its hostname before building. Replace these with the final domain before cutover. Existing www and apex domains are allowed. HTTPS is required for secure receipt cookies.

SITE_ENV=staging keeps search indexing disabled during verification but no longer displays a public preview banner. SITE_ENV=production still invokes the repository's existing editorial release checks; pending policies and other records have not been silently approved by this change. Complete the existing release register before enabling search indexing. This does not prevent validating the Node runtime or configuring real delivery on the staging deployment.

## Inquiries

Configure these secrets/settings in Hostinger, never GitHub source:

- FORM_ADAPTER=resend
- FORMS_APPROVED=true
- INQUIRY_TO=hello@lorenmichaelsharris.com
- RESEND_API_KEY: a sending key from the owner's Resend account; newsletter contact operations require appropriate contact permissions too.
- RESEND_FROM: a verified sender, for example `Loren Michaels Harris <website@send.lorenmichaelsharris.com>` after that sending subdomain is verified.
- RECEIPT_SECRET: a cryptographically random secret of at least 32 characters, shared across all running instances.
- LOCAL_TEST_MODE=false

Verify the sending domain in Resend using its exact supplied DNS records. Preserve Hostinger's existing mailbox MX records; a separate sending subdomain avoids replacing them. Messages go to hello@lorenmichaelsharris.com and replies target the visitor's email. Guest headshots are private attachments, not stored publicly.

Server logs include provider acceptance IDs or rejection status, never message bodies or attachment contents. IP and address throttles are bounded in-process controls for the managed Node process. If deploying multiple replicas, add a shared/edge rate limiter; provider idempotency and signed receipts already operate across instances. Do not enable local simulation on a public hostname.

## Newsletter

Create a dedicated newsletter segment in Resend and set NEWSLETTER_SEGMENT_ID. Signup sends a 24-hour confirmation link. Merely visiting the link does not subscribe anyone; its confirmation button performs the action. Existing unsubscribed contacts are never silently reactivated. Resend Broadcasts manage unsubscribe links and exclude globally unsubscribed contacts; include the provider's unsubscribe control in every future campaign. This change does not send a newsletter or create campaigns.

## Live acceptance and rollback

1. Deploy to Hostinger's temporary domain and verify pages, static media, redirects, and the Node server.
2. Configure secrets and verified sender. Submit a clearly labelled inquiry and guest application to the owner inbox, then verify arrival, Reply-To and attachment. A provider acceptance response alone is not proof of inbox arrival.
3. Use an owner-controlled address to verify newsletter confirmation, segment membership, and unsubscribe suppression. Do not test with visitor addresses.
4. Verify HTTPS, final-domain confirmation links, secure cookies, and all migration routes before DNS cutover.
5. Keep the existing Vercel deployment and prior DNS values for rollback. No Hostinger credentials or Resend secrets were supplied during implementation, so live delivery and hosted acceptance remain unverified.
