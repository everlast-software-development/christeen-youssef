import { HomeHero } from '@/components/home/hero';
import { HomeAbout } from '@/components/home/about';
import { HomeTrust } from '@/components/home/trust';
import { HomeRegenerative } from '@/components/home/regenerative';
import { HomeTreatments } from '@/components/home/treatments';
import { HomeResults } from '@/components/home/results';
import { HomeStories } from '@/components/home/stories';
import { HomeJournal } from '@/components/home/journal';
import { CtaBand } from '@/components/site/cta-band';

export default function Home() {
  return (
    // As in the reference: Cormorant's own old-style figures and plain wrapping
    // (the site default elsewhere is lining figures and balanced headings).
    <main
      id="content"
      className="[font-variant-numeric:normal] [&_:is(h1,h2,h3,p)]:[text-wrap:wrap]"
    >
      <div aria-hidden className="scroll-progress" />
      <HomeHero />
      <HomeAbout />
      <HomeTrust />
      <HomeRegenerative />
      <HomeTreatments />
      <HomeResults />
      <HomeStories />
      <HomeJournal />
      <CtaBand />
    </main>
  );
}
