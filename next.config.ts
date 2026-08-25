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
    ];
  },
};

export default nextConfig;
