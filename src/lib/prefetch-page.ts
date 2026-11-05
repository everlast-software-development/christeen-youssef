import { preloadPage } from '@/routes';

type HeroImage = { href: string; srcset?: string; sizes?: string; type?: string };

let heroes: Promise<Record<string, HeroImage>> | null = null;
const started = new Set<string>();

/**
 * Gets the next page ready while its link is only hovered or focused: its
 * code chunk, and its main image (from hero-images.json, written by the
 * prerender — the same srcset, sizes and type the page itself preloads, so
 * the browser picks the same file and the page finds it in the cache).
 *
 * Once per path. Missing in dev (no prerender), which only means no image.
 */
export function prefetchPage(href: string) {
  const path = href.split(/[?#]/)[0].replace(/(.)\/$/, '$1') || '/';
  if (!path.startsWith('/') || started.has(path)) return;
  started.add(path);

  void preloadPage(path).catch(() => undefined);

  heroes ??= fetch('/hero-images.json')
    .then((response) => (response.ok ? response.json() : {}))
    .catch(() => ({}));

  void heroes.then((map) => {
    const hero = map[path];
    if (!hero) return;
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    // React leaves href out of a srcset preload; an empty one would resolve to
    // this page's own URL.
    if (hero.href) link.href = hero.href;
    if (hero.srcset) link.setAttribute('imagesrcset', hero.srcset);
    if (hero.sizes) link.setAttribute('imagesizes', hero.sizes);
    // AVIF only, like the page's own preload: a browser without it skips this.
    if (hero.type) link.type = hero.type;
    document.head.append(link);
  });
}
