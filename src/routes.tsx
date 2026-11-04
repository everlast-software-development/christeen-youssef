import { use, type ComponentType } from 'react';
import { matchPath } from 'react-router';

type PageModule = { default: ComponentType };

/**
 * A page split into its own chunk, without React.lazy's guaranteed suspend:
 * once its module has loaded, it renders synchronously. That is what keeps
 * hydration clean — main.tsx loads the current page before hydrating, so the
 * first render matches the prerendered HTML instead of flashing a fallback —
 * and lets the prerender render every page in one synchronous pass.
 */
function splitPage(load: () => Promise<PageModule>) {
  let loaded: PageModule | null = null;
  let pending: Promise<PageModule> | null = null;

  const preload = () =>
    (pending ??= load().then((module) => {
      loaded = module;
      return module;
    }));

  function Page() {
    // Not loaded yet (a client-side navigation that outran the preload):
    // suspend until it is — the nearest <Suspense> shows nothing meanwhile.
    const Component = (loaded ?? use(preload())).default;
    return <Component />;
  }

  return Object.assign(Page, { preload });
}

export const Home = splitPage(() => import('@/pages/home'));
export const About = splitPage(() => import('@/pages/about'));
export const BeforeAndAfter = splitPage(() => import('@/pages/before-and-after'));
export const Blog = splitPage(() => import('@/pages/blog'));
export const BlogPost = splitPage(() => import('@/pages/blog-post'));
export const ReachMe = splitPage(() => import('@/pages/reach-me'));

/**
 * Route patterns → the split page they render, and the page's source module
 * (the prerender looks it up in Vite's manifest to emit a modulepreload).
 */
export const SPLIT_ROUTES = [
  { path: '/', page: Home, source: 'src/pages/home.tsx' },
  { path: '/about-me', page: About, source: 'src/pages/about.tsx' },
  { path: '/before-and-after', page: BeforeAndAfter, source: 'src/pages/before-and-after.tsx' },
  { path: '/blog', page: Blog, source: 'src/pages/blog.tsx' },
  { path: '/blog/:slug', page: BlogPost, source: 'src/pages/blog-post.tsx' },
  { path: '/reach-me', page: ReachMe, source: 'src/pages/reach-me.tsx' },
] as const;

/** The split route a URL path lands on, if any. */
export function routeFor(pathname: string) {
  return SPLIT_ROUTES.find((route) => matchPath(route.path, pathname));
}

/** Load the code for the page at `pathname` (a no-op for the 404 page). */
export function preloadPage(pathname: string) {
  return routeFor(pathname)?.page.preload() ?? Promise.resolve();
}

/** Load every page — the prerender renders them all. */
export function preloadAllPages() {
  return Promise.all(SPLIT_ROUTES.map((route) => route.page.preload()));
}
