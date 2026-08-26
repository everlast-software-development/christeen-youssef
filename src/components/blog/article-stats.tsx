/**
 * The figures that carry a piece, lifted out of the prose.
 *
 * The ISDS talk states the scale of the problem — 250 million surgical
 * incisions, twenty billion dollars a year, ten million people with keloids —
 * across two paragraphs of running text, where they are the most arresting thing
 * in the article and also the easiest to skim past. As a band under the hero they
 * are the first thing read after the title.
 *
 * Only rendered where `post.stats` exists, which is two of the nine posts. A
 * band of invented numbers would be worse than no band, so the field is authored
 * rather than derived.
 */
export function ArticleStats({
  stats,
}: {
  stats: { value: string; label: string }[];
}) {
  return (
    <section
      aria-label="Key figures"
      className="border-y border-ink/8 bg-cream-dark/40"
    >
      <dl className="mx-auto grid max-w-7xl gap-y-10 px-5 py-14 sm:grid-cols-2 md:px-8 lg:grid-cols-4 lg:gap-x-8 lg:px-12 xl:px-20">
        {stats.map((stat) => (
          <div key={stat.label} data-reveal className="lg:px-2">
            <dt className="sr-only">{stat.label}</dt>

            {/* The number carries the display face and the gold; the label under
                it stays small and quiet, so a row of four scans as four numbers
                rather than as four paragraphs. */}
            <dd>
              <span className="block font-display text-4xl/none text-gold-dark tabular-nums lg:text-5xl/none">
                {stat.value}
              </span>
              <span className="mt-3 block max-w-[22ch] font-body text-[0.86rem]/relaxed text-slate">
                {stat.label}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
