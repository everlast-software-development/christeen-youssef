import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { Preloader, PRELOADER_BOOT } from '@/components/site/preloader';
import { ScrollMotion } from '@/components/providers/scroll-motion';
import { SiteHeader } from '@/components/site/header';
import { SiteFooter } from '@/components/site/footer';
import { ScrollProgress } from '@/components/layout/scroll-progress';
import { SITE_URL } from '@/lib/site';

// Display and headings. 500 is the only upright weight on the site; the italic
// is loaded for one thing — the signature in the home About section.
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

// Body and UI. A variable font, so 400/500/600 all come from one file.
const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Dr. Christeen Youssef — Aesthetic Dermatology & Wellness | Abu Dhabi',
    template: '%s — Dr. Christeen Youssef',
  },
  description:
    'Dr. Christeen Youssef — aesthetic dermatology, advanced wound care and wellness in Abu Dhabi, UAE. Evidence-based treatment with an emphasis on natural, lasting results.',
  keywords: [
    'aesthetic dermatology Abu Dhabi',
    'dermatologist Abu Dhabi',
    'Dr. Christeen Youssef',
    'wound care UAE',
    'diabetic foot Abu Dhabi',
    'thread lift Abu Dhabi',
  ],
  authors: [{ name: 'Dr. Christeen Youssef' }],
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: SITE_URL,
    siteName: 'Dr. Christeen Youssef',
    title: 'Dr. Christeen Youssef — Aesthetic Dermatology & Wellness',
    description:
      'Aesthetic dermatology, advanced wound care and wellness in Abu Dhabi, UAE.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dr. Christeen Youssef — Aesthetic Dermatology & Wellness',
    description:
      'Aesthetic dermatology, advanced wound care and wellness in Abu Dhabi, UAE.',
  },
  icons: {
    icon: '/favicon.webp',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#17150f',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // Lenis stamps `lenis lenis-smooth` onto <html> as soon as it mounts, so the
    // class list legitimately differs from the server render on the first pass.
    <html
      lang="en"
      className={`${cormorant.variable} ${manrope.variable}`}
      suppressHydrationWarning
    >
      {/* clip, not hidden. `overflow-x: hidden` would make this a scroll
          container and break every `position: sticky` on the site — the home
          page hero is sticky for the whole of <main>, and the Principles rail
          and the article contents rail both depend on it. `clip` creates no
          scroll container, so sticky keeps resolving against the viewport, and
          it does not establish a containing block for the fixed header either.
          A guard, not a fix: anything that overflows still wants finding. */}
      <body className="overflow-x-clip bg-page">
        {/* A refresh must land at the top. The hero plays its entry animation
            on mount with fixed delays, and the about section builds its
            ScrollTriggers from wherever the page starts — restoring a mid-page
            offset means the intro plays unseen and the triggers measure against
            a position Lenis has not taken over yet. Scoped to `reload` so
            back/forward keeps its native restoration. Must run before the
            browser restores, hence beforeInteractive rather than an effect. */}
        {/* A raw inline script, not <Script beforeInteractive> — that strategy
            only queues onto self.__next_s and runs once the Next runtime picks
            it up, which is after restoration. This executes during parse. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var n=performance.getEntriesByType('navigation')[0];if(n&&n.type==='reload'&&'scrollRestoration' in history){history.scrollRestoration='manual'}}catch(e){}`,
          }}
        />

        {/* Decides, before first paint, whether this load plays the full
            preloader (once per session) — see components/site/preloader.tsx. */}
        <script dangerouslySetInnerHTML={{ __html: PRELOADER_BOOT }} />
        <noscript>
          <style>{'.preloader{display:none!important}'}</style>
        </noscript>

        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[300] focus:rounded-[10px] focus:bg-gold-deep focus:px-5 focus:py-3 focus:type-button focus:text-white"
        >
          Skip to content
        </a>

        <SmoothScroll>
          <Preloader>
            <ScrollProgress />
            {/* Absolute, not fixed: it sits inside each page's opening band
                and scrolls away with it. */}
            <SiteHeader />
            <ScrollMotion />
            {children}
            <SiteFooter />
          </Preloader>
        </SmoothScroll>
      </body>
    </html>
  );
}
