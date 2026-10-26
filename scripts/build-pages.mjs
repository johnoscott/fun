import { readdir, readFile, writeFile, mkdir, rm, cp, access } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, '_site');
const ignored = new Set(['.git', '.DS_Store', '.idea', 'node_modules', 'ai', '__pycache__']);
const categories = { 'html-screensaver': 'Screensavers', design: 'Design', 'write-ups': 'Write-ups', experiments: 'Experiments' };
const descriptions = {
 'khamsin-attract-mode': 'A 198X desert-assault arcade cabinet left running in attract mode, with its own day, weather and high scores.',
 'phosphor-pasture': 'A green-phosphor countryside that passes the hours on an old monitor.',
 'one-minute-of-light': 'A real-time film in chapters: GPU particles, raymarched matter and fluid flow, scored live by a WebAudio synth.',
 'fuji-screensaver': 'Twenty-four hours of weather and light over Mt. Fuji. Made with Grok.',
 'lemonade-stand-screensaver': 'A sunny sixty-second loop at a neighbourhood lemonade stand. Made with Grok.',
 'accounts-redesign': 'Three takes on an accounts and API keys screen, from the full design to the simplest one that works.',
 'chat-surface-streamline': 'How an overnight autonomous loop rebuilt a chat surface one measured rung at a time.',
 'claude-model-sheet': 'The Claude lineup on one page: model IDs, context, prices and request parameters that changed.',
 'is-brim-the-same-as-s-4hana': 'SAP BRIM and S/4HANA are neither the same nor nested. A diagram of where the tables sit.',
 'paper-savanna-pov': 'Fly low over the folded-paper savanna in first person, through a day of sun, moon and storms in sixty seconds.',
 'paper-savanna-rainbow': 'A folded-paper savanna day: dawn mist, a monsoon storm, a rainbow, and moonrise in sixty looping seconds.',
 'paper-savanna': 'An origami flyover of the African savanna. Sun, moon and weather over a day in sixty seconds.',
 cmatrix: 'The terminal classic of falling green code, ported from its C source.',
 aquarium: 'Schools of fish, grazing turtles, glowing caves, and a sleeping shipwreck. An ocean day in sixty seconds.',
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
 'vector-combat-screensaver': 'Neon vectors and an old-school arcade atmosphere.',
 'warp-wave': 'Digital rain falling down the screen, in a choice of styles.'
};
// Projects with a screenshot are featured: tagged in the grid and eligible for the carousel. These
// screenshots don't fill the frame (a faint drawing, or a widget on a plain background), so they aren't.
const notFeatured = new Set(['spirograph', 'blazing-peak', 'dark-matrix', 'hollow-anchor', 'solar-bridge', 'ultra-haven', 'violet-stack']);
const CAROUSEL_SIZE = 8;
// When each artefact first appeared, from Git history. The Pages workflow checks out the full history
// for this. Files not committed yet count as added now.
const added = new Map();
try {
 const log = execFileSync('git', ['log', '--no-renames', '--diff-filter=A', '--name-only', '--format=@%cI', '--', ...Object.keys(categories)], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 28 });
 let date;
 // Newest commits come first, so the last date seen for a path is when it was first added.
 for (const line of log.split('\n')) if (line.startsWith('@')) date = line.slice(1); else if (line) added.set(line, date);
} catch (e) { console.warn(`No Git history, so the carousel won't be ordered by date: ${e.message}`); }
const now = new Date().toISOString();
const names = { 'chat-surface-streamline': 'Chat Surface Streamline', 'one-minute-of-light': 'One Minute of Light', 'accounts-redesign': 'Accounts Redesign', 'fuji-screensaver': 'Mt. Fuji 24 Hours', 'lemonade-stand-screensaver': 'Lemonade Stand', aquarium: 'Aquarium', cmatrix: 'cmatrix', 'paper-savanna': 'Paper Savanna', 'paper-savanna-rainbow': 'Paper Savanna Rainbow', 'paper-savanna-pov': 'Paper Savanna POV', 'origami-fps': 'Origami FPS', 'dna-screensaver': 'DNA', 'mandelbrot-screensaver': 'Mandelbrot', 'evolution-screensaver': 'Evolution', 'lawnmower-screensaver': 'Lawnmower', 'retro-80s-video-games-screensaver': 'Retro arcade', 'vector-combat-screensaver': 'Vector combat' };
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
for (const category of Object.keys(categories)) {
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
  const base = path.split('/').at(-1).replace(/\.html$/, '');
  const [, version, suffix] = base.match(/-v(\d+)(?:-(.+))?$/) || [];
  // Label an edition by what its filename adds to the project slug: "v2 · titles and credits", "simpler", "zoom track".
  const extra = base.startsWith(slug) ? base.slice(slug.length).replace(/^-/, '') : base;
  const label = version ? `v${version}${suffix ? ' · ' + suffix.replace(/-/g, ' ') : ''}` : extra.replace(/-/g, ' ') || 'original';
  const item = { path, title, label, version: version ? Number(version) : null, playable, added: added.get(path) || now };
  // Screenshot from scripts/capture-thumbnails.mjs, if one has been captured and committed.
  const thumb = 'thumbs/' + path.replace(/\.html$/, '.jpg');
  if (await access(join(root, 'site', thumb)).then(() => true, () => false)) item.thumb = thumb;
  const hero = 'heroes/' + path.replace(/\.html$/, '.jpg');
  if (await access(join(root, 'site', hero)).then(() => true, () => false)) item.hero = hero;
  if (!map.has(slug)) map.set(slug, { slug, category: categories[category], name: names[slug] || titleCase(slug), description: descriptions[slug] || 'A small experiment from the workshop.', files: [] });
  map.get(slug).files.push(item);
 }
 for (const group of map.values()) {
  // Newest numbered version first, then named editions in their original order.
  group.files.sort((a,b) => (b.version ?? -1) - (a.version ?? -1) || (a.version === null && b.label === 'original') - (b.version === null && a.label === 'original') || a.path.localeCompare(b.path, undefined, {numeric:true}));
  group.primary = group.files.find(f => f.playable) || group.files[0];
  // A project is as new as its newest edition.
  group.added = group.files.reduce((d, f) => f.added > d ? f.added : d, '');
  group.featured = Boolean(group.primary.playable && group.primary.thumb) && !notFeatured.has(group.slug);
  if (category === 'experiments') group.name = group.primary.title === 'frontend' ? titleCase(group.slug) : group.primary.title;
  else if (!names[group.slug] && group.files.length === 1 && category !== 'html-screensaver') group.name = group.primary.title;
  groups.push(group);
 }
}
const order = Object.values(categories);
groups.sort((a,b) => (a.slug === 'aquarium' ? -1 : b.slug === 'aquarium' ? 1 : order.indexOf(a.category) - order.indexOf(b.category) || a.name.localeCompare(b.name)));
// The carousel shows the most recently added featured projects.
const carousel = groups.filter(g => g.featured).sort((a,b) => b.added.localeCompare(a.added)).slice(0, CAROUSEL_SIZE).map(g => g.slug);
const template = await readFile(join(root, 'site/index.html'), 'utf8');
const json = JSON.stringify(groups).replace(/</g, '\\u003c');
await writeFile(join(out, 'index.html'), template.replace('/* ARTEFACT_DATA */[]', json).replace('/* CATEGORY_DATA */[]', JSON.stringify(order)).replace('/* CAROUSEL_DATA */[]', JSON.stringify(carousel)));
for (const dir of ['thumbs', 'heroes']) await cp(join(root, 'site', dir), join(out, dir), { recursive: true }).catch(e => { if (e.code !== 'ENOENT') throw e; });
await writeFile(join(out, '.nojekyll'), '');
await writeFile(join(out, 'catalogue.json'), JSON.stringify(groups, null, 2));
// Verify every generated launch/download target exists in the published tree.
for (const group of groups) for (const file of group.files) { await access(join(out, file.path)); for (const img of [file.thumb, file.hero]) if (img) await access(join(out, img)); }
if (!groups.length || !carousel.length || !['ARTEFACT', 'CATEGORY', 'CAROUSEL'].every(k => template.includes(`/* ${k}_DATA */[]`))) throw new Error('Gallery generation failed');
console.log(`Built ${groups.length} projects, ${groups.reduce((n,g)=>n+g.files.length,0)} HTML artefacts → _site`);
