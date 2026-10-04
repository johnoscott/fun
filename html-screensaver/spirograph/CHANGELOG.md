# Changelog

All notable changes to **Spirograph Screensaver** are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 2026-10-05

### Changed

- Moved into `html-screensaver/spirograph/` as part of the repo reorganisation; duplicate "copy" files renamed to `-v1`/`-v2` by date.

## [2.0] - 2026-08-06

### Fixed

- `spirograph-v2.html`: pen positions are reset after a clear/resize, so curves no longer draw a straight chord from their old location.
- Each curve is now stroked as one polyline per frame, removing the beaded look caused by doubled round end-caps under additive blending.

## [1.0] - 2026-08-06

### Added

- `spirograph-v1.html`: hypotrochoid/epitrochoid spirograph with a control panel for trail length and pen mode, auto-clearing once every curve completes a pass.
