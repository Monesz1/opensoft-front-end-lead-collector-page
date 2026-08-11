# OpenSoft Lead Collector

A single-page, multilingual landing page for OpenSoft. Plain HTML, CSS and vanilla ES6 — no
framework, no build step, no cookies, no tracking, and no third-party network requests. Published
as a static site on GitHub Pages.

## Run locally

```bash
python3 -m http.server 8765
```

Then open <http://127.0.0.1:8765/>.

> Serve it over HTTP — opening `index.html` directly from the filesystem (`file://`) blocks
> `fetch()`, so the translation files never load and the page renders with empty strings.

## What's here

```
index.html                     the landing page
about.html / contact.html /    the four footer "Information" pages, generated from content/
gdpr.html / privacy.html
assets/                        style.css, i18n.js (shared language layer), main.js, logos, icons
i18n/*.json                    one flat dictionary per language, same keys in each
content/<lang>/*.md            Markdown source for the four sub-pages
pages/<lang>/*.html            generated per-language sub-page bodies
tools/build_pages.py           regenerates the four HTML pages from content/
```

## Editing

- **Sub-page copy:** edit `content/<lang>/*.md`, then regenerate:
  ```bash
  python3 tools/build_pages.py
  ```
  Do not hand-edit `about.html` / `contact.html` / `gdpr.html` / `privacy.html` — they are generated.
- **UI strings:** `i18n/<lang>.json`. Keep the key set identical across all languages.
- **Products:** add `{ id, name }` to `PRODUCTS` in `assets/main.js`, a matching `<article
  class="product-card">` in `index.html`, a `prod_<id>_desc` key in every `i18n/*.json`, and an
  `assets/icons/<id>.svg`.

## Accessibility & privacy

Skip link, one `<h1>`, labelled inputs, a `role="radiogroup"` product picker, `aria-live` regions,
visible focus rings, ≥44 px targets, and `prefers-reduced-motion` honoured. No cookies, no analytics,
no external assets. The only thing stored in the browser is `localStorage.lang` (a two-letter code).

## Deploy

Push to `main`; GitHub Pages publishes the static site.
