import { readdir, readFile, writeFile, mkdir, rm, cp, access } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, '_site');
const ignored = new Set(['.git', '.DS_Store', '.idea', 'node_modules', 'ai', '__pycache__']);
const descriptions = {
 aquarium: 'A little ocean, a whole world. Cruise a cartoon reef through sun, moon, and underwater weather.',
 'dna-screensaver': 'A twisting double helix, rendered in glowing colour.',
 'evolution-screensaver': 'Watch a miniature ecosystem find its own way.',
 'lawnmower-screensaver': 'The quiet satisfaction of a perfectly cut lawn.',
 'mandelbrot-screensaver': 'A journey into the endlessly intricate fractal landscape.',
 'northern-lights': 'Slow curtains of light across a midnight sky.',
 'origami-drive': 'Take a drive through a world folded from paper.',
 'origami-fps': 'Explore a playful paper world from the first person.',
 'retro-80s-video-games-screensaver': 'An arcade time capsule of pixels, colour, and motion.',
 'space-news-billboards': 'A little window into the universe.',
 spirograph: 'Loops within loops. A familiar toy with endless possibilities.',
 'sputnik-ground-track': 'Follow an orbit around the blue planet.',
 'swiss-station-clock': 'A beautifully precise moment of stillness.',
 'vector-combat-screensaver': 'Neon vectors and an old-school arcade atmosphere.'
};
const names = { aquarium: 'Aquarium', 'origami-fps': 'Origami FPS', 'dna-screensaver': 'DNA', 'mandelbrot-screensaver': 'Mandelbrot', 'evolution-screensaver': 'Evolution', 'lawnmower-screensaver': 'Lawnmower', 'retro-80s-video-games-screensaver': 'Retro arcade', 'vector-combat-screensaver': 'Vector combat' };
const titleCase = s => s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
async function walk(dir) {
 let files = [];
 for (const entry of await readdir(dir, { withFileTypes: true })) {
  if (ignored.has(entry.name) || (entry.name.startsWith('.') && entry.name !== '.deck') || entry.isSymbolicLink()) continue;
  const path = join(dir, entry.name);
  if (entry.isDirectory()) files.push(...await walk(path));
  else if (entry.name.endsWith('.html')) files.push(path);
 }
 return files.sort();
}
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
const groups = [];
for (const category of ['html-screensaver', 'experiments']) {
 const dir = join(root, category);
 await cp(dir, join(out, category), { recursive: true, filter: async path => {
  const parts = relative(dir, path).split('/');
  if (parts.some(p => ignored.has(p) || (p.startsWith('.') && p !== '.deck'))) return false;
  const { lstat } = await import('node:fs/promises');
  return !(await lstat(path)).isSymbolicLink();
 }});
 const map = new Map();
 for (const file of await walk(dir)) {
  const path = relative(root, file).split('\\').join('/');
  const slug = path.split('/')[1];
  const html = await readFile(file, 'utf8');
  const rawTitle = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.trim() || titleCase(slug);
  const title = rawTitle.replace(/\s+/g, ' ');
  let playable = !/\{\{|\{%|(?:src|href)=["']\/(?:src|static)\//i.test(html);
  // Don't offer launch links for checked-in frontend shells with missing bundles.
  for (const match of html.matchAll(/(?:src|href)=["']([^"'#]+)["']/gi)) {
   const url = match[1];
   if (/^(?:https?:|data:|mailto:|javascript:|\/\/)/i.test(url)) continue;
   if (url.startsWith('/')) { playable = false; continue; }
   try { await access(resolve(dirname(file), decodeURIComponent(url.split(/[?#]/)[0]))); }
   catch { playable = false; }
  }
  const version = path.match(/-v(\d+)\.html$/)?.[1];
  const item = { path, title, label: version ? `v${version}` : path.split('/').at(-1).replace(/\.html$/, '').replace(/-/g, ' '), playable };
  if (!map.has(slug)) map.set(slug, { slug, category: category === 'html-screensaver' ? 'Screensavers' : 'Experiments', name: names[slug] || titleCase(slug), description: descriptions[slug] || 'A small experiment from the workshop.', files: [] });
  map.get(slug).files.push(item);
 }
 for (const group of map.values()) {
  group.files.sort((a,b) => b.path.localeCompare(a.path, undefined, {numeric:true}));
  group.primary = group.files.find(f => f.playable) || group.files[0];
  if (category === 'experiments') group.name = group.primary.title === 'frontend' ? titleCase(group.slug) : group.primary.title;
  groups.push(group);
 }
}
groups.sort((a,b) => (a.slug === 'aquarium' ? -1 : b.slug === 'aquarium' ? 1 : (a.category === b.category ? 0 : a.category === 'Screensavers' ? -1 : 1) || a.name.localeCompare(b.name)));
const template = await readFile(join(root, 'site/index.html'), 'utf8');
const json = JSON.stringify(groups).replace(/</g, '\\u003c');
await writeFile(join(out, 'index.html'), template.replace('/* ARTEFACT_DATA */[]', json));
await writeFile(join(out, '.nojekyll'), '');
await writeFile(join(out, 'catalogue.json'), JSON.stringify(groups, null, 2));
// Verify every generated launch/download target exists in the published tree.
for (const group of groups) for (const file of group.files) await access(join(out, file.path));
if (!groups.length || !template.includes('/* ARTEFACT_DATA */[]')) throw new Error('Gallery generation failed');
console.log(`Built ${groups.length} projects, ${groups.reduce((n,g)=>n+g.files.length,0)} HTML artefacts → _site`);
