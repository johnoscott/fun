# CLAUDE.md

Guidance for Claude Code in this repository. Read `README.md` for the full layout.

## What this is

This is a public repo of self-contained single-file HTML artefacts in `html-screensaver/`, `design/`,
`write-ups/` and `experiments/`. Each one is published to a GitHub Pages gallery.

- **Pushing to `main` publishes.** The Pages workflow (`.github/workflows/pages.yml`) builds and
  deploys on every push. Confirm before pushing, and never commit client or internal work material.
- Each project folder holds its versions (`name-v1.html`, `name-v2.html`, …) plus a `CHANGELOG.md`.
  Add new projects to the README table for their category.

## Gallery build

- `npm run build` (`scripts/build-pages.mjs`, Node 22, no dependencies) generates `_site/` from
  `site/index.html` and the category folders.
- Versions of a project become an edition picker on one card. Display names and descriptions live in
  maps at the top of the build script.
- Preview with `python3 -m http.server 8000 --directory _site`.

## Thumbnails

- Card screenshots live in `site/thumbs/<artefact path>.jpg`. They are captured **locally, never in
  CI**, and committed. CI only copies them.
- `npm install && npm run thumbnails [-- --only <path substring>] [--wait <s>] [--out <dir>]` runs
  `scripts/capture-thumbnails.mjs`. It uses puppeteer-core with the system Google Chrome
  (`CHROME_PATH` to override) in headless mode with the GPU enabled.
- Pages are laid out at 1280×720, captured 10s after load and saved as 800×450 JPEGs (quality 80).
  Per-artefact capture times go in `waits`, and exclusions in `skip`.
- Keep `--jobs 1`. Running WebGL pages in parallel produces black frames.
- Always look at the captured images before committing. A capture that ends with `!` threw page
  errors and may be blank.
- After adding or changing a screensaver or experiment, capture it with `--only` and commit the JPEG
  with it.
