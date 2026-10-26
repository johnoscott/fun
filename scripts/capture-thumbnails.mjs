// Captures gallery thumbnails of every playable screensaver and experiment, plus larger carousel
// images of featured projects. Run locally (not in CI) and commit the results in site/thumbs/ and site/heroes/:
//
//   npm install
//   npm run thumbnails                                   # builds first, then captures every artefact
//   npm run thumbnails -- --only spirograph --wait 25    # just matching paths, custom wait
//
// Uses the installed Google Chrome with the real GPU so WebGL artefacts render. Set
// CHROME_PATH to point elsewhere. Captures run one at a time by default (--jobs to change):
// heavy WebGL pages running side by side starve each other and capture black frames.
import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import puppeteer from 'puppeteer-core';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { values: args } = parseArgs({ options: { only: { type: 'string' }, wait: { type: 'string' }, out: { type: 'string' }, jobs: { type: 'string', default: '1' } } });
const out = resolve(args.out || join(root, 'site/thumbs'));
const heroOut = resolve(args.out ? join(args.out, 'heroes') : join(root, 'site/heroes'));
// Featured projects (from the last build) also get a 1600×900 carousel image of their main edition.
let heroes = new Set();
try { heroes = new Set(JSON.parse(await readFile(join(root, '_site/catalogue.json'), 'utf8')).filter(g => g.featured).map(g => g.primary.path)); }
catch { console.warn('No _site/catalogue.json, so no carousel images. Run npm run build first.'); }
const chrome = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
// Seconds to wait before capturing. Most artefacts look substantial by 10s; these need longer.
const waits = { 'blazing-peak/artifacts/calendar': 15, 'spirograph-v2': 30, 'warp-wave/cyber-rain.html': 20, 'one-minute-of-light-v2': 35, 'one-minute-of-light-v3': 20 };
// Artefacts with nothing worth showing; the gallery keeps its generated artwork for these.
const skip = ['experiments/antigravity-smoke1/empty.html'];
const DEFAULT_WAIT = 10;

// Same discovery and playability rules as build-pages.mjs: no server templates, no missing local assets.
const ignored = new Set(['.git', '.DS_Store', '.idea', 'node_modules', 'ai', '__pycache__']);
async function walk(dir) {
 const files = [];
 for (const entry of await readdir(dir, { withFileTypes: true })) {
  if (ignored.has(entry.name) || (entry.name.startsWith('.') && entry.name !== '.deck') || entry.isSymbolicLink()) continue;
  const path = join(dir, entry.name);
  if (entry.isDirectory()) files.push(...await walk(path));
  else if (entry.name.endsWith('.html')) files.push(path);
 }
 return files;
}
async function playable(file) {
 const html = await readFile(file, 'utf8');
 if (/\{\{|\{%|(?:src|href)=["']\/(?:src|static)\//i.test(html)) return false;
 for (const [, url] of html.matchAll(/(?:src|href)=["']([^"'#]+)["']/gi)) {
  if (/^(?:https?:|data:|mailto:|javascript:|\/\/)/i.test(url)) continue;
  if (url.startsWith('/')) return false;
  try { await stat(resolve(dirname(file), decodeURIComponent(url.split(/[?#]/)[0]))); } catch { return false; }
 }
 return true;
}
let targets = [];
for (const category of ['html-screensaver', 'experiments'])
 for (const file of await walk(join(root, category))) {
  const path = relative(root, file).split('\\').join('/');
  if (!skip.includes(path) && (!args.only || path.includes(args.only)) && await playable(file)) targets.push(path);
 }
targets.sort();

const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.wasm': 'application/wasm' };
const server = createServer(async (req, res) => {
 const file = resolve(root, '.' + decodeURIComponent(new URL(req.url, 'http://x').pathname));
 try {
  if (!file.startsWith(root + '/')) throw new Error('outside root');
  const body = await readFile(file);
  res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }).end(body);
 } catch { res.writeHead(404).end(); }
}).listen(0, '127.0.0.1');
await new Promise(r => server.once('listening', r));
const origin = `http://127.0.0.1:${server.address().port}/`;

const browser = await puppeteer.launch({ executablePath: chrome, headless: true, args: ['--enable-gpu', '--use-angle=metal', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows'] });
// Encodes a screenshot as a JPEG of the given size, using a blank page's canvas.
async function encode(png, width, height, quality) {
 const page = await browser.newPage();
 const url = await page.evaluate(async (src, w, h, q) => {
  const img = new Image(); img.src = src; await img.decode();
  const canvas = Object.assign(document.createElement('canvas'), { width: w, height: h }), ctx = canvas.getContext('2d');
  ctx.imageSmoothingQuality = 'high'; ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', q);
 }, 'data:image/png;base64,' + Buffer.from(png).toString('base64'), width, height, quality);
 await page.close();
 return Buffer.from(url.split(',')[1], 'base64');
}
let failed = 0;
async function capture(path) {
 const page = await browser.newPage(), errors = [];
 page.on('pageerror', e => errors.push(e.message.slice(0, 120)));
 // 1280×720 layout, rendered at 0.625× so the JPEG is 800×450, or at 1.25× (1600×900) when a carousel image is needed too.
 const hero = heroes.has(path);
 await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: hero ? 1.25 : 0.625 });
 const seconds = Number(args.wait) || Object.entries(waits).find(([k]) => path.includes(k))?.[1] || DEFAULT_WAIT;
 try {
  await page.goto(origin + path.split('/').map(encodeURIComponent).join('/'), { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, seconds * 1000));
  const dest = join(out, path.replace(/\.html$/, '.jpg'));
  await mkdir(dirname(dest), { recursive: true });
  if (hero) {
   // One capture for both images: a second, scaled screenshot resizes the page and can wipe canvases.
   const heroDest = join(heroOut, path.replace(/\.html$/, '.jpg'));
   await mkdir(dirname(heroDest), { recursive: true });
   const png = await page.screenshot({ type: 'png' });
   await writeFile(heroDest, await encode(png, 1600, 900, 0.78));
   await writeFile(dest, await encode(png, 800, 450, 0.8));
  } else await page.screenshot({ path: dest, type: 'jpeg', quality: 80 });
  console.log(`${errors.length ? '!' : '✓'} ${path} @${seconds}s${hero ? ' +hero' : ''}${errors.length ? '  ' + errors.join(' | ') : ''}`);
 } catch (e) { failed++; console.log(`✗ ${path}  ${e.message}`); }
 await page.close();
}
const queue = [...targets];
await Promise.all(Array.from({ length: Number(args.jobs) }, async () => { while (queue.length) await capture(queue.shift()); }));
await browser.close();
server.closeAllConnections(); // Chrome can leave keep-alive sockets open, which would stop node exiting.
server.close();
console.log(`Captured ${targets.length - failed}/${targets.length} → ${relative(root, out) || '.'}`);
if (failed) process.exitCode = 1;
