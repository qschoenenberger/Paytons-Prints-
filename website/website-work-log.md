# Payton's Prints — Website Work Log

Site: `https://sheep-sprout-cfpz.squarespace.com` (Squarespace, still **Private/unpublished** as of 2026-09-14 — needs "Publish Your Site" once payment + fulfillment are connected)
Custom domain (once live): `www.paytonsprints.com`
Admin: `https://sheep-sprout-cfpz.squarespace.com/config/`

All edits below were made live in the Squarespace editor via browser automation — there is no separate local website codebase to sync (Squarespace hosts and stores the site itself). This file is the running record of what's been done and what's still open, so it's easy to pick back up.

## Completed

### Shop / Products
- **Wisconsin Print** ($25 → now **$20.00**)
  - Fixed PDP image cropping: Gallery Aspect Ratio set to 3:4 (Vertical) so the full illustration shows, no cropped edges.
  - Enabled click-to-zoom: Click Action set to Lightbox, matching the Gallery page's interaction (click image → full-screen lightbox with close/prev/next).
  - Added an "8x10" size note. (Squarespace's real Size **variant** feature requires ≥2 values to save — a single value throws "Options must generate more than one variant" — so per Quinn's choice, "Size: 8x10" was added as plain text in the product description instead of a selectable dropdown. If more sizes get added later, this can be upgraded to a real Size variant.)
- **Bagel Deli Shop Print** — new product, $15.00, created from the Bagel Deli Shop storefront illustration. No size/variant options set. Verified the image displays fully uncropped on both the shop grid and PDP (inherits the shared PDP template's 3:4 aspect ratio + lightbox automatically).
- Shop grid page confirmed already configured correctly (uncropped thumbnails) from an earlier session.

### Assets referenced
- QR code linking to `/shop` — generated and delivered separately (see `qr-code/` folder in this project). Will 404 until the site is published.

## Open / carried over (not yet done)

- **Contact page**: "Custom Home Drawing" text needs to be hyperlinked to the `/commissions` inquiry form.
- **Home page**: "Request a Custom Drawing" section image has awkward wallpaper-margin cropping — needs Quinn to upload a pre-cropped replacement (`bagel_deli_paper_only.jpg`, already sent to Quinn in an earlier session) since the current source photo can't be cropped cleanly from within the editor.
- **About page**: bio text still needs writing/finalizing.
- **Publishing**: site is still Private — needs a payment processor and a fulfillment method connected before "Publish Your Site," per Squarespace's own checklist.
- **Final pass**: one full site review once everything above is done.

## Notes for next session
- To edit a product's price/details/variants reliably, go through **Products & Services → Products** in the left sidebar (not the Pages tree) — clicking a product there opens the real product-editing modal directly. Clicking a product via Pages → Shop only navigates the live preview and does not open the editor.
- Squarespace enforces "Options must generate more than one variant" — a variant option (Size, Color, etc.) needs at least 2 values before it can be saved.

## 2026-09-14 — Replaced Squarespace with a React site

- Built a new static site (Vite + React + TypeScript) in `site/`, deployed by
  `.github/workflows/deploy.yml` to GitHub Pages on every push to `main` touching `site/**`.
  Pages: Home, Shop, per-product detail, Gallery, About, Contact.
- Shop: Wisconsin Print ($20) and Bagel Deli Shop Print ($15), matching current pricing.
  Checkout is per-product Stripe Payment Links (no cart, no backend).
- Contact/commissions form posts to Formspree (no backend).
- Gallery reuses the illustration images already in `Marketing/design-canvas/images/`.
- See `docs/superpowers/specs/2026-09-14-react-site-design.md` for the full design.
- Deployed URL (once GitHub Pages is switched on, see below): `https://qschoenenberger.github.io/Paytons-Prints-/`

### Still open from this build
- **Stripe Payment Links**: `site/src/data/products.ts` has TODO placeholder URLs — create
  real Payment Links in Stripe for both products and drop the URLs in.
- **Formspree endpoint**: `site/src/data/contact.ts` has a TODO placeholder — create a
  Formspree form and drop the real endpoint in.
- **Bagel Deli Shop Print photo**: no product photo exists in this repo; the shop currently
  shows a "photo coming soon" placeholder tile for it. Drop the real photo at
  `site/src/assets/shop/bagel-deli-shop-print.jpg` and update `products.ts`.
- **GitHub Pages source setting**: repo Settings → Pages → Source must be set to "GitHub
  Actions" (needs repo admin access) before the workflow's deploy step will succeed.
- **Custom domain**: `www.paytonsprints.com` DNS still needs to be pointed at GitHub Pages,
  and `site/vite.config.ts`'s `base` + `public/404.html`'s `pathSegmentsToKeep` will need
  updating once it no longer serves from the `/Paytons-Prints-/` subpath.
- **About bio**: `site/src/pages/About.tsx` has draft copy — still needs Payton's
  review/finalization (carried over from the previous entry above).
- **Squarespace decommission**: the Squarespace subscription itself hasn't been cancelled yet.
