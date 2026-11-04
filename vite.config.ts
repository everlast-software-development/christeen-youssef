import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { imagetools } from 'vite-imagetools';
import type { ProcessedImage } from 'imagetools-core';

/**
 * Responsive widths every photograph is cut to. Matches the deviceSizes the
 * Next.js build used, so srcsets resolve to the same candidates as before.
 */
const WIDTHS = [384, 640, 750, 828, 1080, 1200, 1920, 2048];

/** Plain photo imports from src/assets — `import x from '@/assets/a.webp'`. */
const ASSET = /[\\/]src[\\/]assets[\\/].+\.(jpe?g|png|webp)$/i;

/**
 * `as=asset`: the shape every <Image> in the app consumes — next/image's
 * StaticImageData plus srcsets. imagetools cuts every width in AVIF and WebP
 * (what next/image's optimizer served): AVIF for browsers that take it, WebP
 * as the fallback `src`/`srcSet`. The blur placeholder is a 16px WebP of the
 * largest, inlined as a data URI.
 */
const asset = () => async (images: ProcessedImage[]) => {
  const of = (format: string) =>
    images.filter((image) => image.config.format === format).sort((a, b) => a.info.width - b.info.width);
  const webp = of('webp');
  const avif = of('avif');
  const srcSet = (list: ProcessedImage[]) => list.map((image) => `${image.src} ${image.info.width}w`).join(', ');

  const largest = webp[webp.length - 1];
  const original = largest.sharpMetadata;
  const blur = await largest.image.clone().resize(16).webp({ quality: 50 }).toBuffer();
  // The fallback `src` for browsers without srcset: the 1080 cut, or the
  // largest there is.
  const fallback = webp.find((image) => image.info.width >= 1080) ?? largest;

  return {
    src: fallback.src,
    srcSet: srcSet(webp),
    avifSrcSet: srcSet(avif),
    width: largest.info.width ?? original.width,
    height: largest.info.height ?? original.height,
    blurDataURL: `data:image/webp;base64,${blur.toString('base64')}`,
  };
};

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    imagetools({
      // Every plain photo import under src/assets becomes a responsive asset;
      // an explicit ?query on an import still wins.
      defaultDirectives: async (url, metadata) => {
        if (url.search || !ASSET.test(url.pathname)) return new URLSearchParams();
        const { width = 0 } = await metadata();
        const widths = WIDTHS.filter((w) => w < width).concat(width);
        // Quality 75: next/image's default, which the site was tuned against.
        return new URLSearchParams({ w: widths.join(';'), format: 'avif;webp', quality: '75', as: 'asset' });
      },
      extendOutputFormats: (builtins) => ({ ...builtins, asset }),
    }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    // Read by scripts/prerender.ts to modulepreload each page's chunk.
    manifest: true,
  },
  ssr: {
    // Bundled into the prerender build rather than required at runtime, so the
    // server bundle sees the same CSS and image imports the client does.
    noExternal: ['@fontsource/cormorant-garamond', '@fontsource-variable/manrope', 'lenis', 'react-icons'],
  },
});
