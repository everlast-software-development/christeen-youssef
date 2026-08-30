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
 * A photograph set inside one body section, with the copy running past it.
 *
 * Keyed by the section's slug rather than by its index, so inserting a `##`
 * above it does not silently move the picture to a different argument.
 */
export interface SectionFigure {
  /** The `##` heading's slug — `slugify(heading)`, i.e. `Section.id`. */
  section: string;
  image: StaticImageData;
  /**
   * Which side the copy runs past.
   *
   * Left unset almost everywhere: ArticleBody alternates sides down the article
   * on its own, and every value that used to be written here was the one the
   * alternation would have produced anyway. Set it only to break that rhythm
   * deliberately.
   */
  side?: 'left' | 'right';
  /** Left empty for a decorative frame; set where the picture carries fact. */
  alt?: string;
  /** Square the frame off rather than keeping the source's shape. */
  crop?: 'square';
  /** `object-position` for a cropped frame. */
  focus?: string;
  /**
   * A flat width in pixels, from sm up, instead of the responsive default.
   *
   * The default scales the frame with the viewport, which is right where the
   * picture is simply "a picture beside this paragraph". Set this where the
   * frame has a size it wants to be held at.
   */
  width?: number;
}

/*
 * `bleed` and `layout: 'column'` used to live here too. A bled frame leaned out
 * of the measure into the page margin; a column frame split the article in two
 * from its own section down, copy on one side and picture on the other. Both
 * were per-post accommodations, and between them they meant three of the ten
 * articles had a different spine from the rest. A figure is now one thing on
 * every post: a float inside the measure that the copy closes back over.
 */

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
   * A post's photographs, in the order they should be met.
   *
   * They are set into the body like `figures` are, and for the same reason: a
   * photograph from the day is part of the article, not an appendix to it. The
   * difference is only that nobody has said which passage each one belongs to,
   * so ArticleBody spreads them down the sections `figures` has not already
   * claimed. Name the section and it becomes a `figure` instead.
   */
  gallery?: StaticImageData[];
  /**
   * Photographs whose place in the argument is known — the podium shot beside
   * the paragraph about what was said at the podium. Everything else goes in
   * `gallery` and is placed for you.
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
