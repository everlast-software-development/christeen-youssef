import { Seo } from '@/components/site/seo';
import { ContactSection } from '@/components/ui/contact';

export default function Page() {
  return (
    <main id="content">
      <Seo path="/reach-me" title="Reach Me" description="Contact Dr. Christeen Youssef's clinic in Abu Dhabi, UAE." />
      <ContactSection />
    </main>
  );
}
