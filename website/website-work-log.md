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
