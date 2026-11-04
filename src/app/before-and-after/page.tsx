import type { Metadata } from 'next';
import { CtaBand } from '@/components/site/cta-band';
import { ResultsGallery } from '@/components/results/results-gallery';

export const metadata: Metadata = {
  title: 'Before & After',
  description:
    'Documented patient results across aesthetic dermatology, scar revision and regenerative treatments.',
};

export default function Page() {
  return (
    <main id="content">
      <ResultsGallery />

      <CtaBand
        title="Every result starts with a conversation"
        body="No two cases are alike. A consultation is where the plan gets built around your skin, your history and what you actually want from treatment."
        primary={{ href: '/reach-me', label: "Let's talk" }}
      />
    </main>
  );
}
