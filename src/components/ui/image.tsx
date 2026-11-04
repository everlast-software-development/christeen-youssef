import { useState, type CSSProperties, type ImgHTMLAttributes } from 'react';
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
  /** Above the fold: load eagerly at high priority. */
  preload?: boolean;
  /** next/image's older name for `preload`. */
  priority?: boolean;
  /** Show the asset's blurred thumbnail until the photo has loaded. */
  placeholder?: 'blur' | 'empty';
  /** Accepted for API parity; every variant is already encoded at build time. */
  quality?: number;
};

/**
 * The drop-in for next/image: an <img> with the build's AVIF and WebP srcsets,
 * intrinsic width/height (so nothing shifts while it loads), lazy loading
 * unless it is a hero, and an optional blur placeholder painted as the image's
 * own background until it has decoded.
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
  placeholder = 'empty',
  quality: _quality,
  loading,
  className,
  style,
  onLoad,
  ...rest
}: ImageProps) {
  const asset = typeof src === 'string' ? null : src;
  const eager = preload || priority;
  const [loaded, setLoaded] = useState(false);

  const blur: CSSProperties | undefined =
    placeholder === 'blur' && asset && !loaded
      ? {
          backgroundImage: `url("${asset.blurDataURL}")`,
          backgroundSize: style?.objectFit === 'contain' ? 'contain' : 'cover',
          backgroundPosition: style?.objectPosition ?? 'center',
          backgroundRepeat: 'no-repeat',
        }
      : undefined;

  const resolvedSizes = asset ? (sizes ?? (fill ? '100vw' : undefined)) : undefined;

  const img = (
    <img
      {...rest}
      src={asset ? asset.src : (src as string)}
      srcSet={asset?.srcSet}
      sizes={resolvedSizes}
      alt={alt}
      width={fill ? undefined : (width ?? asset?.width)}
      height={fill ? undefined : (height ?? asset?.height)}
      loading={loading ?? (eager ? 'eager' : 'lazy')}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      onLoad={(event) => {
        setLoaded(true);
        onLoad?.(event);
      }}
      className={cn(fill && 'absolute inset-0 h-full w-full', className)}
      style={{ ...blur, ...style }}
    />
  );

  if (!asset?.avifSrcSet) return img;

  // AVIF first, WebP <img> as the fallback. `display: contents` keeps the
  // <picture> out of layout, so the <img> sizes and positions as before.
  return (
    <picture className="contents">
      <source type="image/avif" srcSet={asset.avifSrcSet} sizes={resolvedSizes} />
      {img}
    </picture>
  );
}
