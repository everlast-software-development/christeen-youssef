import type { Metadata } from 'next';
import { ContactSection } from '@/components/ui/contact';

export const metadata: Metadata = {
  title: 'Reach Me',
  description: "Contact Dr. Christeen Youssef's clinic in Abu Dhabi, UAE.",
};

export default function Page() {
  return (
    <main>
      <ContactSection />
    </main>
  );
}
