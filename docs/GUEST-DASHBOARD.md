# Bathrobe Moments dashboard and guest booking

## Daily use

Open `/admin/` and request a sign-in link for `hello@lorenmichaelsharris.com`. Sign-in links expire after 10 minutes, work once, and create an eight-hour session. Public administrator registration is disabled.

Applications are private. Review the biography/topic, delivery status, show booking and discovery booking. Add team notes, refresh Calendly status, or resend the guest's private resume link. Mark discovery completed only after your team confirms the call took place. Missing, canceled or late discovery appears in Follow-up; the website does not cancel reservations.

Use **Prepare episode** to prefill an unpublished draft from an application, or **Add an episode** for another confirmed guest. Upload the finished guest banner (JPEG/PNG/WebP, maximum 2 MB), supply the weekday broadcast date and editorial text, preview it, then explicitly check **Publish** and save. No application or reservation automatically becomes public. Add the verified recording afterward. Keep the permanent URL slug when rescheduling; the editor preserves it automatically.

Banner files are decoded and optimized to WebP, stored in MySQL, and only served publicly while attached to a published episode. Application headshots remain private email attachments and are never reused as public artwork automatically. The original six recordings are imported without invented dates.

## Guest journey

The shared form supports all three entry points: show page, dedicated application page and Contact's guest intent. It saves the application before requesting email delivery. After provider acceptance, JavaScript reveals the show calendar on the same page; without JavaScript, the server redirects to the private booking page. Guests then book discovery before their show. Failure never creates a booking or claims delivery acceptance.

Calendly embeds prefill name/email and use the non-secret application ID as a tracking code. Browser booking notifications must come from the actual Calendly iframe; the server independently verifies attendee email, expected event type and Chicago broadcast time before recording success. API failures retain the Calendly reservation and provide honest recovery instructions. Expiring private resume links last 30 days and can be renewed from the dashboard. Duplicate accepted applications reuse the saved acceptance instead of sending the original inquiry again.

## Hosting configuration

Keep credentials exclusively in Hostinger's environment settings:

- `MYSQL_HOST`, `MYSQL_PORT`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD`
- `ADMIN_EMAIL=hello@lorenmichaelsharris.com`
- Existing `RECEIPT_SECRET`, `RESEND_API_KEY`, `RESEND_FROM`, `INQUIRY_TO`, and `PUBLIC_SITE_URL`
- `CALENDLY_API_TOKEN`: only `users:read`, `event_types:read`, `scheduled_events:read`
- `GUEST_BOOKING_ENABLED=true` only after the database and Calendly connection are verified
- `DASHBOARD_AUTO_MIGRATE=true` for the approved initial migration, then disable it

The show and discovery event-type URIs resolve from their exact scheduling URLs. Optional explicit URI settings are available in `.env.example`. Broadcasts use America/Chicago, Monday–Friday at 10 AM; Calendly controls availability. The public calendar was verified to expose an October 28, 2026 slot corresponding to 10 AM Chicago time. No availability settings were changed.

The dedicated dashboard database is separate from existing WordPress databases. The migration only creates dashboard tables and imports missing source episodes. An independent Git baseline preserves the site before these changes. For later migrations, download a private backup through Settings & backups first; this includes episodes, applications, banners and audit history, but excludes sign-in/session tokens. Do not commit backups.

## Reconciliation cron

The build packages `server/reconcile-job.mjs`. Run it every 15 minutes using Hostinger's Node runtime and private environment file. The command's paths must match the deployed hosting account:

`/opt/alt/alt-nodejs24/root/bin/node --env-file=/home/ACCOUNT/domains/DOMAIN/hbuilds/config/.env /home/ACCOUNT/domains/DOMAIN/hbuilds/current/nodejs/dist/server/reconcile-job.mjs`

The job calls a signed internal endpoint without exposing credentials on its command line. The endpoint rejects stale/invalid signatures. It discovers external/no-JavaScript bookings by the application tracking ID, verifies saved reservations, and follows Calendly rescheduling references. Cancellations and discovery conflicts remain visible for the team. Only metadata is logged; no biographies, messages, attachments or tokens.

## Testing and release

Local dashboard QA uses an explicitly enabled SQLite database under ignored `.local/`, never production credentials. Production uses Hostinger MySQL. Browser tests create clearly labelled local fixtures and unpublish them afterward. They must never be imported into the hosting database.

Public schedules and episodes are rendered at request time so publication does not require a GitHub push. If the database is unavailable, the public archive falls back to the six existing source conversations and the lineup shows an honest notice. Private routes and staging remain noindex. Main-domain cutover and deleting old WordPress installations are separate operations.
