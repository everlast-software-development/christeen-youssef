import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { TransitionLink } from '@/components/ui/transition-link';
import { BlogCard } from '@/components/ui/blog-card';
import { ClosingCta } from '@/components/sections/closing-cta';
import { ArticleHero } from '@/components/blog/article-hero';
import { ArticleBody } from '@/components/blog/article-body';
import { ArticleToc } from '@/components/blog/article-toc';
import { ArticleStats } from '@/components/blog/article-stats';
import { ArticleMotion } from '@/components/blog/article-motion';
import { ArticleImages } from '@/components/blog/article-images';
import { cn } from '@/lib/utils';
import { blogPosts } from '@/data/blog';
import { byNewest } from '@/lib/blog-date';
import { parseArticle, tableOfContents } from '@/lib/blog-content';

type Params = { params: Promise<{ slug: string }> };

/** Below this a contents sidebar is furniture rather than navigation. */
const TOC_MIN_ITEMS = 4;

/**
 * Under this many words a piece is a note, not an article, and gets the layout
 * below instead.
 *
 * Four of the nine posts are under this — two of them a single 40-word
 * paragraph. Given the full article frame they read as broken: you scroll past a
 * screen of hero and the piece has ended before the fold, leaving a page of empty
 * cream and a contents rail pointing at nothing. Narrowed, with the closing CTA
 * pulled up behind it, the same 40 words read as deliberate.
 *
 * This is a layout accommodation and not a fix. The two 40-word posts are
 * placeholders and want real copy.
 */
const NOTE_MAX_WORDS = 350;

/** A piece with this many sections is an article whatever its word count. */
const NOTE_MAX_SECTIONS = 3;

/** Cards at the foot of the article. */
const RELATED_COUNT = 3;

