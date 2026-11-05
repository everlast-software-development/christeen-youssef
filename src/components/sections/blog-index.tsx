import { useEffect, useMemo, useRef, useState } from 'react';
import { Image } from '@/components/ui/image';
import { setBlogFilters, useBlogFilters } from '@/components/layout/blog-filters';
import { BlogHero } from '@/components/blog/blog-hero';
import { Container, Section } from '@/components/site/layout';
import { Button } from '@/components/site/button';
import { ArrowRight } from 'lucide-react';
import { ArticleCard, categoryLabel } from '@/components/site/article-card';
import { TransitionLink } from '@/components/ui/transition-link';
import { blogPosts } from '@/data/blog';
import { byNewest, formatBlogDate } from '@/lib/blog-date';
import { heroFocus } from '@/lib/blog-image';

const PAGE_SIZE = 8;

// The post the listing used to open on — first in the data, not newest.
const FEATURED = blogPosts[0];

const CATEGORIES = [...new Set(blogPosts.map((post) => post.category))];
const CATEGORY_VALUES = CATEGORIES.map((category) => category.toLowerCase());

export function BlogIndex() {
  // Search term and category, from the URL (?q=…&category=…); the hero's
  // search and chips write them, and the listing below follows.
  const filters = useBlogFilters(CATEGORY_VALUES);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const needle = filters.q.trim().toLowerCase();
  const filtered = Boolean(needle || filters.category);
  // Paging is keyed to this, so any change of filter starts back at one page.
  const query = `${needle}|${filters.category}`;

  const chronological = useMemo(() => [...blogPosts].sort(byNewest), []);

  // Every article the filters allow, the featured one included.
  const matches = useMemo(
    () =>
      chronological.filter(
        (post) =>
          (!filters.category || post.category.toLowerCase() === filters.category) &&
          (!needle ||
            [post.title, post.excerpt, post.category].some((field) =>
              field.toLowerCase().includes(needle),
            )),
      ),
    [chronological, needle, filters.category],
  );

  // Unfiltered, the featured article has its own panel above the grid.
  const results = filtered ? matches : matches.filter((post) => post.slug !== FEATURED.slug);
  const clearAll = () => setBlogFilters({ q: '', category: '' }, filters);
  const activeCategory = CATEGORIES.find((category) => category.toLowerCase() === filters.category);

  // Paging is keyed to the query, so a new filter starts back at one page.
  const [page, setPage] = useState({ query, count: PAGE_SIZE });
  const visible = page.query === query ? page.count : PAGE_SIZE;

  const shown = results.slice(0, visible);
  const more = visible < results.length;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPage({ query, count: visible + PAGE_SIZE });
        }
      },
      { rootMargin: '800px 0px' },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [visible, more, query]);

  return (
    <main id="content">
      <BlogHero filters={filters} categories={CATEGORIES} count={matches.length} />

      {!filtered && (
        <Section tone="page" aria-label="Featured article" className="pb-0">
          <Container>
            <article
              data-reveal
              className="group relative grid items-center gap-8 rounded-[16px] border border-line bg-cream p-2.5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-12"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-[12px] bg-cream">
                <Image
                  src={FEATURED.image}
                  alt=""
                  fill
                  priority
                  placeholder="blur"
                  sizes="(min-width: 1024px) 42rem, 92vw"
                  style={{ objectPosition: heroFocus(FEATURED) }}
                  className="object-cover transition-transform duration-700 ease-[var(--ease-brand)] group-hover-fine:scale-[1.04]"
                />
              </div>
              <div className="px-4 pb-6 lg:px-0 lg:pr-10 lg:pb-0">
                <span className="inline-flex rounded-full bg-cream px-3 py-1 type-eyebrow text-ink uppercase">
                  {categoryLabel(FEATURED.category)}
                </span>
                <h2 className="mt-5 type-h2 text-ink">
                  <TransitionLink
                    href={`/blog/${FEATURED.slug}`}
                    className="after:absolute after:inset-0 after:rounded-[16px] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-gold"
                  >
                    {FEATURED.title}
                  </TransitionLink>
                </h2>
                <p className="mt-4 line-clamp-3 type-body text-soft">
                  {FEATURED.excerpt}
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
                  <span className="type-small text-caption-strong">
                    {formatBlogDate(FEATURED.date)} · {FEATURED.readTime} read
                  </span>
                  <span
                    aria-hidden
                    className="inline-flex items-center gap-2 type-button text-ink underline decoration-ink/30 decoration-1 underline-offset-[6px] group-hover-fine:decoration-gold"
                  >
                    Read
                    <ArrowRight strokeWidth={1.8} className="size-[15px] transition-transform group-hover-fine:translate-x-1" />
                  </span>
                </div>
              </div>
            </article>
          </Container>
        </Section>
      )}

      <Section tone="page">
        <Container>
          <h2 className="type-h2 text-ink">
            {needle
              ? 'Search results'
              : activeCategory
                ? categoryLabel(activeCategory)
                : 'All articles'}
          </h2>

          {results.length === 0 ? (
            <div className="mx-auto mt-12 flex max-w-[440px] flex-col items-center gap-5 py-10 text-center">
              <p className="m-0 type-body text-soft">
                No articles match{needle ? <> &ldquo;{filters.q.trim()}&rdquo;</> : null}
                {activeCategory ? <> in {categoryLabel(activeCategory)}</> : null}. Try
                another word, or see everything.
              </p>
              <Button variant="outline-dark" arrow="none" onClick={clearAll}>
                Clear filters
              </Button>
            </div>
          ) : (
            <>
              <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {shown.map((post) => (
                  <li key={post.slug}>
                    <ArticleCard
                      post={post}
                      sizes="(min-width: 1024px) 24rem, (min-width: 768px) 45vw, 92vw"
                    />
                  </li>
                ))}
              </ul>

              {/* Rendered only while there is more to load, so reaching the
                  end disconnects the observer. */}
              {more && (
                <div ref={sentinelRef} className="flex items-center justify-center pt-14">
                  <span
                    aria-hidden
                    className="size-5 animate-spin rounded-full border-2 border-ink/15 border-t-gold"
                  />
                </div>
              )}
            </>
          )}

          <p aria-live="polite" className="sr-only">
            Showing {shown.length} of {results.length} articles
          </p>
        </Container>
      </Section>

    </main>
  );
}
