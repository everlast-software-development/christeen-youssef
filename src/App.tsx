import { Suspense } from 'react';
import { Navigate, Route, Routes, useParams } from 'react-router';
import { RouteScroll } from '@/components/providers/route-scroll';
import { ScrollMotion } from '@/components/providers/scroll-motion';
import { Preloader } from '@/components/site/preloader';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { About, BeforeAndAfter, Blog, BlogPost, Home, ReachMe } from '@/routes';
// Not split: the blog post page renders it for an unknown slug too.
import NotFound from '@/pages/not-found';

/** `/blogs/:slug` was the old URL for an article. */
function LegacyBlogPost() {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
}

/**
 * The site: the shared chrome (skip link, route scroll reset, preloader,
 * header, footer) around the routes. Scrolling is the browser's own. The same tree renders on the server at build
 * time (entry-server.tsx) and hydrates in the browser (main.tsx). Each page is
 * its own chunk (routes.tsx); the Suspense boundary only ever shows during a
 * client-side navigation that outruns its preload — never on first load.
 *
 * The legacy redirects are also answered with a 301 by the Express server;
 * these only cover in-app navigation to an old URL.
 */
export function App() {
  return (
    <>
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:rounded-[10px] focus:bg-gold-deep focus:px-5 focus:py-3 focus:type-button focus:text-white"
      >
        Skip to content
      </a>

      <RouteScroll />
      <Preloader>
        <ScrollProgress />
        <SiteHeader />
        <ScrollMotion />
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-me" element={<About />} />
            <Route path="/before-and-after" element={<BeforeAndAfter />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/reach-me" element={<ReachMe />} />

            <Route path="/gallery" element={<Navigate to="/before-and-after" replace />} />
            <Route path="/publications" element={<Navigate to="/before-and-after" replace />} />
            <Route path="/appointment" element={<Navigate to="/reach-me" replace />} />
            <Route path="/blogs/:slug" element={<LegacyBlogPost />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <SiteFooter />
      </Preloader>
    </>
  );
}
