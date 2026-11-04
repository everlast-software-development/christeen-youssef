/**
 * The figures that carry a piece, lifted out of the prose — set in the article
 * column under the cover, so they share its edges.
 *
 * Only rendered where `post.stats` exists. A band of invented numbers would be
 * worse than no band, so the field is authored rather than derived.
 */
export function ArticleStats({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <section aria-label="Key figures" className="my-10 border-y border-line">
      <dl className="m-0 grid gap-x-8 gap-y-8 py-8 sm:grid-cols-2">
        {stats.map((stat) => (
          <div key={stat.label} data-reveal>
            <dt className="sr-only">{stat.label}</dt>
            <dd className="m-0">
              <span className="block type-stat text-ink tabular-nums">{stat.value}</span>
              <span className="mt-2 block max-w-[30ch] type-small text-soft">{stat.label}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
