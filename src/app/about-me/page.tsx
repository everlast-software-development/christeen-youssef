import type { Metadata } from 'next';
import { RoutePlaceholder } from '@/components/dev/route-placeholder';

export const metadata: Metadata = {
  title: 'About Me',
  description:
    "The training, research and clinical philosophy behind Dr. Christeen Youssef's practice in Abu Dhabi.",
};

export default function Page() {
  return <RoutePlaceholder title="About Me" route="/about-me" />;
}
