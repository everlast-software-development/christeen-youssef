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

      <div className="absolute inset-0 flex flex-col justify-end p-7 lg:p-8">
        <span className="mb-4 inline-flex w-fit rounded-full bg-cream/90 px-3 py-1 font-body text-[0.62rem] tracking-[0.16em] text-ink uppercase">
          {post.category}
        </span>

        {/* Both clamped rather than cut at a character count: line-clamp ends on
            the last line that fits and adds the ellipsis itself, so it never
            lands mid-word and never depends on knowing the card's width. */}
        <h3 className="line-clamp-3 font-display text-2xl/snug text-cream">
          {post.title}
        </h3>

        <p className="mt-3 font-body text-[0.78rem] tracking-[0.1em] text-cream/60 uppercase">
          {formatBlogDate(post.date)} &middot; {post.readTime}
        </p>

        {/* Always on, at a fixed three lines, so the copy occupies the same
            space whether or not the pointer is on it. */}
        <p className="mt-4 line-clamp-3 font-body text-[0.88rem]/relaxed text-cream/75">
          {post.excerpt}
        </p>
      </div>
    </TransitionLink>
  );
}
