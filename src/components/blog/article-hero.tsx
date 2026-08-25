import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import { TransitionLink } from '@/components/ui/transition-link';
import { formatBlogDate } from '@/lib/blog-date';
import type { BlogPost } from '@/types';

type HeroVariant = 'image' | 'split' | 'editorial';

/**
 * What each category is, and how its articles open.
 *
 * Three openings rather than one, because the eight posts are not one kind of
 * thing: a TV appearance and a peer-reviewed consensus paper want opposite
 * treatments. A television segment or a patient story leads with the picture; a
 * conference talk or a teaching course sets the title against it; a published
 * paper leads with the type, because its image is a journal page and putting it
 * full-bleed would oversell it.
 */
const CATEGORY_META: Record<string, { eyebrow: string; variant: HeroVariant }> =
  {
    CONFERENCE: { eyebrow: 'From the podium', variant: 'split' },
    MEDIA: { eyebrow: 'In the press', variant: 'image' },
    RESEARCH: { eyebrow: 'Published research', variant: 'editorial' },
    TESTIMONIAL: { eyebrow: 'Patient story', variant: 'image' },
    WORKSHOP: { eyebrow: 'Teaching', variant: 'split' },
  };

export function categoryMeta(category: string) {
  return (
    CATEGORY_META[category] ?? { eyebrow: category, variant: 'split' as const }
  );
}

function BackLink({ onDark = false }: { onDark?: boolean }) {
  return (
    <TransitionLink
      href="/blog"
      className={`inline-flex items-center gap-2 font-body text-[0.8rem] tracking-[0.1em] uppercase transition-colors ${
        onDark
          ? 'text-cream/70 hover:text-gold'
          : 'text-slate hover:text-gold-dark'
      }`}
    >
      <ArrowLeft aria-hidden className="size-4" />
      All articles
    </TransitionLink>
  );
}

function Meta({
  post,
  eyebrow,
  onDark = false,
}: {
  post: BlogPost;
  eyebrow: string;
  onDark?: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      <span
        className={`rounded-full px-3 py-1 font-body text-[0.62rem] tracking-[0.18em] uppercase ${
          onDark ? 'bg-cream/15 text-cream' : 'bg-ink/5 text-gold-dark'
        }`}
      >
        {eyebrow}
      </span>
      <span
        className={`font-body text-[0.78rem] tracking-[0.1em] uppercase ${
          onDark ? 'text-cream/60' : 'text-slate/80'
        }`}
      >
        {formatBlogDate(post.date)} &middot; {post.readTime} read
      </span>
    </div>
  );
}

export function ArticleHero({ post }: { post: BlogPost }) {
  const { eyebrow, variant } = categoryMeta(post.category);

  // ---- Image-led: the photograph is the story ----
  if (variant === 'image') {
    return (
      <header
        // Inverts the fixed header while this dark hero is under it.
        data-header-surface="dark"
        className="relative isolate flex min-h-[85svh] items-end overflow-hidden bg-ink"
      >
        <Image
          src={post.image}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="object-cover"
        />

        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/60 to-ink/35"
        />

        <div className="relative mx-auto w-full max-w-5xl px-5 pt-32 pb-16 md:px-8 lg:px-12 lg:pb-24">
          <BackLink onDark />

          <div className="mt-10">
            <Meta post={post} eyebrow={eyebrow} onDark />
          </div>

          <h1 className="mt-6 max-w-[26ch] font-display text-display-lg text-cream">
            {post.title}
          </h1>

          <p className="mt-6 max-w-2xl font-body text-[1.02rem]/relaxed text-cream/75">
            {post.excerpt}
          </p>
        </div>
      </header>
    );
  }

  // ---- Editorial: type first, artwork demoted to a band ----
  if (variant === 'editorial') {
    return (
      <header className="relative bg-cream pt-32 lg:pt-40">
        <div className="mx-auto max-w-4xl px-5 md:px-8 lg:px-12">
          <BackLink />

          <div className="mt-10">
            <Meta post={post} eyebrow={eyebrow} />
          </div>

          <h1 className="mt-6 font-display text-display-md text-ink">
            {post.title}
          </h1>

          <div
            aria-hidden
            className="mt-8 h-px w-24 origin-left bg-gradient-gold"
          />

          <p className="mt-8 max-w-2xl font-body text-[1.02rem]/relaxed text-slate">
            {post.excerpt}
          </p>
        </div>

        {/* A band, not a bleed. This one is a journal page — at full height it
            would read as a photograph the article is about. */}
        <div className="mx-auto mt-14 max-w-6xl px-5 md:px-8 lg:px-12">
          <div className="relative aspect-21/9 overflow-hidden rounded-2xl bg-cream-dark">
            <Image
              src={post.image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 72rem, 100vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </div>
      </header>
    );
  }

  // ---- Split: title set against the image ----
  return (
    <header className="relative bg-cream pt-32 lg:pt-40">
      <div className="mx-auto max-w-7xl px-5 md:px-8 lg:px-12 xl:px-20">
        <BackLink />

        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-center lg:gap-16">
          <div>
            <Meta post={post} eyebrow={eyebrow} />

            <h1 className="mt-6 font-display text-display-md text-ink">
              {post.title}
            </h1>

            <div
              aria-hidden
              className="mt-8 h-px w-24 origin-left bg-gradient-gold"
            />

            <p className="mt-8 font-body text-[1.02rem]/relaxed text-slate">
              {post.excerpt}
            </p>
          </div>

          <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-cream-dark lg:aspect-square">
            <Image
              src={post.image}
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 90vw"
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
