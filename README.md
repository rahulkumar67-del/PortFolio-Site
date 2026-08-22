# Rahul Kumar — Portfolio (Production Build)

A modern, deploy-ready, single-page personal portfolio for **Rahul Kumar** — Game & VR Developer.

Theme: dark + cyan accent. Pure HTML/CSS/JS — **no build step**, no dependencies.

---

## Quick start (local preview)

Open `index.html` directly in your browser, **or** start a tiny local server (recommended, because `fetch()` is used for project data):

```bash
# Python 3
python -m http.server 8080
# then open http://localhost:8080
```

Or with Node:

```bash
npx serve .
```

---

## Folder structure

```
final/
├── index.html              # Main portfolio page
├── project.html            # Dynamic project detail page (?id=fps|drone|space|flood)
├── 404.html                # Not-found page
├── style.css               # All styling
├── manifest.json           # PWA manifest
├── robots.txt              # SEO / crawler rules
├── sitemap.xml             # SEO sitemap
├── netlify.toml            # Netlify deploy config
├── vercel.json             # Vercel deploy config
├── .gitignore
├── .github/
│   └── workflows/deploy.yml  # GitHub Pages auto-deploy
├── data/
│   └── projects.json       # Project metadata for project.html
├── js/
│   ├── main.js             # Nav, tabs, contact form, reveal-on-scroll
│   ├── feedback.js         # Local-storage feedback panel
│   └── projects.js         # Loads project detail page
├── images/                 # All site images + resume PDF
└── docs/                   # Certificates
```

---

## Deployment

You can ship this folder to **any** static host. Configs for the three most common ones are included.

### 1. GitHub Pages (recommended for free hosting)

**Option A — repo root**
1. Copy the contents of `final/` to the root of your `PortFolio-Site` repo (or push this folder alone).
2. Commit and push to `main`.
3. In your repo: **Settings → Pages → Source: GitHub Actions**.
4. The workflow in `.github/workflows/deploy.yml` will auto-deploy on every push.

**Option B — gh-pages branch**
1. Push the `final/` contents to a `gh-pages` branch.
2. **Settings → Pages → Source: Deploy from branch → `gh-pages` / root**.

Your site goes live at `https://<your-github-username>.github.io/PortFolio-Site/`.
For a custom domain, add a `CNAME` file containing your domain.

### 2. Netlify (drag & drop or git-connected)

**Drag & drop**: visit [app.netlify.com/drop](https://app.netlify.com/drop) and drop the whole `final/` folder. Done.

**From repo**:
1. New site → import from Git → pick your repo.
2. Build command: *(leave empty)*. Publish directory: `final` (or `.` if you moved files to root).
3. `netlify.toml` already configures headers and the 404 page.

### 3. Vercel

```bash
npm i -g vercel
cd final
vercel
```

`vercel.json` sets caching headers and clean URLs.

### 4. Any other host (Cloudflare Pages, Surge, S3, Firebase Hosting, etc.)

Just upload the contents of `final/`. It's pure static HTML/CSS/JS.

---

## Customisation checklist

Before going live, update these:

- [ ] `index.html` → swap `https://rahulkumar.dev/` with your actual domain (canonical, OG, JSON-LD, sitemap).
- [ ] `sitemap.xml` and `robots.txt` → use your real domain.
- [ ] `images/og-image.png` → create a 1200×630 social card image (currently points to logo as a fallback).
- [ ] `js/main.js` → set `FORM_ENDPOINT` to your Formspree / Web3Forms / Getform URL so the contact form posts directly. Without it, the form falls back to opening the user's mail client.
- [ ] Resume in `images/Rahul Kumar Resume.pdf` — update whenever you revise your CV.
- [ ] `data/projects.json` — add/edit projects here; they appear automatically in the portfolio grid and detail pages.

---

## Adding a new project

1. Add an entry to `data/projects.json`:

```json
"newproject": {
  "title": "My New Project",
  "description": "What it is, what tech, what I shipped.",
  "video": "https://drive.google.com/file/d/XXXX/preview",
  "thumbnail": "images/work-5.png",
  "github": "https://github.com/...",
  "tech": ["Unity", "C#"],
  "platform": "PC",
  "year": "2026"
}
```

2. Drop the thumbnail image into `images/`.
3. Add a new `<article class="work">…</article>` block in `index.html` under `#portfolio` linking to `project.html?id=newproject`.

---

## Tech & decisions

- **No framework, no build step** — fastest possible cold load, trivial to host anywhere.
- **System font stack with Inter from Google Fonts** for a clean, professional feel.
- **CSS variables** for the colour scheme — change once in `:root` to retheme the entire site.
- **JSON-LD person schema** for richer Google search results.
- **localStorage feedback panel** so reviewers can leave testimonials without a backend (note: stored only in their own browser — see below for a real backend).
- **Reduced-motion friendly**, mobile-first responsive, semantic HTML, accessible nav.

---

## Optional upgrades

- **Real feedback backend**: replace localStorage in `js/feedback.js` with a call to Formspree, Firebase, or a Google Apps Script Web App.
- **Analytics**: drop in Plausible (privacy-friendly) or Google Analytics in `index.html` before `</head>`.
- **Domain**: buy one at Namecheap / Cloudflare, then point DNS to your chosen host.

---

© Rahul Kumar
