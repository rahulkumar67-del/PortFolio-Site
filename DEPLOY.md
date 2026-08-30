# Aerovant site — what to do before publishing

## Blockers

1. **Fiverr links.** Five `REPLACE-...` placeholders: four gig URLs in the
   Packages section of `index.html`, plus your Fiverr profile URL in the footer.
   Find them with: `grep -n REPLACE index.html`
   Keep `rel="noopener"`. Do NOT add `rel="nofollow"` — that would stop the link
   passing any ranking signal to your gig, which is the reason for linking at all.
2. **Form endpoint.** `js/main.js` → `FORM_ENDPOINT`. Create a free form at
   formspree.io or web3forms.com and paste the URL. Until then the form falls back
   to opening a mail client, which silently loses leads on mobile.
3. **GCSDRONE screenshot.** `images/case-gcsdrone.png` / `.webp` is a placeholder
   that reads SCREENSHOT PENDING, on purpose, so it cannot ship by accident.
   Capture the real build: multi-screen layout, live telemetry, 1920x1080, no text overlay.
4. **Phone number.** Removed rather than guessed — the old site said +91 96100 40837,
   your resume says +91 7410921656. Add the correct one back if you want it public.

## Also worth doing

- Switch the contact email to `hello@aerovant.me` once domain forwarding is live.
  Two places: `index.html` (mailto, marked with a TODO comment) and `js/main.js` (`CONTACT_EMAIL`).
- Recapture the flood sim. `images/case-flood.*` is cropped from your old capture —
  real, but soft and flat-lit.

## Deploy

GitHub Pages: push, then Settings -> Pages -> Source: GitHub Actions.
`CNAME` is already set to aerovant.me; point your DNS at GitHub Pages.
Netlify / Vercel: drop the folder in, no build command, publish directory `.`.

Local preview (required — `fetch()` is blocked on `file://`):

    python -m http.server 8080

## Removed from the old site

- `js/feedback.js` and the feedback panel — stored ratings in localStorage, so it showed
  every visitor a permanent "0.0 / no reviews" badge and no submission ever reached you.
- Resume download links, the "open to internships" line, Instagram, the SolidWorks tile.
- `images/work-1..4.png`, old `logo.png`, old `og-image.png` — replaced.
