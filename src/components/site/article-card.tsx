import { Image } from '@/components/ui/image';
import { ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/transition-link';
import { formatBlogDate } from '@/lib/blog-date';
import { carouselFocus } from '@/lib/blog-image';
import type { BlogPost } from '@/types';
import { cn } from '@/lib/utils';

/** Category names arrive upper-case in the data; shown in title case. */
export function categoryLabel(category: string) {
  return category.charAt(0) + category.slice(1).toLowerCase();
}

/**
 * The framed journal card: white, hairline border, 10px of mat around a 16:10
 * image, then the title and a meta row. The whole card is one link.
 *
 * `variant="home"` is the home page's reference card: the category chip in
 * sentence case, a 22px title and a shorter meta line.
 */
export function ArticleCard({
  post,
  sizes,
  priority = false,
  headingLevel = 'h3',
  variant = 'default',
  className,
}: {
  post: BlogPost;
  sizes: string;
  priority?: boolean;
  headingLevel?: 'h2' | 'h3';
  variant?: 'default' | 'home';
  className?: string;
}) {
  const Heading = headingLevel;
  const home = variant === 'home';

  return (
    <article
      className={cn(
        'group relative flex h-full flex-col rounded-[16px] border border-line bg-cream p-2.5 transition-[box-shadow,transform] duration-500 ease-[var(--ease-brand)] hover-fine:-translate-y-1',
        home
          ? 'duration-[350ms] hover-fine:shadow-[0_18px_40px_rgba(23,21,15,0.08)]'
          : 'hover-fine:shadow-[0_24px_50px_-30px_rgba(23,21,15,0.35)]',
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-cream">
        <Image
          src={post.image}
          alt=""
          fill
          sizes={sizes}
          priority={priority}
          placeholder="blur"
          style={{ objectPosition: carouselFocus(post) }}
          className="object-cover transition-transform duration-700 ease-[var(--ease-brand)] group-hover-fine:scale-[1.05]"
        />
        <span
          className={cn(
            'absolute top-3 left-3 rounded-full px-3 py-1 font-semibold text-ink',
            home
              ? 'bg-cream type-small'
              : 'bg-cream type-eyebrow',
          )}
        >
          {categoryLabel(post.category)}
        </span>
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col',
          home ? 'gap-3.5 px-2.5 pt-[18px] pb-2' : 'px-2.5 pt-5 pb-2.5',
        )}
      >
        <Heading
          className={cn(
            'text-ink',
            home
              ? 'm-0 flex-1 type-h3'
              : 'mb-3 line-clamp-3 type-h3',
          )}
        >
          <TransitionLink
            href={`/blog/${post.slug}`}
            className="after:absolute after:inset-0 after:rounded-[16px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-gold"
          >
            {post.title}
          </TransitionLink>
        </Heading>

        <p className={cn('m-0 line-clamp-2 type-small text-soft', home ? '' : 'mb-5')}>{post.excerpt}</p>

        <div
          className={cn(
            'mt-auto flex items-center justify-between gap-4 border-t border-line type-small text-caption-strong',
            home ? 'pt-3.5' : 'pt-4',
          )}
        >
          <span>
            {formatBlogDate(post.date)} · {post.readTime}
            {!home && ' read'}
          </span>
          <span
            aria-hidden
            className="inline-flex items-center gap-1.5 font-semibold text-ink"
          >
            Read
            <ArrowRight
              strokeWidth={1.8}
              className="size-[15px] transition-transform duration-300 group-hover-fine:translate-x-1"
            />
          </span>
        </div>
      </div>
    </article>
  );
}
