# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is **not a software project** — there is no build, lint, or test tooling, and none should be added speculatively. It's an asset and record-keeping repo for **Payton's Prints**, a custom pen-and-ink illustration / print shop business. It holds marketing collateral, logo/brand assets, QR codes, and a running log of work done on the business's Squarespace storefront.

## Repository structure

- `Marketing/` — the 4x6 two-sided marketing card.
  - `design-canvas/` — editable source, built as a Claude Design canvas: `Main.dc.html` / `Back.dc.html` (standard 6x4in landscape card), `MainVertical.dc.html` / `BackVertical.dc.html` (5.5x8.5in half-sheet portrait version), `canvas.json` (layout manifest), and `images/` (source photos/illustrations and QR code used in the collage). The live editable artifact is linked in `Marketing/README.md`.
  - `print-ready-pdfs/` — final PDFs at exact print scale, generated from the design canvas. Regenerate these from the canvas artboards rather than editing a PDF directly.
- `logo/` — brand logo and business card assets (source PNGs/PDF plus a `print-ready/` subfolder with flattened JPG/PNG exports for the printer).
- `qr-code/` — QR codes linking to the shop, in multiple formats (PNG/SVG/PDF, plus transparent variants).
- `website/website-work-log.md` — the running record of edits made to the live Squarespace site (`sheep-sprout-cfpz.squarespace.com`, future custom domain `www.paytonsprints.com`). **There is no local website codebase** — Squarespace hosts and stores the site itself; all site changes are made live in the Squarespace editor (via browser automation) and then logged here. Read this file before doing any website work to pick up open items, and append to it (Completed / Open / Notes sections) after making changes so the record stays current.

## Working conventions

- Print-ready PDFs must stay in sync with their design-canvas source; if you edit an artboard, regenerate the corresponding PDF(s) in `print-ready-pdfs/`.
- When editing the Squarespace site, go through **Products & Services → Products** in the left sidebar to edit product details/variants/pricing — navigating via the Pages → Shop tree only opens the live preview, not the editor.
- Squarespace variant options (Size, Color, etc.) require at least 2 values to save ("Options must generate more than one variant" error otherwise); a single option value should be added as plain description text instead.

## Local environment gotchas (Windows / Git Bash)

This machine runs Windows with Git Bash (mingw64) as the shell. A few things that caused real stumbles and are easy to repeat:

- **`convert` on PATH is not ImageMagick.** It resolves to `C:\windows\system32\convert.exe`, the built-in FAT→NTFS disk conversion tool. Don't assume ImageMagick or other CLI image tools exist — check first, and prefer Python + Pillow (installed on this machine) for image work instead.
- **Native Windows `.exe` tools (e.g. `python.exe`) don't understand Git Bash's `/c/Users/...` POSIX-style paths** — passing one causes a silent-looking `FileNotFoundError` even though `ls`/`cd` on that same path work fine in bash. Convert to a Windows-style backslash path (`C:\Users\...`) before handing a path to a native exe.
- **Freshly `winget install`-ed tools (gh CLI, Python, etc.) don't appear on PATH in already-running shells/sessions**, including the current one — a new terminal or session is needed to pick up the PATH update. Until then, invoke the tool by its full install path.
- **`gh` CLI auth is separate from git's SSH key auth.** This repo's git push/pull already works over SSH without any `gh` login — installing `gh` doesn't authenticate it; `gh auth login` (interactive) is still needed before `gh pr`/`gh issue`/etc. will work.
- **Repo-level skills under `.claude/skills/` aren't picked up by the `Skill` tool until `/reload-skills` runs.** Creating a skill file and invoking it in the same turn fails with "Unknown skill" — expect to ask for a reload, or fall back to manually walking through the skill's steps to verify its logic in the meantime.
