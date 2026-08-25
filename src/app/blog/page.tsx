import type { Metadata } from 'next';
import { RoutePlaceholder } from '@/components/dev/route-placeholder';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Articles on dermatology, regenerative medicine and wound care from Dr. Christeen Youssef.',
};

export default function Page() {
  return <RoutePlaceholder title="Blog" route="/blog" />;
}
