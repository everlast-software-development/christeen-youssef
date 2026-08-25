import type { Metadata } from 'next';
import { RoutePlaceholder } from '@/components/dev/route-placeholder';

export const metadata: Metadata = {
  title: 'Reach Me',
  description: "Contact Dr. Christeen Youssef's clinic in Abu Dhabi, UAE.",
};

export default function Page() {
  return <RoutePlaceholder title="Reach Me" route="/reach-me" />;
}
