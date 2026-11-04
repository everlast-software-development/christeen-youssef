import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { App } from '@/App';
import { blogPosts } from '@/data/blog';
import { preloadAllPages, routeFor } from '@/routes';

/** Every URL prerendered to static HTML at build time. */
export const ROUTES = [
  '/',
  '/about-me',
  '/before-and-after',
  '/blog',
  '/reach-me',
  ...blogPosts.map((post) => `/blog/${post.slug}`),
];

/** The page's source module, for its chunk in Vite's manifest. */
export function pageSource(url: string) {
  return routeFor(url)?.source;
}

/**
 * The same app main.tsx hydrates, rendered once for `url`. Every split page
 * is loaded first, so the render is a single synchronous pass.
 */
export async function render(url: string) {
  await preloadAllPages();
  const helmetContext: { helmet?: HelmetServerState } = {};

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={url}>
          <App />
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
  );

  const helmet = helmetContext.helmet;
  const head = helmet
    ? [helmet.title, helmet.meta, helmet.link, helmet.script].map((part) => part.toString()).join('\n')
    : '';

  return { html, head };
}

export { blogPosts };
