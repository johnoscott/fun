# Changelog

All notable changes to **cmatrix** are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0] - 2026-10-21

### Added

- `cmatrix.html`: canvas port of cmatrix 2.0's new-style scrolling loop (streams on every second column, random lengths and gaps, white heads, `update × 10 ms` frame delay), with the original keys for delay, pause, async scroll, changing characters, bold, kana, rainbow, lambda and colours, plus a fullscreen screensaver mode that exits on the first key press like `cmatrix -s`.
