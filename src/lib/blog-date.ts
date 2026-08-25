import type { BlogPost } from '@/types';

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Dates in data/blog.ts are `DD/MM/YYYY` strings, which no Date constructor
 * parses the same way twice — `new Date('22/10/2025')` is invalid, and the US
 * reading of `01/06/2025` is a different month from the one intended. So they
 * are taken apart by hand.
 */
export function parseBlogDate(value: string) {
  const [day, month, year] = value.split('/').map(Number);
  return { day, month, year };
}

/**
 * Formatted from the parts rather than through Intl: these render on the server
 * and again on the client, and a locale difference between the two would be a
 * hydration mismatch.
 */
export function formatBlogDate(value: string) {
  const { day, month, year } = parseBlogDate(value);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

/** Newest first. Compared as numbers, so no Date object is involved. */
export function byNewest(a: BlogPost, b: BlogPost) {
  const left = parseBlogDate(a.date);
  const right = parseBlogDate(b.date);

  return (
    right.year - left.year || right.month - left.month || right.day - left.day
  );
}
