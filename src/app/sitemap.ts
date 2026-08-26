import type { MetadataRoute } from 'next';
import { blogPosts } from '@/data/blog';
import { parseBlogDate } from '@/lib/blog-date';
import { SITE_URL } from '@/lib/site';

/**
 * Static pages, highest priority first.
 *
 * `/appointment` is deliberately absent: it is a redirect to /reach-me, and
 * listing a redirect in a sitemap is a crawl error rather than a hint.
 */
const PAGES: Array<{ path: string; priority: number }> = [
  { path: '/', priority: 1 },
  { path: '/about-me', priority: 0.9 },
  { path: '/before-and-after', priority: 0.8 },
  { path: '/blog', priority: 0.8 },
  { path: '/reach-me', priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  // The build stamps this once, which is what we want: it marks when the
  // deployed content was produced, not when a crawler happened to ask.
  const built = new Date();

  const pages = PAGES.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: built,
    changeFrequency: 'monthly' as const,
    priority,
  }));

  const articles = blogPosts.map((post) => {
    const { day, month, year } = parseBlogDate(post.date);

    return {
      url: `${SITE_URL}/blog/${post.slug}`,
      // The post's own date, not the build date — an article that has not
      // changed in a year should say so.
      lastModified: new Date(Date.UTC(year, month - 1, day)),
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    };
  });

  return [...pages, ...articles];
}
