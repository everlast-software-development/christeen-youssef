'use client';

import Image from 'next/image';
import { TransitionLink } from '@/components/ui/transition-link';
import { formatBlogDate } from '@/lib/blog-date';
import type { BlogPost } from '@/types';

type BlogCardProps = {
  post: BlogPost;
  /**
   * Passed to next/image. The blog index and the home teaser sit at different
   * widths, so neither can be guessed from inside the card.
   */
  sizes: string;
  /** Above the fold, so worth fetching immediately. */
  eager?: boolean;
};

/**
 * One article, as a photograph you click.
 *
 * At rest it is exactly that — the category, the title and the date over the
 * photograph. The excerpt is held at zero height and unrolls under the date on
 * hover, pushing the rest of the block up as it goes.
 *
 * Shared by the blog index and the home page section rather than written twice:
 * they are the same card, and the copy that drifts first is always the hover
 * choreography. Deliberately carries no entrance animation of its own — the
 * index filters live and re-mounts these as you type, which is the reliable way
 * to leave a card stranded at opacity 0. Whatever animates them belongs to the
 * section that lays them out.
 */
export function BlogCard({ post, sizes, eager = false }: BlogCardProps) {
  return (
    <TransitionLink
      href={`/blog/${post.slug}`}
      className="group relative block aspect-4/5 overflow-hidden rounded-2xl bg-cream-dark"
    >
      <Image
        src={post.image}
        alt=""
        fill
        sizes={sizes}
        placeholder="blur"
        loading={eager ? 'eager' : 'lazy'}
        className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
      />

      {/* Two layers: the base keeps the type legible on any photograph, the
          second deepens on hover. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/55 to-ink/10"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-ink/35 opacity-0 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-100"
      />

      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl ring-1 ring-ink/10 ring-inset transition-colors duration-700 group-hover:ring-gold/30"
      />

      {/* Bottom-anchored, so when the excerpt below claims its height on hover
          everything above is pushed up rather than down out of frame. The extra
          lift is on top of that — the block rises a little further than the
          reveal alone would move it. */}
      <div className="absolute inset-0 flex flex-col justify-end p-7 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1 lg:p-8">
        <span className="mb-4 inline-flex w-fit rounded-full bg-cream/90 px-3 py-1 font-body text-[0.62rem] tracking-[0.16em] text-ink uppercase">
          {post.category}
        </span>

        {/* Clamped rather than cut at a character count: line-clamp ends on the
            last line that fits and adds the ellipsis itself, so it never lands
            mid-word and never depends on knowing the card's width. */}
        <h3 className="line-clamp-3 font-display text-2xl/snug text-cream">
          {post.title}
        </h3>

        <p className="mt-3 font-body text-[0.78rem] tracking-[0.1em] text-cream/60 uppercase">
          {formatBlogDate(post.date)} &middot; {post.readTime}
        </p>

        {/* Held at nothing until the pointer arrives, so the card at rest is a
            photograph with a title on it and nothing else.
            
            max-height rather than a height:auto interpolation or a fixed
            translate. The `grid-rows-[0fr]` trick animates to the real content
            height but is the newest of the three in browser support; a fixed
            translate would need the excerpt's height to be known, and these run
            from one line to three. max-height transitions everywhere, and since
            the copy is clamped at three lines the cap below is always above the
            content — so it governs the timing, never the crop.
            
            Padding, not margin, for the gap: margin sits outside the box
            max-height measures, so it would hold a gap open under the date
            while the panel was shut.
            
            Open on any device that cannot hover. Tailwind's `hover:` is already
            behind `@media (hover: hover)`, so without the counterpart query
            below there is no state a phone can reach that opens this — the
            excerpt would simply never be readable on a touchscreen. Keyed on
            the capability rather than on a width: a narrow window on a desktop
            has a pointer, and a large tablet does not. */}
        <div className="max-h-0 overflow-hidden transition-[max-height] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:max-h-[5.5rem] group-focus-visible:max-h-[5.5rem] [@media(hover:none)]:max-h-[5.5rem]">
          <p className="translate-y-2 line-clamp-3 pt-4 font-body text-[0.88rem]/relaxed text-cream/75 opacity-0 transition-[opacity,transform] delay-100 duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100">
            {post.excerpt}
          </p>
        </div>
      </div>
    </TransitionLink>
  );
}
