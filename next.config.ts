import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    // Default is [...640..2048, 3840]. 3840 is dropped: the widest `sizes`
    // hint anywhere on the site is `100vw`, and the optimizer decodes the
    // source to raw RGBA at 4 bytes a pixel to produce each variant — a 3840
    // render is 3.5x the pixels of 2048 for a photograph that sits under a
    // scrim. Removing it takes the worst-case optimization off the table.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Required from Next 16: without it, any `?q=` is honoured and a caller
    // can make the server render the same picture at every quality there is.
    // Nothing here passes `quality`, so this is the single value in use.
    qualities: [75],
    // Only bites on the remote flags below — static imports are content-hashed
    // and already cached immutably — but it stops those being re-fetched and
    // re-encoded every four hours for the life of the deploy.
    minimumCacheTTL: 2678400,
    // Country flags for the phone field's dial-code picker. Remote rather than
    // bundled because the alternative is 240 flag files in the repo, and the
    // emoji alternative does not render on Windows, where the flag sequences
    // fall back to bare letter pairs.
    remotePatterns: [
      { protocol: 'https', hostname: 'flagcdn.com', pathname: '/**' },
    ],
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
