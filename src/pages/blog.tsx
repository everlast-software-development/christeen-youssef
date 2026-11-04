import { Seo } from '@/components/site/seo';
import { BlogIndex } from '@/components/sections/blog-index';

export default function Page() {
  return (
    <>
      <Seo
        path="/blog"
        title="Blog"
        description="Articles on dermatology, regenerative medicine and wound care from Dr. Christeen Youssef."
      />
      <BlogIndex />
    </>
  );
}
