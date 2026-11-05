import { useEffect, useRef, useState, type CSSProperties, type ImgHTMLAttributes } from 'react';
import { preload as preloadResource } from 'react-dom';
import { cn } from '@/lib/utils';

/**
 * What a photo import from src/assets resolves to (see vite.config.ts, the
 * `asset` output format): next/image's StaticImageData, plus srcsets.
 */
export type ImageAsset = {
  src: string;
  /** WebP widths — the fallback. */
  srcSet: string;
  /** AVIF widths, for browsers that support it. */
  avifSrcSet: string;
  width: number;
  height: number;
  blurDataURL: string;
};

/** Kept so code written against next/image reads the same. */
export type StaticImageData = ImageAsset;

type ImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'placeholder' | 'width' | 'height'> & {
  src: ImageAsset | string;
  alt: string;
  /** Fill the positioned parent (absolute, inset 0, 100% × 100%). */
  fill?: boolean;
  width?: number;
  height?: number;
  /**
   * The page's main image (one per page, plus the header logo): eager,
   * fetchpriority="high", and preloaded in the prerendered <head>.
   */
  preload?: boolean;
  /** next/image's older name for `preload`. */
  priority?: boolean;
  /**
   * In the first viewport but not the main image: eager and preloaded in the
   * <head>, at the browser's normal priority.
   */
  eager?: boolean;
  /** Only preload where this media query matches (a card only on screen from lg). */
  preloadMedia?: string;
  /** Show the asset's blurred thumbnail until the photo has loaded. */
  placeholder?: 'blur' | 'empty';
  /** Accepted for API parity; every variant is already encoded at build time. */
  quality?: number;
};

/** How far ahead of the viewport a lazy image starts loading. */
const NEAR = '800px';

let nearObserver: IntersectionObserver | null = null;

/**
 * One shared observer for every lazy image. When an image comes within NEAR
 * of the viewport (or of a carousel's visible edge, via scrollMargin where the
 * browser has it) it is switched to loading="eager", which starts it at once.
 * Native loading="lazy" stays in the markup as the no-JS fallback.
 */
function watchNear(img: HTMLImageElement) {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  nearObserver ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target as HTMLImageElement;
        target.loading = 'eager';
        nearObserver?.unobserve(target);
      }
    },
    // scrollMargin grows every scroll container on the way — the page and a
    // sideways carousel alike — and in Chrome it adds to rootMargin, so the
    // two together would mean ~1600px. One or the other, whichever exists.
    'scrollMargin' in IntersectionObserver.prototype
      ? ({ scrollMargin: NEAR } as IntersectionObserverInit)
      : { rootMargin: NEAR },
  );
  nearObserver.observe(img);
  return () => nearObserver?.unobserve(img);
}

/**
 * Starts every lazy image inside `container` once the container itself is
 * within NEAR of the viewport. For a track whose overflow clips its cards out
 * of each image's own intersection — the pinned horizontal carousel, where a
 * card sits a full screen to the right until the scroll slides it in.
 */
export function loadImagesNear(container: HTMLElement) {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      container.querySelectorAll<HTMLImageElement>('img[loading="lazy"]').forEach((img) => {
        img.loading = 'eager';
      });
      observer.disconnect();
    },
    { rootMargin: NEAR },
  );
  observer.observe(container);
  return () => observer.disconnect();
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Hides an image that is still loading when the app takes over, and fades it
 * in (300ms) once it has loaded and decoded. An image already complete — a
 * hero that arrived before hydration — is left alone, so nothing already on
 * screen ever blinks. Web Animations rather than a CSS transition, so it never
 * replaces an image's own transition (the cards' hover zoom).
 */
function fadeInWhenReady(img: HTMLImageElement) {
  if (img.complete && img.naturalWidth > 0) return () => {};
  img.style.opacity = '0';
  let cancelled = false;

  const show = () => {
    const decoded = img.decode ? img.decode().catch(() => undefined) : Promise.resolve();
    void decoded.then(() => {
      if (cancelled) return;
      img.style.opacity = '';
      if (!reducedMotion()) {
        img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
      }
    });
  };

  img.addEventListener('load', show, { once: true });
  img.addEventListener('error', show, { once: true });
  return () => {
    cancelled = true;
    img.removeEventListener('load', show);
    img.removeEventListener('error', show);
    img.style.opacity = '';
  };
}

