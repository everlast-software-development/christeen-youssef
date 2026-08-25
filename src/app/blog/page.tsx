import type { Metadata } from 'next';
import { BlogIndex } from '@/components/sections/blog-index';

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Articles on dermatology, regenerative medicine and wound care from Dr. Christeen Youssef.',
};

export default function Page() {
  return <BlogIndex />;
}
