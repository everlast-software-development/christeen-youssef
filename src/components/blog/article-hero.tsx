import { Image } from '@/components/ui/image';
import { PageHero } from '@/components/site/page-hero';
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

/**
 * An article's opening: the shared inner-page hero — breadcrumb to the post,
 * the title, and the category, date and read time as its slot — then the
 * photograph, wider than the text, on the cream page beneath it.
 */
export function ArticleHero({ post }: { post: BlogPost }) {
  const meta = [categoryEyebrow(post.category), formatBlogDate(post.date), `${post.readTime} read`];

  return (
    <>
      <PageHero
        section="/blog"
        page={{ label: post.title, href: `/blog/${post.slug}` }}
        title={post.title}
      >
        <p className="m-0 flex flex-wrap items-center justify-center gap-y-1 type-eyebrow text-white/60">
          {meta.map((item, index) => (
            <span key={item} className="flex items-center">
              {index > 0 && (
                <span aria-hidden className="mx-3 size-1 rounded-full bg-gold" />
              )}
              {item}
            </span>
          ))}
        </p>
      </PageHero>

      <div className="container-site pt-[clamp(40px,5vw,64px)]">
        <div className="animate-fade-up relative mx-auto aspect-[16/9] max-w-[1040px] overflow-hidden rounded-[16px] bg-page">
          <Image
            src={post.image}
            alt=""
            fill
            preload
            sizes="(min-width: 1100px) 1040px, 94vw"
            placeholder="blur"
            style={{ objectPosition: heroFocus(post) }}
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
}
