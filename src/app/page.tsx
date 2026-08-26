import { HeroSection } from '@/components/sections/hero-section';
import { AboutSection } from '@/components/sections/about-section';
import { PrinciplesSection } from '@/components/sections/principles-section';
import { ManifestoBand } from '@/components/sections/manifesto-band';
import { ExpertiseSection } from '@/components/sections/expertise-section';
import { BlogSection } from '@/components/sections/blog-section';
import { PartnersSection } from '@/components/sections/partners-section';
import { FinalCta } from '@/components/sections/final-cta';

export default function Home() {
  return (
    <main>
      <HeroSection />

      {/* A held beat between the two sections. The hero is sticky and About
          slides over it, so a transparent spacer does not open a gap — it buys
          extra scroll with the hero still pinned and fully visible, letting it
          land before the ink panel arrives.

          Collapsed below lg, where the hero is not sticky: with nothing pinned
          behind it a transparent spacer stops being a held beat and becomes a
          band of the document's white between the hero and About. */}
      <div aria-hidden className="h-0 lg:h-[22svh]" />

      <AboutSection />
      <PrinciplesSection />

      <ManifestoBand />

      <ExpertiseSection />

      <BlogSection />

      <PartnersSection />

      <FinalCta />
    </main>
  );
}
