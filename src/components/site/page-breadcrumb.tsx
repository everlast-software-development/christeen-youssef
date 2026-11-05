import { Fragment } from 'react';
import { ChevronRight } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { TransitionLink } from '@/components/ui/transition-link';
import { navigationItems } from '@/data/navigation';
import { SITE_URL } from '@/lib/site';
import { cn } from '@/lib/utils';

type Crumb = { label: string; href: string };

const fromNav = (href: string): Crumb => {
  const item = navigationItems.find((entry) => entry.href === href);
  if (!item) throw new Error(`PageBreadcrumb: "${href}" is not in the navigation data.`);
  return { label: item.label, href: item.href };
};

/** Cut at a word boundary to at most `max` characters, with an ellipsis. */
function shorten(text: string, max = 40) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const space = cut.lastIndexOf(' ');
  return `${(space > max * 0.6 ? cut.slice(0, space) : cut).replace(/[\s,.:;–—-]+$/, '')}…`;
}

const TONE = {
  dark: {
    link: 'text-eyebrow-dark/70 hover-fine:text-eyebrow-dark',
    page: 'text-eyebrow-dark',
    separator: 'text-white/30',
  },
  light: {
    link: 'text-caption-strong hover-fine:text-ink',
    page: 'text-ink',
    separator: 'text-caption',
  },
} as const;

/**
 * The trail at the top of every inner page, where the type-eyebrow used to sit:
 * Home / section, or Home / Blog / post for an article. Labels and hrefs come
 * from the header's navigation data so the two can never disagree, and the
 * same items feed the schema.org BreadcrumbList rendered alongside it.
 */
export function PageBreadcrumb({
  section,
  page,
  tone = 'dark',
  align = 'left',
  className,
}: {
  /** The section's href as it appears in the navigation data, e.g. "/about-me". */
  section: string;
  /** A page below the section — a blog post. Its label is shortened on screen. */
  page?: Crumb;
  tone?: keyof typeof TONE;
  align?: 'left' | 'center';
  className?: string;
}) {
  const crumbs = [fromNav('/'), fromNav(section), ...(page ? [page] : [])];
  const colours = TONE[tone];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      item: new URL(crumb.href, SITE_URL).toString(),
    })),
  };

  return (
    <>
      <Breadcrumb className={cn('max-w-full', className)}>
        <BreadcrumbList
          className={cn(
            // One line, always: the hero's title sits at the same height on every
            // page, so the trail never wraps — a long post title is cut with an
            // ellipsis instead.
            'type-eyebrow max-w-full flex-nowrap gap-0',
            align === 'center' && 'justify-center',
          )}
        >
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <Fragment key={crumb.href}>
                {index > 0 && (
                  <BreadcrumbSeparator className={cn('mx-2.5 shrink-0 [&>svg]:size-3', colours.separator)}>
                    <ChevronRight strokeWidth={2} />
                  </BreadcrumbSeparator>
                )}
                <BreadcrumbItem className={cn(last ? 'min-w-0' : 'shrink-0')}>
                  {last ? (
                    <BreadcrumbPage className={cn('block truncate font-semibold', colours.page)}>
                      {page ? shorten(crumb.label) : crumb.label}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink
                      render={<TransitionLink href={crumb.href} />}
                      className={cn(
                        'tap-target relative rounded-sm underline-offset-4 transition-colors duration-200 hover-fine:underline hover-fine:decoration-gold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold',
                        colours.link,
                      )}
                    >
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
      <script
        type="application/ld+json"
        // Escape "<" so a title can never close the script element.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
