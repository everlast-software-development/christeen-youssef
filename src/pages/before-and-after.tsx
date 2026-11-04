import { Seo } from '@/components/site/seo';
import { CtaBand } from '@/components/site/cta-band';
import { ResultsGallery } from '@/components/results/results-gallery';

export default function Page() {
  return (
    <main id="content">
      <Seo
        path="/before-and-after"
        title="Before & After"
        description="Documented patient results across aesthetic dermatology, scar revision and regenerative treatments."
      />
      <ResultsGallery />

      <CtaBand
        title="Every result starts with a conversation"
        body="No two cases are alike. A consultation is where the plan gets built around your skin, your history and what you actually want from treatment."
        primary={{ href: '/reach-me', label: "Let's talk" }}
      />
    </main>
  );
}
