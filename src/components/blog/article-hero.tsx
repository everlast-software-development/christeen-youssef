import { Image } from '@/components/ui/image';
import { PageHero } from '@/components/site/page-hero';
import { filterChip } from '@/components/site/filter-chips';
import { formatBlogDate } from '@/lib/blog-date';
import { heroFocus } from '@/lib/blog-image';
import type { BlogPost } from '@/types';

const CATEGORY_EYEBROW: Record<string, string> = {
  CONFERENCE: 'From the podium',
  EVENT: 'At the event',
  MEDIA: 'In the press',
  PARTNERSHIP: 'Partnership',
  RESEARCH: 'Published research',
  TESTIMONIAL: 'Patient story',
  WORKSHOP: 'Teaching',
};

export function categoryEyebrow(category: string) {
  return CATEGORY_EYEBROW[category] ?? category;
}

/** `DD/MM/YYYY` → `YYYY-MM-DD`. */
function isoDate(date: string) {
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
}

/**
 * An article's opening: the shared inner-page hero — breadcrumb to the post,
 * the title (a size below the page titles, so a long headline holds to three
 * lines on desktop), the category chip with the date and read time — and the
 * cover photograph across the full container, hanging half below the ink onto
 * the cream, the way the About portrait does. (`cover-overhang` on <main>
 * sets the overhang to half the frame's height; globals.css.)
 */
export function ArticleHero({ post, onOpenCover }: { post: BlogPost; onOpenCover: () => void }) {
  return (
    <PageHero
      section="/blog"
      page={{ label: post.title, href: `/blog/${post.slug}` }}
      title={post.title}
      // 34ch, not 24: at 24ch half of these headlines run to four or five
      // lines; at 34 all but the 108-character SVF title hold to three.
      titleClassName="mx-auto max-w-[34ch] font-display text-[length:clamp(2.25rem,4.2vw,3.5rem)] leading-[1.08] font-medium"
      overhang="var(--cover-overhang)"
      overhangClassName="bg-cream"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
        <span className={filterChip(false)}>{categoryEyebrow(post.category)}</span>
        <p className="m-0 type-eyebrow text-white/60">
          <time dateTime={isoDate(post.date)}>{formatBlogDate(post.date)}</time>
          <span aria-hidden className="mx-2.5">·</span>
          {post.readTime} read
        </p>
      </div>

      <figure className="m-0 mt-10 w-full">
        <button
          type="button"
          onClick={onOpenCover}
          aria-label="Enlarge the cover photograph"
          className="relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-card bg-page shadow-[0_30px_60px_rgba(23,21,15,0.18)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold lg:aspect-[21/9]"
        >
          <Image
            src={post.image}
            alt=""
            fill
            preload
            placeholder="blur"
            sizes="(min-width: 1280px) 1232px, calc(100vw - 28px)"
            style={{ objectPosition: heroFocus(post) }}
            className="object-cover"
          />
        </button>
      </figure>
    </PageHero>
  );
}
