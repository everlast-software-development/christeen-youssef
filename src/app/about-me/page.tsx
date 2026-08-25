import type { Metadata } from 'next';
import { AboutHero } from '@/components/about/about-hero';
import { AboutBody } from '@/components/about/about-body';

export const metadata: Metadata = {
  title: 'About Me',
  description:
    "The training, research and clinical philosophy behind Dr. Christeen Youssef's practice in Abu Dhabi.",
};

export default function Page() {
  return (
    <main>
      <AboutHero />
      <AboutBody />
    </main>
  );
}
