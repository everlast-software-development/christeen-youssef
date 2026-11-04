import { Helmet } from 'react-helmet-async';
import { SITE_URL } from '@/lib/site';
import type { ImageAsset } from '@/components/ui/image';

const SITE_NAME = 'Dr. Christeen Youssef';
const DEFAULT_TITLE = 'Dr. Christeen Youssef — Aesthetic Dermatology & Wellness | Abu Dhabi';
const DEFAULT_DESCRIPTION =
  'Dr. Christeen Youssef — aesthetic dermatology, advanced wound care and wellness in Abu Dhabi, UAE. Evidence-based treatment with an emphasis on natural, lasting results.';
const SOCIAL_TITLE = 'Dr. Christeen Youssef — Aesthetic Dermatology & Wellness';
const SOCIAL_DESCRIPTION = 'Aesthetic dermatology, advanced wound care and wellness in Abu Dhabi, UAE.';

/**
 * A page's <head>: title (templated as "Page — Dr. Christeen Youssef"),
 * description, canonical URL, Open Graph and Twitter cards. Rendered into the
 * static HTML at build time by the prerender, and kept in sync on client-side
 * navigation by react-helmet-async.
 */
export function Seo({
  title,
  description,
  path,
  image,
  type = 'website',
  noindex = false,
}: {
  /** Omit on the home page to use the site's default title. */
  title?: string;
  description?: string;
  /** The page's path, e.g. "/about-me" — for the canonical and og:url. */
  path: string;
  image?: ImageAsset;
  type?: 'website' | 'article';
  noindex?: boolean;
}) {
  const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
  const url = new URL(path, SITE_URL).toString();
  const metaDescription = description ?? DEFAULT_DESCRIPTION;
  // As the Next.js metadata had it: pages share the site's social card;
  // articles get their own title and excerpt.
  const socialTitle = type === 'article' && title ? title : SOCIAL_TITLE;
  const socialDescription = type === 'article' && description ? description : SOCIAL_DESCRIPTION;
  const imageUrl = image ? new URL(image.src, SITE_URL).toString() : undefined;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={url} />
      <meta name="robots" content={noindex ? 'noindex, follow' : 'index, follow'} />

      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_AE" />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      {image && <meta property="og:image:width" content={String(image.width)} />}
      {image && <meta property="og:image:height" content={String(image.height)} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={socialDescription} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
    </Helmet>
  );
}
