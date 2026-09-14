---
name: new-logo
description: Roll out a new/updated master logo across Payton's Prints brand assets — replaces the master logo file in logo/, regenerates the business card print-ready exports, and updates the live Squarespace site header logo, logging the change in website/website-work-log.md. Use when the user provides a new logo image and wants it applied everywhere the old one appears. Supports a dry run that reports planned changes without touching files or the live site.
---

# New Logo Rollout

Propagate a new/updated master logo to every place this business's brand appears: the logo asset itself, the business card exports, and the live website. Log what changed.

## Input

- Expects a path to the new logo image (PNG or SVG preferred; JPG accepted). If invoked with no path, or the given path doesn't exist, ask for it before doing anything else.
- **Dry run**: if the user says "dry run" / "test this" / passes `--dry-run`, do steps 1–3 read-only — report what *would* change, don't overwrite any files — and skip step 4 (live website) and step 6 (git) entirely.

## Steps

1. **Validate the input.** Open it with Pillow (`Image.open(path)`, then `.verify()` on a fresh handle since `verify()` invalidates the object for further use) and note dimensions and whether it has an alpha channel. Reject anything that doesn't load as an image rather than guessing.

2. **Replace the master logo asset.**
   - Convert the input to PNG if needed and overwrite `logo/Paytons Prints Logo - Front.png` (the canonical master logo). Git history covers the "backup" — no need to keep the old file around separately.
   - If the input's aspect ratio is markedly different from the current file, flag that to the user instead of silently stretching it.

3. **Regenerate business card exports.**
   - `logo/print-ready/Paytons Prints Business Card - Front.png` / `.jpg` are flattened exports whose content **is** the master logo (the card front = the logo). Recreate them from the new master at the same pixel dimensions as the current exports: flatten onto white, export PNG and JPG (quality ~95).
   - Check whether `logo/Paytons Prints Card - Back.png` also contains the logo before assuming the back needs updating — don't touch it if it's unrelated.
   - There is **no editable page-layout source** for the business card in this repo — only flattened exports and `logo/Paytons Prints Business Card.pdf`. If the card composes the logo with other elements (text, border, bleed) rather than being the bare logo image, don't reverse-engineer that composition in a script. Use the `design` skill to rebuild the card artboard with the new logo and export a fresh PDF, or ask for the original design source.

4. **Update the live website** (skip entirely on dry run).
   - The site (`sheep-sprout-cfpz.squarespace.com`) has no local codebase — do this live via `claude-in-chrome` browser automation, same as prior site edits (see `website/website-work-log.md` for how that's normally done).
   - In Squarespace admin: Design → Logo & Title (site header), upload the new logo, save.
   - Screenshot the result if possible for confirmation.

5. **Marketing 4x6 card — only if it actually uses the logo.** Check `Marketing/design-canvas/*.dc.html` for a reference to the logo image. As of this writing it doesn't (that card uses a wordmark + illustration collage, not the logo graphic) — skip this step unless that's changed. If it does reference the logo, update the canvas and re-export via the `design` skill.

6. **Record and commit** (skip on dry run; report the plan instead).
   - Append a dated entry to `website/website-work-log.md` under "Completed" describing the swap (what was replaced, what was touched, what's still pending like a manual card redesign).
   - `git add` the changed asset files + work log, commit, push to `origin/main`.

## Notes

- Use Pillow for raster work; `pypdf`/`reportlab` are available if PDF regeneration is needed.
- Never silently fabricate an unseen business-card layout — if the card is more than "just the logo," surface that limitation and route to the `design` skill rather than producing a low-fidelity recreation.