// Every post is known at build time, so all of them prerender as static HTML.
export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      images: [
        {
          url: post.image.src,
          width: post.image.width,
          height: post.image.height,
        },
      ],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) notFound();

  const sections = parseArticle(post.content ?? post.excerpt);
  const toc = tableOfContents(sections);

  // Previous and next in reading order, which is chronological — not the file
  // order the index leads with.
  const ordered = [...blogPosts].sort(byNewest);
  const position = ordered.findIndex((entry) => entry.slug === post.slug);
  const newer = position > 0 ? ordered[position - 1] : null;
  const older =
    position < ordered.length - 1 ? ordered[position + 1] : null;

  // Same category first, because the categories here are genuinely different
  // kinds of writing — a reader who came for a conference talk wants another
  // talk, not a patient story. Topped up with whatever is newest.
  const related = [
    ...ordered.filter(
      (entry) => entry.slug !== post.slug && entry.category === post.category,
    ),
    ...ordered.filter(
      (entry) => entry.slug !== post.slug && entry.category !== post.category,
    ),
  ].slice(0, RELATED_COUNT);

  const words = (post.content ?? post.excerpt).trim().split(/\s+/).length;

  // Short *and* unstructured. A ~330-word piece can still carry four real
  // sections, and on length alone it would have been demoted to a note —
  // structure is the better test of whether something is an article, so both
  // have to be true.
  const isNote = words < NOTE_MAX_WORDS && toc.length < NOTE_MAX_SECTIONS;

  const images = post.gallery ?? [];

  // Two columns whenever there is something to put in the second one. A note is
  // too short to carry a side column, so its images stack under the copy.
  const twoColumn = !isNote && images.length > 0;

  // A note is never long enough to need a contents rail, whatever its heading
  // count. Nor is an article with pictures: the rail and the images want the
  // same side of the page, and three columns is not the simple layout this is.
  // Stated here rather than left to CSS, so a post with both never silently
  // drops one of them.
  const showToc = !isNote && !twoColumn && toc.length >= TOC_MIN_ITEMS;

  return (
    <main className="bg-cream text-ink">
      <ArticleHero post={post} />

      {post.stats && post.stats.length > 0 && (
        <ArticleMotion>
          <ArticleStats stats={post.stats} />
        </ArticleMotion>
      )}

      {/* One wrapper around copy and pictures both, so a single GSAP context
          covers them and the images are part of the same sequence. */}
      <ArticleMotion>
        <div
          className={
            isNote
              ? 'mx-auto max-w-7xl px-5 pt-16 pb-16 md:px-8 lg:px-12 lg:pt-24 xl:px-20'
              : 'mx-auto max-w-7xl px-5 pt-16 pb-24 md:px-8 lg:px-12 lg:pt-24 lg:pb-32 xl:px-20'
          }
        >
          <div
            className={cn(
              showToc &&
                'grid gap-12 xl:grid-cols-[15rem_minmax(0,1fr)] xl:gap-20',
              // Copy left, pictures right. The image column is capped rather
              // than left as 1fr: the space beside a 68ch measure on a wide
              // screen is close to 500px, and a portrait photograph that wide
              // runs to 750 tall. Only a grid from lg — below it the two are
              // simply one block after the other, at full width.
              twoColumn &&
                'lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16',
            )}
          >
            {showToc && <ArticleToc items={toc} />}

            {/* A measure, not the column width: body copy stops being readable
                somewhere around 75 characters however much room is going. A
                note takes a narrower one still and sits centred, because there
                is no sidebar and no length to give the page a spine. */}
            <article
              className={isNote ? 'mx-auto max-w-[58ch]' : 'max-w-[68ch]'}
            >
              <ArticleBody sections={sections} figures={post.figures} />
            </article>

            {images.length > 0 && <ArticleImages images={images} />}
          </div>
        </div>
      </ArticleMotion>

      {/* ---------------- Previous / next ---------------- */}
      {(newer || older) && (
        <nav
          aria-label="More articles"
          className="mx-auto max-w-7xl border-t border-ink/10 px-5 py-14 md:px-8 lg:px-12 xl:px-20"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            {older ? (
              <TransitionLink
                href={`/blog/${older.slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-ink/10 p-6 transition-colors hover:border-gold/40"
              >
                <span className="inline-flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] text-slate/70 uppercase">
                  <ArrowLeft aria-hidden className="size-3.5" />
                  Earlier
                </span>
                <span className="font-display text-lg/snug text-ink transition-colors group-hover:text-gold-dark">
                  {older.title}
                </span>
              </TransitionLink>
            ) : (
              <span />
            )}

            {newer && (
              <TransitionLink
                href={`/blog/${newer.slug}`}
                className="group flex flex-col items-end gap-3 rounded-2xl border border-ink/10 p-6 text-right transition-colors hover:border-gold/40 sm:col-start-2"
              >
                <span className="inline-flex items-center gap-2 font-body text-[0.68rem] tracking-[0.18em] text-slate/70 uppercase">
                  Later
                  <ArrowRight aria-hidden className="size-3.5" />
                </span>
                <span className="font-display text-lg/snug text-ink transition-colors group-hover:text-gold-dark">
                  {newer.title}
                </span>
              </TransitionLink>
            )}
          </div>
        </nav>
      )}

      {/* ---------------- Related ---------------- */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-24 md:px-8 lg:px-12 lg:pb-32 xl:px-20">
          <div className="flex items-center gap-6">
            <h2 className="shrink-0 font-display text-display-sm text-ink">
              Keep reading
            </h2>
            <span aria-hidden className="h-px flex-1 bg-ink/12" />
          </div>

          <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {related.map((entry) => (
              <BlogCard
                key={entry.slug}
                post={entry}
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 46vw, 90vw"
              />
            ))}
          </div>

          <ClosingCta
            title="Every result starts with a conversation"
            body="No two cases are alike. A consultation is where the plan gets built around your skin, your history and what you actually want from treatment."
            href="/reach-me"
            label="Let's talk"
          />
        </section>
      )}
    </main>
  );
}
