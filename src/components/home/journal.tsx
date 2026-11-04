import { Image } from '@/components/ui/image';
import { Eyebrow } from '@/components/site/layout';
import { Button } from '@/components/site/button';
import { TransitionLink } from '@/components/ui/transition-link';
import { blogPosts } from '@/data/blog';
import { byNewest, formatBlogDate } from '@/lib/blog-date';
import { carouselFocus } from '@/lib/blog-image';

const [FEATURED, ...REST] = [...blogPosts].sort(byNewest).slice(0, 4);

const titleCase = (value: string) => value.charAt(0) + value.slice(1).toLowerCase();

/**
 * The newest story large, its title over the photograph; the next three as a
 * ruled list beside it, each with a square thumbnail, category, date and an
 * arrow that steps right on hover.
 */
export function HomeJournal() {
  return (
    <section aria-labelledby="journal-title" className="relative bg-cream py-[clamp(64px,7vw,104px)] text-text">
      <div className="container-site">
        <div className="scroll-rise mb-11 grid items-end gap-x-16 gap-y-5 min-[961px]:grid-cols-2">
          <div className="flex flex-col gap-3.5">
            <Eyebrow>Journal</Eyebrow>
            <h2 id="journal-title" className="m-0 type-h2 text-text">
              Insight, Research &amp; News
            </h2>
          </div>
          <div className="flex flex-col items-start gap-[18px]">
            <p className="m-0 max-w-[500px] type-body text-soft">
              The latest from Dr. Christeen Youssef — conferences, partnerships and
              advances in regenerative dermatology.
            </p>
            <Button href="/blog" variant="outline-dark">
              View all articles
            </Button>
          </div>
        </div>

        <div className="scroll-rise grid items-stretch gap-[clamp(20px,3vw,40px)] min-[961px]:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
          <TransitionLink
            href={`/blog/${FEATURED.slug}`}
            className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[18px] bg-ink text-white shadow-[0_24px_50px_rgba(23,21,15,0.12)] min-[961px]:min-h-[460px]"
          >
            <Image
              src={FEATURED.image}
              alt=""
              fill
              placeholder="blur"
              sizes="(min-width: 961px) 640px, 92vw"
              style={{ objectPosition: carouselFocus(FEATURED) }}
              className="object-cover transition-transform duration-1000 ease-[cubic-bezier(.2,.7,.2,1)] group-hover-fine:scale-[1.04]"
            />
            <span
              aria-hidden
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, rgba(23,21,15,0) 35%, rgba(23,21,15,0.88) 100%)' }}
            />
            <span className="absolute top-[18px] left-[18px] rounded-full bg-cream px-3 py-1 text-[12px] font-semibold text-ink">
              Latest · {titleCase(FEATURED.category)}
            </span>
            <span className="relative flex flex-col gap-2.5 p-[clamp(22px,2.6vw,32px)]">
              <span className="text-[13px] text-[#E6DFD2]">{formatBlogDate(FEATURED.date)}</span>
              <h3 className="m-0 font-display text-[clamp(24px,2.2vw,32px)] leading-[1.2] font-medium text-white">
                {FEATURED.title}
              </h3>
              <span className="text-[14px] font-semibold text-[#E9DFC9]">Read article →</span>
            </span>
          </TransitionLink>

          <ul className="m-0 flex list-none flex-col border-t border-line p-0">
            {REST.map((post) => (
              <li key={post.slug} className="border-b border-line">
                <TransitionLink
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-[120px_minmax(0,1fr)_24px] items-center gap-[18px] py-[18px] transition-[padding] duration-300 hover-fine:pl-2"
                >
                  <span className="relative block aspect-square overflow-hidden rounded-[12px] bg-page">
                    <Image
                      src={post.image}
                      alt=""
                      fill
                      placeholder="blur"
                      sizes="120px"
                      style={{ objectPosition: carouselFocus(post) }}
                      className="object-cover"
                    />
                  </span>
                  <span className="flex flex-col gap-1.5">
                    <span className="text-[12px] font-semibold tracking-[0.08em] text-gold-text uppercase">
                      {post.category}{' '}
                      <span className="font-medium tracking-normal text-caption-strong normal-case">
                        · {formatBlogDate(post.date)}
                      </span>
                    </span>
                    <h3 className="m-0 font-display text-[21px] leading-[1.25] font-medium text-text underline-offset-4 group-hover-fine:underline">
                      {post.title}
                    </h3>
                  </span>
                  <span
                    aria-hidden
                    className="text-[18px] text-caption-strong transition-[translate,color] duration-300 group-hover-fine:translate-x-1 group-hover-fine:text-gold"
                  >
                    →
                  </span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
