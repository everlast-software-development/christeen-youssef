import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Cairo, Geist } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { SmoothScroll } from '@/components/providers/smooth-scroll';
import { SiteHeader } from '@/components/layout/site-header';
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

// Display face for the hero name. Single weight (Regular) — there is no
// bold or light cut, so weight contrast has to come from size or colour.
const redound = localFont({
  src: '../assets/fonts/redound-regular.ttf',
  variable: '--font-redound',
  display: 'swap',
  weight: '400',
});

const SITE_URL = 'https://drchristeenyoussef.com';

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
    <html lang="en" className={`${playfair.variable} ${cairo.variable} ${geist.variable} ${redound.variable}`}>
      <body>
        <SmoothScroll>
          <PageTransition>
            <SiteHeader />
            {children}
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
