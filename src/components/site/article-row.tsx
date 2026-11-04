import { ArticleCard } from '@/components/site/article-card';
import type { BlogPost } from '@/types';
import { cn } from '@/lib/utils';

/**
 * Framed article cards: a three-column grid from md up, and below that a
 * horizontal swipe row — 80% card width with scroll-snap, so the next card
 * always peeks in from the right and says there is more.
 */
export function ArticleRow({
  posts,
  headingLevel = 'h3',
  variant = 'default',
  className,
}: {
  posts: BlogPost[];
  headingLevel?: 'h2' | 'h3';
  /** `home`: the reference card, three across above 960px, swipe below. */
  variant?: 'default' | 'home';
  className?: string;
}) {
  const home = variant === 'home';

  return (
    <div className={className}>
      <ul
        data-reveal-group
        className={cn(
          'no-scrollbar -mx-[var(--gutter)] flex snap-x snap-mandatory overflow-x-auto px-[var(--gutter)] [scroll-padding-inline:var(--gutter)]',
          home
            ? 'gap-3.5 pt-1 pb-2 min-[961px]:mx-0 min-[961px]:grid min-[961px]:grid-cols-3 min-[961px]:gap-5 min-[961px]:overflow-visible min-[961px]:p-0'
            : 'gap-4 md:mx-0 md:grid md:grid-cols-2 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-3',
        )}
      >
        {posts.map((post) => (
          <li
            key={post.slug}
            data-reveal-item
            className={cn('w-[80%] shrink-0 snap-start', home ? 'min-[961px]:w-auto' : 'md:w-auto')}
          >
            <ArticleCard
              post={post}
              headingLevel={headingLevel}
              variant={variant}
              sizes="(min-width: 1024px) 26rem, (min-width: 768px) 45vw, 78vw"
            />
          </li>
        ))}
      </ul>
      {posts.length > 1 && (
        <p
          aria-hidden
          className={cn(
            'type-small text-caption-strong',
            home ? 'mt-4 min-[961px]:hidden' : 'mt-5 font-semibold md:hidden',
          )}
        >
          Swipe to see more →
        </p>
      )}
    </div>
  );
}
