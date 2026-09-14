# Payton's Prints — React Site Design

Date: 2026-09-14
Status: Approved

## Purpose

Replace the Squarespace-hosted storefront (`sheep-sprout-cfpz.squarespace.com`) with a
self-built React site, fully static (no backend server, no Railway/Node host), deployed
automatically to GitHub Pages via a GitHub Actions workflow on every push to `main`.

Squarespace is being retired once this site is live and the domain (`www.paytonsprints.com`)
is repointed — see "Out of scope" below for what that cutover still needs.

## Decisions made during brainstorming

- **Full replacement** of Squarespace, not a marketing-only companion site.
- **Checkout**: Stripe Payment Links, one per product. No cart, no backend — a "Buy" button
  on each product links straight to a Stripe-hosted checkout page.
- **Contact/commissions form**: posts directly to Formspree (free tier) from the browser.
- **Hosting**: GitHub Pages, built and deployed by a GitHub Actions workflow
  (`actions/upload-pages-artifact` + `actions/deploy-pages`) triggered on push to `main`.
- **Stack**: Vite + React + TypeScript + React Router. Chosen over Next.js static export
  (which disables most of what Next.js is for) and over a bundler-less "script tag" React
  setup (loses TypeScript, fast refresh, code-splitting; less-traveled path for
  troubleshooting).
- **Pages**: Home, Shop (grid), per-product detail, Gallery, About, Contact — mirrors the
  structure already implied by `website/website-work-log.md`.

## Project structure

New top-level `site/` directory. Kept separate from the asset folders (`Marketing/`,
`logo/`, `qr-code/`) and from `website/website-work-log.md`, which remains as the historical
record of the Squarespace-era work (its own header will get a note pointing at this spec once
the cutover happens).

```
site/
  src/
    pages/         Home.tsx, Shop.tsx, ProductDetail.tsx, Gallery.tsx, About.tsx, Contact.tsx
    components/    Nav.tsx, Footer.tsx, ProductCard.tsx, GalleryGrid.tsx
    data/          products.ts, contact.ts
    assets/        images copied from Marketing/design-canvas/images/ + logo/
    App.tsx, main.tsx, router.tsx
  public/
    favicon
  index.html
  vite.config.ts
  tsconfig.json
  package.json
.github/workflows/deploy.yml
```

## Data flow

Fully static — no runtime data fetching or API calls other than the two external,
user-owned services below.

- `src/data/products.ts` is the single source of truth for the shop: id, name, price,
  image path, description, Stripe Payment Link URL. Shop and ProductDetail pages map over
  this array; adding a product later means adding one entry.
- `src/data/contact.ts` holds the Formspree endpoint ID used by the Contact page form.
- Gallery reuses existing illustration images already in this repo
  (`Marketing/design-canvas/images/{wisconsin,house,corsair,armyplane,kingair,t6trainer,helmet}.jpg`)
  rather than inventing placeholder art.

## External integrations (not buildable by Claude)

Two integration points need IDs from accounts only the user (Quinn) can create/access:

1. **Stripe Payment Links** — one per product, created in Quinn's Stripe dashboard.
2. **Formspree form ID** — created in Quinn's Formspree account.

Both will be wired into the code as clearly marked `TODO` placeholders
(`src/data/products.ts`, `src/data/contact.ts`) rather than fake/fabricated IDs. The site
will build and deploy successfully with placeholders in place; Buy buttons and the contact
form simply won't function until real IDs are dropped in. This will be called out explicitly
when the implementation is reported done, not left as a silent gap.

## CI/CD

`.github/workflows/deploy.yml`:
- Trigger: push to `main` (path-filtered to `site/**` and the workflow file itself, so
  changes to `Marketing/`, `logo/`, etc. don't trigger a rebuild).
- Steps: checkout → setup Node → `npm ci` (in `site/`) → `npm run build` → upload
  `site/dist` as a Pages artifact → deploy via `actions/deploy-pages`.
- Concurrency group to avoid overlapping deploys.

**Manual one-time step required from Quinn** (needs repo admin access, not available to
Claude via CLI in this environment): in GitHub repo Settings → Pages, set Source to
"GitHub Actions". Until this is set, the workflow will run but the deploy step will fail.

## Error handling & testing

No backend means minimal runtime failure surface. The main risks are build-time (bad data in
`products.ts`, broken image paths, broken links), which TypeScript and a local build pass
catch before anything ships:

- `npm run build` must succeed with no TypeScript errors.
- `npm run preview` + manual click-through of every page in Chrome (via claude-in-chrome)
  before reporting the implementation done — checking nav, product images render, Buy
  buttons point at the right (placeholder) links, contact form renders.
- No automated test framework — speculative for a static content/shop site with no complex
  logic, and against this repo's "no tooling unless needed" convention (see root `CLAUDE.md`).

## Out of scope for this pass

- Custom domain DNS setup / actually pointing `www.paytonsprints.com` at GitHub Pages.
- Publishing Stripe Payment Links or Formspree form (Quinn's accounts, outside this repo).
- Finalized About-page bio copy — work log already flags this as unwritten; placeholder text
  will be used, matching the existing open item in `website/website-work-log.md`.
- Actually decommissioning the Squarespace subscription.

## Follow-up documentation

Once implemented, `CLAUDE.md`'s "What this repository is" section needs an update — it
currently states "there is no build, lint, or test tooling, and none should be added
speculatively" and that "There is no local website codebase." Both become inaccurate once
`site/` exists. This spec's implementation plan should include that CLAUDE.md update as a
step.
