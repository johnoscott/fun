# fun-artefacts

Self-contained single-file HTML toys — open any `.html` file directly in a browser.

**[Explore the gallery →](https://johnoscott.github.io/fun/)**

## GitHub Pages

The gallery is published automatically on every push to `main` by
[Publish artefact gallery](.github/workflows/pages.yml). It can also be run manually
from the Actions tab. The repository's Pages publishing source is **GitHub Actions**.

The build discovers HTML artefacts in `html-screensaver/`, `design/`, `write-ups/` and `experiments/`, groups
versions into project cards with an edition picker, and copies the artefacts and their supporting files.
New HTML files appear automatically. Experiments with server templates or missing
assets link to their source instead of offering a broken launch button.

To preview locally with Node.js 22 or later:

```sh
node scripts/build-pages.mjs
python3 -m http.server 8000 --directory _site
```

Open `http://localhost:8000`. Edit `site/index.html` to change the gallery design,
or `scripts/build-pages.mjs` to change project names and descriptions. Generated
`_site/` files are ignored by Git.


## `html-screensaver/`

| Project | Files |
|---|---|
| aquarium | [aquarium-v1.html](html-screensaver/aquarium/aquarium-v1.html), [aquarium-v2.html](html-screensaver/aquarium/aquarium-v2.html) ([changelog](html-screensaver/aquarium/CHANGELOG.md)) |
| cmatrix | [cmatrix.html](html-screensaver/cmatrix/cmatrix.html) ([changelog](html-screensaver/cmatrix/CHANGELOG.md)) |
| dna-screensaver | [dna-screensaver-v1.html](html-screensaver/dna-screensaver/dna-screensaver-v1.html), [dna-screensaver-v2.html](html-screensaver/dna-screensaver/dna-screensaver-v2.html) ([changelog](html-screensaver/dna-screensaver/CHANGELOG.md)) |
| evolution-screensaver | [evolution-screensaver-zoom-track.html](html-screensaver/evolution-screensaver/evolution-screensaver-zoom-track.html), [evolution-screensaver.html](html-screensaver/evolution-screensaver/evolution-screensaver.html) ([changelog](html-screensaver/evolution-screensaver/CHANGELOG.md)) |
| fuji-screensaver | [fuji-screensaver.html](html-screensaver/fuji-screensaver/fuji-screensaver.html) ([changelog](html-screensaver/fuji-screensaver/CHANGELOG.md)) |
| khamsin-attract-mode | [khamsin-attract-mode.html](html-screensaver/khamsin-attract-mode/khamsin-attract-mode.html) ([changelog](html-screensaver/khamsin-attract-mode/CHANGELOG.md)) |
| lawnmower-screensaver | [lawnmower-screensaver.html](html-screensaver/lawnmower-screensaver/lawnmower-screensaver.html) ([changelog](html-screensaver/lawnmower-screensaver/CHANGELOG.md)) |
| lemonade-stand-screensaver | [lemonade-stand-screensaver.html](html-screensaver/lemonade-stand-screensaver/lemonade-stand-screensaver.html) ([changelog](html-screensaver/lemonade-stand-screensaver/CHANGELOG.md)) |
| mandelbrot-screensaver | [mandelbrot-screensaver.html](html-screensaver/mandelbrot-screensaver/mandelbrot-screensaver.html) ([changelog](html-screensaver/mandelbrot-screensaver/CHANGELOG.md)) |
| northern-lights | [northern-lights.html](html-screensaver/northern-lights/northern-lights.html) ([changelog](html-screensaver/northern-lights/CHANGELOG.md)) |
| one-minute-of-light | [one-minute-of-light-v1-four-chapters.html](html-screensaver/one-minute-of-light/one-minute-of-light-v1-four-chapters.html), [one-minute-of-light-v2-titles-and-credits.html](html-screensaver/one-minute-of-light/one-minute-of-light-v2-titles-and-credits.html), [one-minute-of-light-v3-five-chapters.html](html-screensaver/one-minute-of-light/one-minute-of-light-v3-five-chapters.html), [thirty-seconds-of-light.html](html-screensaver/one-minute-of-light/thirty-seconds-of-light.html) ([changelog](html-screensaver/one-minute-of-light/CHANGELOG.md)) |
| origami-drive | [origami-drive.html](html-screensaver/origami-drive/origami-drive.html) ([changelog](html-screensaver/origami-drive/CHANGELOG.md)) |
| origami-fps | [origami-fps-v1.html](html-screensaver/origami-fps/origami-fps-v1.html), [origami-fps-v2.html](html-screensaver/origami-fps/origami-fps-v2.html), [origami-fps-v3.html](html-screensaver/origami-fps/origami-fps-v3.html), [origami-fps-v4.html](html-screensaver/origami-fps/origami-fps-v4.html), [origami-fps-v5.html](html-screensaver/origami-fps/origami-fps-v5.html), [origami-fps-v6.html](html-screensaver/origami-fps/origami-fps-v6.html) ([changelog](html-screensaver/origami-fps/CHANGELOG.md)) |
| paper-savanna | [paper-savanna.html](html-screensaver/paper-savanna/paper-savanna.html) ([changelog](html-screensaver/paper-savanna/CHANGELOG.md)) |
| paper-savanna-pov | [paper-savanna-pov.html](html-screensaver/paper-savanna-pov/paper-savanna-pov.html) ([changelog](html-screensaver/paper-savanna-pov/CHANGELOG.md)) |
| paper-savanna-rainbow | [paper-savanna-rainbow.html](html-screensaver/paper-savanna-rainbow/paper-savanna-rainbow.html) ([changelog](html-screensaver/paper-savanna-rainbow/CHANGELOG.md)) |
| phosphor-pasture | [phosphor-pasture.html](html-screensaver/phosphor-pasture/phosphor-pasture.html) ([changelog](html-screensaver/phosphor-pasture/CHANGELOG.md)) |
| retro-80s-video-games-screensaver | [retro-80s-video-games-screensaver.html](html-screensaver/retro-80s-video-games-screensaver/retro-80s-video-games-screensaver.html) ([changelog](html-screensaver/retro-80s-video-games-screensaver/CHANGELOG.md)) |
| space-news-billboards | [space-news-billboards.html](html-screensaver/space-news-billboards/space-news-billboards.html) ([changelog](html-screensaver/space-news-billboards/CHANGELOG.md)) |
| spirograph | [spirograph-v1.html](html-screensaver/spirograph/spirograph-v1.html), [spirograph-v2.html](html-screensaver/spirograph/spirograph-v2.html) ([changelog](html-screensaver/spirograph/CHANGELOG.md)) |
| sputnik-ground-track | [sputnik-ground-track.html](html-screensaver/sputnik-ground-track/sputnik-ground-track.html) ([changelog](html-screensaver/sputnik-ground-track/CHANGELOG.md)) |
| swiss-station-clock | [swiss-station-clock.html](html-screensaver/swiss-station-clock/swiss-station-clock.html) ([changelog](html-screensaver/swiss-station-clock/CHANGELOG.md)) |
| vector-combat-screensaver | [vector-combat-screensaver.html](html-screensaver/vector-combat-screensaver/vector-combat-screensaver.html) ([changelog](html-screensaver/vector-combat-screensaver/CHANGELOG.md)) |

## `design/`

UI mockups, prototypes and design systems.

| Project | Files |
|---|---|
| accounts-redesign | [accounts-redesign-full.html](design/accounts-redesign/accounts-redesign-full.html), [accounts-redesign-simpler.html](design/accounts-redesign/accounts-redesign-simpler.html), [accounts-redesign-simplest.html](design/accounts-redesign/accounts-redesign-simplest.html) ([changelog](design/accounts-redesign/CHANGELOG.md)) |

## `write-ups/`

Explainers, reports, bake-offs and diagrams.

| Project | Files |
|---|---|
| chat-surface-streamline | [chat-surface-streamline.html](write-ups/chat-surface-streamline/chat-surface-streamline.html) ([changelog](write-ups/chat-surface-streamline/CHANGELOG.md)) |
| claude-model-sheet | [claude-model-sheet.html](write-ups/claude-model-sheet/claude-model-sheet.html) ([changelog](write-ups/claude-model-sheet/CHANGELOG.md)) |
| is-brim-the-same-as-s-4hana | [is-brim-the-same-as-s-4hana.html](write-ups/is-brim-the-same-as-s-4hana/is-brim-the-same-as-s-4hana.html) ([changelog](write-ups/is-brim-the-same-as-s-4hana/CHANGELOG.md)) |

## `experiments/`

Scratch projects from AI-tool sessions (calendars, egg timer, prime finder, todo list, starship bridge, flowchart, voronoi, force-directed graph, cyber rain, etc.). `.deck/ai/` checkpoint files are git-ignored.
