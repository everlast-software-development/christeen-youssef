import { Seo } from '@/components/site/seo';
import { AboutHero } from '@/components/about/about-hero';
import { AboutBody } from '@/components/about/about-body';

export default function Page() {
  return (
    <main id="content">
      <Seo
        path="/about-me"
        title="About Me"
        description="The training, research and clinical philosophy behind Dr. Christeen Youssef's practice in Abu Dhabi."
      />
      <AboutHero />
      <AboutBody />
    </main>
  );
}
