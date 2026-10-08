# fun-artefacts

Self-contained single-file HTML toys — open any `.html` file directly in a browser.

**[Explore the gallery →](https://johnoscott.github.io/fun/)**

## GitHub Pages

The gallery is published automatically on every push to `main` by
[Publish artefact gallery](.github/workflows/pages.yml). It can also be run manually
from the Actions tab. The repository's Pages publishing source is **GitHub Actions**.

The build discovers HTML artefacts in `html-screensaver/` and `experiments/`, groups
versions into project cards, and copies the artefacts and their supporting files.
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
| dna-screensaver | [dna-screensaver-v1.html](html-screensaver/dna-screensaver/dna-screensaver-v1.html), [dna-screensaver-v2.html](html-screensaver/dna-screensaver/dna-screensaver-v2.html) |
| evolution-screensaver | [evolution-screensaver-zoom-track.html](html-screensaver/evolution-screensaver/evolution-screensaver-zoom-track.html), [evolution-screensaver.html](html-screensaver/evolution-screensaver/evolution-screensaver.html) |
| lawnmower-screensaver | [lawnmower-screensaver.html](html-screensaver/lawnmower-screensaver/lawnmower-screensaver.html) |
| mandelbrot-screensaver | [mandelbrot-screensaver.html](html-screensaver/mandelbrot-screensaver/mandelbrot-screensaver.html) |
| northern-lights | [northern-lights.html](html-screensaver/northern-lights/northern-lights.html) |
| origami-drive | [origami-drive.html](html-screensaver/origami-drive/origami-drive.html) |
| origami-fps | [origami-fps-v1.html](html-screensaver/origami-fps/origami-fps-v1.html), [origami-fps-v2.html](html-screensaver/origami-fps/origami-fps-v2.html), [origami-fps-v3.html](html-screensaver/origami-fps/origami-fps-v3.html), [origami-fps-v4.html](html-screensaver/origami-fps/origami-fps-v4.html), [origami-fps-v5.html](html-screensaver/origami-fps/origami-fps-v5.html), [origami-fps-v6.html](html-screensaver/origami-fps/origami-fps-v6.html) ([changelog](html-screensaver/origami-fps/CHANGELOG.md)) |
| retro-80s-video-games-screensaver | [retro-80s-video-games-screensaver.html](html-screensaver/retro-80s-video-games-screensaver/retro-80s-video-games-screensaver.html) |
| space-news-billboards | [space-news-billboards.html](html-screensaver/space-news-billboards/space-news-billboards.html) |
| spirograph | [spirograph-v1.html](html-screensaver/spirograph/spirograph-v1.html), [spirograph-v2.html](html-screensaver/spirograph/spirograph-v2.html) |
| sputnik-ground-track | [sputnik-ground-track.html](html-screensaver/sputnik-ground-track/sputnik-ground-track.html) |
| swiss-station-clock | [swiss-station-clock.html](html-screensaver/swiss-station-clock/swiss-station-clock.html) |
| vector-combat-screensaver | [vector-combat-screensaver.html](html-screensaver/vector-combat-screensaver/vector-combat-screensaver.html) |

## `experiments/`

Scratch projects from AI-tool sessions (calendars, egg timer, prime finder, todo list, starship bridge, flowchart, voronoi, force-directed graph, cyber rain, etc.). `.deck/ai/` checkpoint files are git-ignored.
