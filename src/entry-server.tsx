import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async';
import { App } from '@/App';
import { blogPosts } from '@/data/blog';

/** Every URL prerendered to static HTML at build time. */
export const ROUTES = [
  '/',
  '/about-me',
  '/before-and-after',
  '/blog',
  '/reach-me',
  ...blogPosts.map((post) => `/blog/${post.slug}`),
];

/** The same app main.tsx hydrates, rendered once for `url`. */
export function render(url: string) {
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
