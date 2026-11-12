// Bundles each Remotion sample in remotion/ into a self-contained HTML page that plays it live in the
// browser with @remotion/player. Run locally after changing a sample and commit the pages:
//
//   npm install
//   npm run animations
//
// The samples' own node_modules are ignored: every page bundles the React, Remotion and Player
// versions pinned in the root package.json, so all three share one copy of each.
import { build } from 'esbuild';
import { writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const modules = join(root, 'node_modules');
// Composition settings, matching each sample's src/Root.tsx. Frame counts and rates are expressions so
// a sample can export its own constants.
const samples = [
 { slug: 'agent-pop', title: 'Agent Pop', imports: 'import { AgentPop as Component } from "./src/AgentPop";', durationInFrames: '300', fps: '30' },
 { slug: 'bar-chart', title: 'Animated Bar Chart', imports: 'import { BarChart as Component } from "./src/BarChart";', durationInFrames: '300', fps: '30' },
 { slug: 'countdown', title: 'Countdown', imports: 'import { Countdown as Component, TOTAL_FRAMES, FPS } from "./src/Countdown";', durationInFrames: 'TOTAL_FRAMES', fps: 'FPS' }
];
for (const s of samples) {
 const dir = join(root, 'remotion', s.slug);
 const { outputFiles: [js] } = await build({
  stdin: {
   contents: `${s.imports}
import { createRoot } from "react-dom/client";
import { Player } from "@remotion/player";
createRoot(document.getElementById("root")).render(
 <Player component={Component} durationInFrames={${s.durationInFrames}} fps={${s.fps}} compositionWidth={1280} compositionHeight={720}
  controls loop autoPlay clickToPlay style={{ width: "100%", height: "100%" }} />
);`,
   resolveDir: dir, loader: 'tsx', sourcefile: 'player.tsx'
  },
  bundle: true, minify: true, write: false, format: 'iife', target: 'es2020', jsx: 'automatic', legalComments: 'none',
  define: { 'process.env.NODE_ENV': '"production"' },
  alias: Object.fromEntries(['react', 'react-dom', 'remotion', '@remotion/player'].map(m => [m, join(modules, m)]))
 });
 const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${s.title}</title>
<style>html,body{margin:0;height:100%;background:#000}body{display:grid;place-items:center}#root{width:min(100vw,calc(100vh * 16 / 9));aspect-ratio:16/9}</style>
</head>
<body><div id="root"></div>
<script>${js.text.replace(/<\/(script)/gi, '<\\/$1')}</script>
</body>
</html>
`;
 const out = join(dir, `${s.slug}.html`);
 await writeFile(out, html);
 console.log(`${s.slug}.html  ${(html.length / 1024).toFixed(0)} KB`);
}
