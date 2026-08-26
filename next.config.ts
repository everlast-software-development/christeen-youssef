import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  // Preserve SEO for the legacy react-router URL pairs that rendered
  // identical pages (/gallery + /before-and-after, /blog + /blogs).
  async redirects() {
    return [
      { source: '/gallery', destination: '/before-and-after', permanent: true },
      { source: '/blogs/:slug', destination: '/blog/:slug', permanent: true },

      // /appointment was a scaffold and /publications a page that has been
      // retired. Both were linked or indexed, so they redirect to the page that
      // now does their job rather than 404ing. Kept as redirects rather than
      // rebuilt stubs so there is one contact surface, not two.
      { source: '/appointment', destination: '/reach-me', permanent: true },
      { source: '/publications', destination: '/before-and-after', permanent: true },
    ];
  },
};

export default nextConfig;
