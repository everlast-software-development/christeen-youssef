import Image from 'next/image';
import { ArrowLeft, ArrowDown } from 'lucide-react';
import { TransitionLink } from '@/components/ui/transition-link';
import { formatBlogDate } from '@/lib/blog-date';
import { heroFocus } from '@/lib/blog-image';
import type { BlogPost } from '@/types';

/**
 * What each category is called at the top of its articles.
 *
 * It used to carry a `variant` as well, and each category opened differently —
 * a television segment led with the picture, a conference talk set the title
 * against it, a published paper led with the type. Three openings is three
 * things to maintain and, more to the point, it meant the nine articles did not
 * read as one publication. The eyebrow is enough to say what kind of piece this
 * is; the frame is now the same for all of them.
 */
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
 * How a title is set, by how long it is.
 *
 * These nine run from 33 to 131 characters — a fourfold spread — and one setting
 * cannot serve both ends. At display-lg in a 26ch measure the ISDS title wrapped
 * to five lines of 132px and came to roughly 660px of type before the standfirst
 * even started.
 *
 * Both halves of that matter. The long titles step down in size *and* out to a
 * wider measure, because narrowing a long title is what turns it into a column;
 * widening it is what gets it back to three or four lines.
 *
 * The leading is explicit at every step and always tight. Tailwind's
 * `--text-display-*` tokens carry no paired line-height, so display type
 * inherits the 1.5 that Preflight puts on <html> — fine for body copy, far too
 * loose at 5.5rem. Set here rather than on the tokens themselves: those tokens
 * are used by the home page, the About page and every section heading on the
 * site, and retuning them is a separate decision from fixing this hero.
 */
function titleClass(title: string) {
  const length = title.length;

  if (length <= 60) return 'max-w-[20ch] text-display-lg/[1.02]';
  if (length <= 100) return 'max-w-[26ch] text-display-md/[1.06]';

  return 'max-w-[36ch] text-[clamp(1.9rem,1.25rem+2.3vw,3.1rem)]/[1.12]';
}

/**
 * One opening for every article: the photograph edge to edge, held under a deep
 * scrim, with the type stacked along the bottom.
 *
 * It is the listing carousel, stopped. Clicking a slide there lands you on the
 * same frame here — same crop, same scrim, same drift — which is the whole
 * reason for choosing this shape over an editorial one.
 *
 * The known cost: one of these images is a journal page rather than a
 * photograph, and at this size it is texture rather than a document. That is the
 * trade for having a single frame, and the scrim is heavy enough that it reads
 * as intended rather than as a mistake.
 */
export function ArticleHero({ post }: { post: BlogPost }) {
  return (
    <header
      // Inverts the fixed header while this dark frame is under it.
      data-header-surface="dark"
      // min-h, not h, at lg too. A fixed height with `justify-end` and
      // overflow-hidden clips out of the top, and 78svh of a short landscape
      // window (1024x600) leaves 260px for a title block that needs 332 — the
      // eyebrow and the first line would go off the top. Growing costs nothing
      // here: the image is absolute inset-0, so a taller frame is just more
      // photograph.
      className="relative isolate flex min-h-[34rem] flex-col justify-end overflow-hidden bg-ink lg:min-h-[78svh]"
    >
      {/* The drift. A wrapper element rather than a transform on the Image
          itself, so next/image keeps its own sizing untouched. */}
      <div data-hero-image className="absolute inset-0">
        <Image
          src={post.image}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          // Per post — see heroFocus. The carousel slide this frame continues
          // reads the same value, so the crop survives the click.
          style={{ objectPosition: heroFocus(post) }}
          className="object-cover"
        />
      </div>

      {/* Two scrims: one up from the base to carry the type, one in from the
          left so the title holds against a bright edge. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/25"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/20 to-transparent"
      />

      {/* No measure and no centring: the type starts at the page gutter and
          runs from there. It was `mx-auto max-w-7xl`, which on a wide screen
          left the whole block floating in the middle of a full-bleed
          photograph — the frame is edge to edge, so the type sitting inside a
          centred 80rem column is what read as a container.
      
          The gutters stay. They are not a measure, they are what keeps the
          title off the edge of the screen; the title's own width is set by
          titleClass. */}
      <div className="relative w-full px-5 pt-32 pb-16 md:px-8 lg:px-12 lg:pb-20 xl:px-20">
        <TransitionLink
          href="/blog"
          className="inline-flex items-center gap-2 font-body text-[0.8rem] tracking-[0.1em] text-cream/70 uppercase transition-colors hover:text-gold"
        >
          <ArrowLeft aria-hidden className="size-4" />
          All articles
        </TransitionLink>

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="rounded-full border border-cream/20 bg-cream/10 px-3.5 py-1.5 font-body text-[0.62rem] tracking-[0.18em] text-cream uppercase backdrop-blur-sm">
            {categoryEyebrow(post.category)}
          </span>
          <span className="font-body text-[0.78rem] tracking-[0.12em] text-cream/60 uppercase">
            {formatBlogDate(post.date)}
            <span aria-hidden className="mx-3 text-cream/30">
              &mdash;
            </span>
            {post.readTime} read
          </span>
        </div>

        {/* A measure in characters, not a column width — see titleClass. */}
        <h1
          data-hero-title
          className={`mt-6 font-display text-cream ${titleClass(post.title)}`}
        >
          {post.title}
        </h1>

        <div
          aria-hidden
          className="mt-8 h-px w-24 origin-left bg-gradient-gold"
        />

        {/* The excerpt used to sit here. It was the other half of "too much":
            on the long posts the hero carried a 131-character title and then
            restated it in a two-line standfirst underneath. It has not gone
            anywhere — it is the listing card's copy, the search index, the
            description in <meta> and the Open Graph card, and the article's own
            opening paragraph is now set as a lead. Saying it a fourth time, at
            the top, was the one place it earned the least. */}
      </div>

      {/* Only where the frame is tall enough for there to be something below
          the fold worth pointing at. */}
      <div
        aria-hidden
        className="absolute right-5 bottom-8 hidden text-cream/40 md:right-8 lg:block xl:right-20"
      >
        <ArrowDown className="size-5 animate-bounce" />
      </div>
    </header>
  );
}
