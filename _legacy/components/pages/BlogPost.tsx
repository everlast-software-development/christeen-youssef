import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { PageTransition } from '../layout/PageTransition';
import styles from './BlogPost.module.css';
import { blogPosts } from '../../data/blog';

const renderContent = (content: string) => {
  const blocks = content.split(/\n\n+/);
  const result: React.ReactElement[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const trimmed = block.trim();

    // Check for consecutive images
    const images: { alt: string; src: string }[] = [];
    let j = i;
    while (j < blocks.length) {
      const imgMatch = blocks[j].trim().match(/^!\[(.*?)\]\((.+?)\)$/);
      if (imgMatch) {
        images.push({ alt: imgMatch[1], src: imgMatch[2] });
        j++;
      } else {
        break;
      }
    }

    // If we found multiple consecutive images, render them in a grid
    if (images.length > 1) {
      result.push(
        <div key={i} className={styles.imageGrid}>
          {images.map((img, idx) => (
            <div key={idx} className={styles.imageGridItem}>
              <img src={img.src} alt={img.alt} className={styles.gridImage} />
            </div>
          ))}
        </div>
      );
      i = j;
      continue;
    }

    // Single image
    const imageMatch = trimmed.match(/^!\[(.*?)\]\((.+?)\)$/);
    if (imageMatch) {
      const [, alt, src] = imageMatch;
      result.push(
        <div key={i} className={styles.contentImageWrap}>
          <img src={src} alt={alt} className={styles.contentImage} />
        </div>
      );
      i++;
      continue;
    }

    // Headings and other content
    if (trimmed.startsWith('### ')) {
      result.push(<h3 key={i}>{trimmed.replace('### ', '')}</h3>);
    } else if (trimmed.startsWith('## ')) {
      result.push(<h2 key={i}>{trimmed.replace('## ', '')}</h2>);
    } else if (trimmed.split('\n').every((l) => l.trim().startsWith('- '))) {
      const items = trimmed.split('\n').map((l) => l.replace(/^-\s*/, ''));
      result.push(
        <ul key={i} className={styles.bulletList}>
          {items.map((it, idx) => (
            <li key={idx}>{it}</li>
          ))}
        </ul>
      );
    } else {
      result.push(<p key={i}>{trimmed}</p>);
    }
    i++;
  }

  return result;
};

export const BlogPost: React.FC = () => {
  const { slug } = useParams();
  const post = blogPosts.find((p) => p.slug === slug);

  if (!post) {
    return (
      <PageTransition>
        <section className={styles.container}>
          <h2>Article not found</h2>
          <p>The requested article could not be found.</p>
          <Link to="/blog">Back to blogs</Link>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <article className={styles.article}>
        <div className={styles.inner}>
          <div className={styles.header}>
            <span className={styles.badge}>{post.category}</span>
            <h1 className={styles.title}>{post.title}</h1>
            <div className={styles.meta}>{post.date} • {post.readTime}</div>
          </div>

          {post.image && (
            <div className={styles.heroImageWrap}>
              <img src={post.image} alt={post.title} className={styles.heroImage} />
            </div>
          )}

          <div className={styles.content}>{post.content ? renderContent(post.content) : <p>{post.excerpt}</p>}</div>
        </div>
      </article>
    </PageTransition>
  );
};

export default BlogPost;
