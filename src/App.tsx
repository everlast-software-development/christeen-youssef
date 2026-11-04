import { Navigate, Route, Routes, useParams } from 'react-router';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { ScrollMotion } from '@/components/providers/scroll-motion';
import { Preloader } from '@/components/site/preloader';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import Home from '@/pages/home';
import About from '@/pages/about';
import BeforeAndAfter from '@/pages/before-and-after';
import Blog from '@/pages/blog';
import BlogPost from '@/pages/blog-post';
import ReachMe from '@/pages/reach-me';
import NotFound from '@/pages/not-found';

/** `/blogs/:slug` was the old URL for an article. */
function LegacyBlogPost() {
  const { slug } = useParams();
  return <Navigate to={`/blog/${slug}`} replace />;
}

/**
 * The site: the shared chrome (skip link, smooth scroll, preloader, header,
 * footer) around the routes. The same tree renders on the server at build
 * time (entry-server.tsx) and hydrates in the browser (main.tsx).
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

      <SmoothScroll>
        <Preloader>
          <ScrollProgress />
          <SiteHeader />
          <ScrollMotion />
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
          <SiteFooter />
        </Preloader>
      </SmoothScroll>
    </>
  );
}
