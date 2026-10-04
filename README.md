# Grab Your Buddy & Grow landing page

This is a static campaign landing page. Upload all files in this directory to the same folder on the web server; no build step or WordPress plugin is required.

## Before publishing

1. Replace both `js-payment-link` placeholder actions in `index.html` with the final Stripe payment URL, and remove the payment dialog behavior from `script.js`.
2. Replace the LMH text mark and the two photo placeholders with approved brand assets.
3. Replace both placeholder testimonials with approved client quotes and attribution.
4. Replace `#privacy-placeholder` with the website's privacy-policy URL.
5. Confirm the program inclusions, lifetime-access terms, refund policy, and December 31, 2026 start-date language.

The seven-day reservation window is stored in each visitor's browser using `localStorage`, so it continues across page refreshes on that browser.
