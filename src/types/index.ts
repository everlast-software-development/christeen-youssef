import type { StaticImageData } from 'next/image';
import type { LucideIcon } from 'lucide-react';
import type { SocialPlatform } from '@/components/icons/social-icon';

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface Service {
  id: string;
  icon: string; // React Icon component name
  title: string;
  description: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  date?: string;
  content: string;
  rating?: number;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
  icon?: LucideIcon;
}

export interface CareerEntry {
  id: string;
  title: string;
  organisation: string;
  period: string;
  description: string;
}

/**
 * One frame in a post's gallery.
 *
 * A bare import wherever the default centre crop is right, which is almost
 * everywhere — the object form only where a photograph has to be anchored
 * somewhere else. Kept as a union rather than making every entry an object so
 * the eight posts that never needed a crop are not rewritten to say so.
 */
export type GalleryFrame =
  | StaticImageData
  | {
      image: StaticImageData;
      /** `object-position` for this frame. See `galleryFrame`. */
      focus?: string;
      /**
       * How much of the image column this frame takes. Defaults to all of it.
       *
       * `half` is for a portrait among landscapes: at full column width a 2:3
       * source is half again as tall as the frames around it and stops being one
       * picture in a set.
       */
      width?: 'half' | 'full';
    };

/**
 * A photograph placed inside one body section rather than in the gallery band.
 *
 * Keyed by the section's slug rather than by its index, so inserting a `##`
 * above it does not silently move the picture to a different argument.
 */
export interface SectionFigure {
  /** The `##` heading's slug — `slugify(heading)`, i.e. `Section.id`. */
  section: string;
  image: StaticImageData;
  /** Which side the copy runs past. Alternates down the article by hand. */
  side?: 'left' | 'right';
  /** Left empty for a decorative frame; set where the picture carries fact. */
  alt?: string;
  /** Let the frame out of the measure into the page margin. See ArticleFigure. */
  bleed?: boolean;
  /** Square the frame off rather than keeping the source's shape. */
  crop?: 'square';
  /** `object-position` for a cropped frame. */
  focus?: string;
}

/**
 * A crop anchor for the full-bleed frames: one value for both, or one each.
 * A missing surface falls back to the default in `resolve`, not to the other
 * surface's value — a half-specified pair is a mistake worth seeing.
 */
export type ImageFocus =
  | string
  | { hero?: string; carousel?: string };

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  readTime: string;
  image: StaticImageData;
  /**
   * `object-position` for `image` in the full-bleed frames.
   *
   * A bare string sets both the article hero and the listing carousel, which
   * share one crop by design. The object form sets them apart, for the posts
   * where the two frames' different heights and the carousel's zoom put the
   * subject inside one and outside the other — see `heroFocus`.
   *
   * Omitted on almost every post: the default in `heroFocus` anchors at 32% down,
   * because faces sit above centre in most of these. The German University
   * signing is the exception — a portrait shot with the ceiling and the air
   * conditioning taking the top half of the frame, so anchoring above centre
   * shows the ceiling and crops out the signing.
   */
  imageFocus?: ImageFocus;
  content?: string;
  /**
   * Extra artwork shown as a strip inside the article. These used to be written
   * into `content` as `![alt](${imported})` — inside a template literal that
   * interpolated the imported object, so the src rendered as "[object Object]"
   * and the images never appeared. A real field cannot fail that way.
   */
  gallery?: GalleryFrame[];
  /**
   * Photographs set into the body, beside the section they belong to. Distinct
   * from `gallery`, which is the band at the foot of the article — a set seen as
   * a set. A frame belongs here when it illustrates one specific passage.
   */
  figures?: SectionFigure[];
  /**
   * Headline figures, lifted out of the prose into a band under the hero.
   *
   * Authored per post rather than parsed out of `content`: which numbers carry
   * the piece is a judgement, and a regex over the body would pull citation
   * years and journal volumes just as happily as it would pull "250 million
   * surgical incisions". Only two of the nine posts have figures worth banding,
   * which is why it is optional.
   */
  stats?: { value: string; label: string }[];
}

export interface ScheduleInfo {
  clinicName: string;
  role: string;
  address: string;
  workingDays: string[];
  hours: string;
  phone: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}