/**
 * The drop-in for next/image: an <img> with the build's AVIF and WebP srcsets
 * and intrinsic width/height (so nothing shifts while it loads).
 *
 * - `preload` / `priority`: the page's main image — eager, high priority,
 *   preloaded in the <head> (react-dom's preload(), hoisted by the prerender).
 * - `eager`: other images in the first viewport — eager and preloaded.
 * - Everything else is lazy, starts loading ~800px before it is reached, and
 *   fades in (300ms) once decoded if it was not ready in time.
 *
 * A `fill` image with a blur placeholder paints the blurred thumbnail on a
 * layer behind it, so the blur shows until the photo is there.
 */
export function Image({
  src,
  alt,
  fill = false,
  width,
  height,
  sizes,
  preload = false,
  priority = false,
  eager = false,
  preloadMedia,
  placeholder = 'empty',
  quality: _quality,
  loading,
  className,
  style,
  onLoad,
  ...rest
}: ImageProps) {
  const asset = typeof src === 'string' ? null : src;
  const high = preload || priority;
  const upFront = high || eager;
  const resolvedSizes = asset ? (sizes ?? (fill ? '100vw' : undefined)) : undefined;
  const ref = useRef<HTMLImageElement>(null);
  const href = asset ? asset.src : (src as string);

  // Above the fold: declared in the <head> so the download starts with the
  // HTML, not when the parser (or React) reaches the <img>. The AVIF set only:
  // a browser without AVIF skips the preload and fetches the WebP from the
  // <img> as before.
  if (upFront) {
    preloadResource(href, {
      as: 'image',
      ...(asset?.avifSrcSet
        ? { imageSrcSet: asset.avifSrcSet, imageSizes: resolvedSizes, type: 'image/avif' }
        : asset
          ? { imageSrcSet: asset.srcSet, imageSizes: resolvedSizes }
          : {}),
      fetchPriority: high ? 'high' : undefined,
      media: preloadMedia,
    });
  }

  const lazy = (loading ?? (upFront ? 'eager' : 'lazy')) === 'lazy';
  const blurUrl = placeholder === 'blur' && asset ? asset.blurDataURL : null;
  // Images that load as the page is scrolled fade in. The ones in the first
  // viewport do not: they show the instant they arrive (over their blur),
  // because holding the page's main image back for a fade delays its largest
  // paint. And a laid-out (non-fill) image keeps its blur as its own
  // background — no box behind it to paint the blur on — so fading it from
  // transparent would hide the blur too; it swaps instead.
  const fades = !upFront && (fill || !blurUrl);

  useEffect(() => {
    const img = ref.current;
    if (!img) return;
    const stopWatching = lazy ? watchNear(img) : () => {};
    const stopFade = fades ? fadeInWhenReady(img) : () => {};
    return () => {
      stopWatching();
      stopFade();
    };
  }, [href, lazy, fades]);

  const [loaded, setLoaded] = useState(false);
  const fit = style?.objectFit === 'contain' ? 'contain' : 'cover';
  const blurLayer: CSSProperties | undefined = blurUrl
    ? {
        backgroundImage: `url("${blurUrl}")`,
        backgroundSize: fit,
        backgroundPosition: style?.objectPosition ?? 'center',
        backgroundRepeat: 'no-repeat',
      }
    : undefined;

  const img = (
    <img
      {...rest}
      ref={ref}
      src={href}
      srcSet={asset?.srcSet}
      sizes={resolvedSizes}
      alt={alt}
      width={fill ? undefined : (width ?? asset?.width)}
      height={fill ? undefined : (height ?? asset?.height)}
      loading={lazy ? 'lazy' : 'eager'}
      fetchPriority={high ? 'high' : undefined}
      decoding="async"
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={cn(fill && 'absolute inset-0 h-full w-full', className)}
      style={{ ...(!fill && !loaded ? blurLayer : undefined), ...style }}
    />
  );

  const picture = asset?.avifSrcSet ? (
    // AVIF first, WebP <img> as the fallback. `display: contents` keeps the
    // <picture> out of layout, so the <img> sizes and positions as before.
    <picture className="contents">
      <source type="image/avif" srcSet={asset.avifSrcSet} sizes={resolvedSizes} />
      {img}
    </picture>
  ) : (
    img
  );

  if (!fill || !blurLayer) return picture;

  return (
    <>
      <span aria-hidden className="absolute inset-0" style={blurLayer} />
      {picture}
    </>
  );
}
