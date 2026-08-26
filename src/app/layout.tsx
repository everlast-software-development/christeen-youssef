import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Cairo, Geist } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { SiteHeader } from '@/components/layout/site-header';
import { Footer } from '@/components/ui/footer-section';
import { SITE_URL } from '@/lib/site';
import { PageTransition } from '@/components/providers/page-transition';

// Editorial serif for display type — the "premium" half of the pairing.
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

// Cairo carries over from the original brand and keeps Arabic coverage.
const cairo = Cairo({
  subsets: ['latin', 'arabic'],
  variable: '--font-cairo',
  display: 'swap',
});

// Primary UI/body face.
const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

// Display face for the hero name and the manifesto line between Principles and
// Expertise. Single weight (Regular) — there is no bold or light cut, so any
// `font-bold` against it is a synthetic embolden by the browser (which the
// manifesto line asks for deliberately); elsewhere, weight contrast has to come
// from size or colour.
const redound = localFont({
  src: '../assets/fonts/redound-regular.ttf',
  variable: '--font-redound',
  display: 'swap',
  weight: '400',
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
  themeColor: '#0f1117',
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
      className={`${playfair.variable} ${cairo.variable} ${geist.variable} ${redound.variable}`}
      suppressHydrationWarning
    >
      {/* clip, not hidden. `overflow-x: hidden` would make this a scroll
          container and break every `position: sticky` on the site — the home
          page hero is sticky for the whole of <main>, and the Principles rail
          and the article contents rail both depend on it. `clip` creates no
          scroll container, so sticky keeps resolving against the viewport, and
          it does not establish a containing block for the fixed header either.
          A guard, not a fix: anything that overflows still wants finding. */}
      <body className="overflow-x-clip">
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

        <SmoothScroll>
          <PageTransition>
            <SiteHeader />
            {children}
            {/* Outside {children}, so it is a sibling of each page's <main>
                rather than a child of it. That matters on the home page: the
                hero is sticky for the whole of <main>, and a footer inside that
                box would be scrolled over by it. */}
            <Footer />
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
