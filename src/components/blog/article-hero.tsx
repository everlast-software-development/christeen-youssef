import { PageHero } from '@/components/site/page-hero';
import { filterChip } from '@/components/site/filter-chips';
import { formatBlogDate } from '@/lib/blog-date';
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
 * lines on desktop), then the category as a chip with the date and read time
 * beside it. The cover photograph opens the article column below.
 */
export function ArticleHero({ post }: { post: BlogPost }) {
  return (
    <PageHero
      section="/blog"
      page={{ label: post.title, href: `/blog/${post.slug}` }}
      title={post.title}
      // 34ch, not 24: at 24ch half of these headlines run to four or five
      // lines; at 34 all but the 108-character SVF title hold to three.
      titleClassName="mx-auto max-w-[34ch] font-display text-[length:clamp(2.25rem,4.2vw,3.5rem)] leading-[1.08] font-medium"
    >
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
        <span className={filterChip(false)}>{categoryEyebrow(post.category)}</span>
        <p className="m-0 type-eyebrow text-white/60">
          <time dateTime={isoDate(post.date)}>{formatBlogDate(post.date)}</time>
          <span aria-hidden className="mx-2.5">·</span>
          {post.readTime} read
        </p>
      </div>
    </PageHero>
  );
}
