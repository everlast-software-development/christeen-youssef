/**
 * The canonical origin, in one place.
 *
 * Read by the root metadata, the sitemap and robots.txt — three files that must
 * agree, because a mismatch between `metadataBase` and the sitemap is the kind
 * of thing that silently costs you indexing rather than failing a build.
 */
export const SITE_URL = 'https://drchristeenyoussef.com';
