/**
 * Static HTML for every route, written after `vite build` (client) and
 * `vite build --ssr` (server bundle of src/entry-server.tsx).
 *
 * Each route is rendered with the same <App /> the browser hydrates, its
 * <head> collected through react-helmet-async, and the result written to
 * dist/client/<route>/index.html — so crawlers and first paint get the full
 * page, and React takes it over without re-rendering. Also writes 404.html,
 * sitemap.xml and robots.txt.
 */
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { SITE_URL } from '../src/lib/site';

// npm runs the build from the project root; this file runs compiled, from dist.
const root = process.cwd();
const clientDir = join(root, 'dist/client');
const serverEntry = join(root, 'dist/server/entry-server.js');

type ServerEntry = {
  ROUTES: string[];
  render: (url: string) => Promise<{ html: string; head: string }>;
  pageSource: (url: string) => string | undefined;
  blogPosts: Array<{ slug: string; date: string }>;
};

/** The latin woff2 cuts of the two fonts the first screen needs. */
async function fontPreloads() {
  const files = await readdir(join(clientDir, 'assets'));
  // The italic too: the About and Blog titles set a word in it above the fold,
  // and a late swap would shift the page.
  const wanted = [
    /^cormorant-garamond-latin-500-normal-.*\.woff2$/,
    /^cormorant-garamond-latin-500-italic-.*\.woff2$/,
    /^manrope-latin-wght-normal-.*\.woff2$/,
  ];
  return wanted
    .map((pattern) => files.find((file) => pattern.test(file)))
    .filter(Boolean)
    .map((file) => `<link rel="preload" href="/assets/${file}" as="font" type="font/woff2" crossorigin />`)
    .join('\n    ');
}

type Manifest = Record<string, { file: string; css?: string[]; imports?: string[]; isEntry?: boolean }>;

/** A chunk's file and every chunk it statically imports, recursively. */
function chunkFiles(manifest: Manifest, key: string, files = new Set<string>(), css = new Set<string>()) {
  const chunk = manifest[key];
  if (!chunk || files.has(chunk.file)) return { files, css };
  files.add(chunk.file);
  chunk.css?.forEach((file) => css.add(file));
  chunk.imports?.forEach((child) => chunkFiles(manifest, child, files, css));
  return { files, css };
}

/**
 * Each page is its own chunk, and main.tsx loads the current one before it
 * hydrates. Preloading it (and the shared chunks it imports) next to the
 * entry keeps that from becoming a second round trip.
 */
function chunkPreloads(manifest: Manifest, source: string | undefined) {
  if (!source || !manifest[source]) return '';
  const entryKey = Object.keys(manifest).find((key) => manifest[key].isEntry);
  // The entry and what it imports are already linked from index.html.
  const inEntry = entryKey ? chunkFiles(manifest, entryKey).files : new Set<string>();
  const { files, css } = chunkFiles(manifest, source);
  return [
    ...[...css].map((file) => `<link rel="stylesheet" href="/${file}" />`),
    ...[...files]
      .filter((file) => !inEntry.has(file))
      .map((file) => `<link rel="modulepreload" crossorigin href="/${file}" />`),
  ].join('\n    ');
}

function sitemap(entry: ServerEntry) {
  const built = new Date().toISOString();
  const pages: Array<[string, number]> = [
    ['/', 1],
    ['/about-me', 0.9],
    ['/before-and-after', 0.8],
    ['/blog', 0.8],
    ['/reach-me', 0.7],
  ];
  const url = (loc: string, lastmod: string, freq: string, priority: number) =>
    `  <url><loc>${SITE_URL}${loc}</loc><lastmod>${lastmod}</lastmod><changefreq>${freq}</changefreq><priority>${priority}</priority></url>`;

  const articles = entry.blogPosts.map((post) => {
    // The post's own date, not the build date — DD/MM/YYYY in the data.
    const [day, month, year] = post.date.split('/').map(Number);
    return url(`/blog/${post.slug}`, new Date(Date.UTC(year, month - 1, day)).toISOString(), 'yearly', 0.6);
  });

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map(([path, priority]) => url(path, built, 'monthly', priority)),
    ...articles,
    '</urlset>',
    '',
  ].join('\n');
}

const robots = `User-Agent: *
Allow: /
Disallow: /api/

Host: ${SITE_URL}
Sitemap: ${SITE_URL}/sitemap.xml
`;

/**
 * Head tags React emits in place: the title, name/property metas, the
 * canonical, and the image preloads it adds for high-priority hero images.
 */
const HOISTABLE =
  /<title>[\s\S]*?<\/title>|<meta (?:name|property)="[^"]*"[^>]*\/?>|<link rel="(?:canonical|preload)"[^>]*\/?>/g;

async function main() {
  const entry = (await import(pathToFileURL(serverEntry).href)) as ServerEntry;
  const template = await readFile(join(clientDir, 'index.html'), 'utf8');
  const preloads = await fontPreloads();
  const manifest = JSON.parse(await readFile(join(clientDir, '.vite/manifest.json'), 'utf8')) as Manifest;

  const page = async (url: string) => {
    const { html, head } = await entry.render(url);
    // React 19 renders <title>, <meta> and <link> where the component puts
    // them (react-helmet-async v3 hands them to React rather than collecting
    // them), and hoists them itself only when it renders the whole document.
    // Rendering just #root, they land in the body — so move them to <head>,
    // where crawlers look.
    const hoisted: string[] = [];
    const body = html.replace(HOISTABLE, (tag) => {
      hoisted.push(tag);
      return '';
    });
    return template
      .replace('<!--font-preloads-->', preloads)
      .replace('<!--app-head-->', [chunkPreloads(manifest, entry.pageSource(url)), head, ...hoisted].filter(Boolean).join('\n    '))
      .replace('<!--app-html-->', body);
  };

  for (const route of entry.ROUTES) {
    const file = route === '/' ? join(clientDir, 'index.html') : join(clientDir, route, 'index.html');
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, await page(route));
  }
  await writeFile(join(clientDir, '404.html'), await page('/404'));
  await writeFile(join(clientDir, 'sitemap.xml'), sitemap(entry));
  await writeFile(join(clientDir, 'robots.txt'), robots);

  // The server bundle was only needed to render, and the manifest only to
  // find the page chunks; neither is served.
  await rm(join(root, 'dist/server'), { recursive: true, force: true });
  await rm(join(clientDir, '.vite'), { recursive: true, force: true });

  console.log(`prerendered ${entry.ROUTES.length} routes + 404.html, sitemap.xml, robots.txt`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
