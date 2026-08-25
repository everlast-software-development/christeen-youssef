import React from 'react';
import { motion } from 'framer-motion';
import { FiCalendar, FiClock, FiArrowRight } from 'react-icons/fi';
import { blogPosts } from '../../data/blog';
import { staggerContainer, fadeUp } from '../../utils/motion';
import styles from './BlogSection.module.css';

export const BlogSection: React.FC = () => {
  return (
    <section className={styles.section} id="blog">
      <div className={styles.container}>
        <motion.div
          className={styles.elegantHeader}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeUp}
        >
          <div className={styles.headerContent}>
            <span className={styles.elegantBadge}>Editorial Focus</span>
            <h2 className={styles.mainTitle}>Insights & Discoveries</h2>
          </div>
          <a href="/blog" className={styles.viewAllBtn}>
            View All Journals <FiArrowRight />
          </a>
        </motion.div>

        <motion.div
          className={styles.editorialGrid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {blogPosts.slice(0, 3).map((post) => (
            <motion.div key={post.id} variants={fadeUp} className={styles.smallCard}>
              <a href={`/blog/${post.slug}`} className={styles.cardLinkAnchor}>
                <div className={styles.imageContainer}>
                  <div className={styles.badge}>{post.category}</div>
                  <img src={post.image} alt={post.title} className={styles.image} />
                </div>

                <div className={styles.content}>
                  <div className={styles.meta}>
                    <div className={styles.metaItem}>
                      <FiCalendar size={14} className={styles.metaIcon} />
                      <span className={styles.date}>{post.date}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <FiClock size={14} className={styles.metaIcon} />
                      <span className={styles.readTime}>{post.readTime}</span>
                    </div>
                  </div>

                  <h3 className={styles.standardTitle}>{post.title}</h3>
                  <p className={styles.standardExcerpt}>{post.excerpt}</p>

                  <div className={styles.footer}>
                    <span className={styles.readMore}>
                      Read Full Article <FiArrowRight size={16} />
                    </span>
                  </div>
                </div>
              </a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
