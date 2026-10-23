// Captures gallery thumbnails of every playable screensaver and experiment.
// Run locally (not in CI) and commit the results in site/thumbs/:
//
//   npm install
//   npm run thumbnails                                   # every artefact
//   npm run thumbnails -- --only spirograph --wait 25    # just matching paths, custom wait
//
// Uses the installed Google Chrome with the real GPU so WebGL artefacts render. Set
// CHROME_PATH to point elsewhere. Captures run one at a time by default (--jobs to change):
// heavy WebGL pages running side by side starve each other and capture black frames.
import { createServer } from 'node:http';
import { readFile, mkdir, readdir, stat } from 'node:fs/promises';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import puppeteer from 'puppeteer-core';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const { values: args } = parseArgs({ options: { only: { type: 'string' }, wait: { type: 'string' }, out: { type: 'string' }, jobs: { type: 'string', default: '1' } } });
const out = resolve(args.out || join(root, 'site/thumbs'));
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
let failed = 0;
async function capture(path) {
 const page = await browser.newPage(), errors = [];
 page.on('pageerror', e => errors.push(e.message.slice(0, 120)));
 // 1280×720 layout, rendered at 0.625× so the JPEG is 800×450.
 await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 0.625 });
 const seconds = Number(args.wait) || Object.entries(waits).find(([k]) => path.includes(k))?.[1] || DEFAULT_WAIT;
 try {
  await page.goto(origin + path.split('/').map(encodeURIComponent).join('/'), { waitUntil: 'load', timeout: 30000 });
  await new Promise(r => setTimeout(r, seconds * 1000));
  const dest = join(out, path.replace(/\.html$/, '.jpg'));
  await mkdir(dirname(dest), { recursive: true });
  await page.screenshot({ path: dest, type: 'jpeg', quality: 80 });
  console.log(`${errors.length ? '!' : '✓'} ${path} @${seconds}s${errors.length ? '  ' + errors.join(' | ') : ''}`);
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
