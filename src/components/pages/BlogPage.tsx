import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../layout/PageTransition';
import aboutStyles from './AboutPage.module.css';
import styles from './BlogPage.module.css';
import { fadeDown, fadeUp, staggerContainer } from '../../utils/motion';
import { blogPosts } from '../../data/blog';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiClock, FiCalendar } from 'react-icons/fi';

const categories = ['All', 'CONFERENCE', 'MEDIA', 'RESEARCH', 'TESTIMONIAL', 'WORKSHOP'];

export const BlogPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredPosts = activeCategory === 'All' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === activeCategory);

  const featuredPost = filteredPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  return (
    <PageTransition>
      {/* Hero Banner */}
      <section className={aboutStyles.heroBanner}>
        <motion.div
          className={aboutStyles.bannerContent}
          initial="hidden"
          animate="visible"
          variants={fadeDown}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.heroBadge}>Our Blog</span>
          <h1>Latest Insights & Research</h1>
          <p className={styles.subtitle}>Discover breakthrough treatments, medical conferences, & expert perspectives from Dr. Christeen Youssef</p>
        </motion.div>
      </section>

      {/* Blog Content */}
      <section className={styles.blogSection}>
        <div className={styles.container}>
          
          {/* Category Filters */}
          <motion.div 
            className={styles.filterBar}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className={styles.filterButtons}>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`${styles.filterBtn} ${activeCategory === category ? styles.filterBtnActive : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
            <span className={styles.resultsCount}>
              {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''}
            </span>
          </motion.div>

          {/* Featured Post */}
          {featuredPost && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              variants={fadeUp}
              viewport={{ once: true }}
            >
              <Link to={`/blog/${featuredPost.slug}`} className={styles.featuredCard}>
                <div className={styles.featuredImageWrapper}>
                  <img src={featuredPost.image} alt={featuredPost.title} className={styles.featuredImage} />
                  <div className={styles.featuredOverlay} />
                  <span className={styles.featuredBadge}>{featuredPost.category}</span>
                </div>
                <div className={styles.featuredContent}>
                  <div className={styles.featuredMeta}>
                    <span className={styles.metaItem}>
                      <FiCalendar size={14} />
                      {featuredPost.date}
                    </span>
                    <span className={styles.metaDivider} />
                    <span className={styles.metaItem}>
                      <FiClock size={14} />
                      {featuredPost.readTime} read
                    </span>
                  </div>
                  <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>
                  <p className={styles.featuredExcerpt}>{featuredPost.excerpt}</p>
                  <span className={styles.readMoreLink}>
                    Read Full Article <FiArrowRight size={18} />
                  </span>
                </div>
              </Link>
            </motion.div>
          )}

          {/* Blog Grid */}
          {remainingPosts.length > 0 && (
            <motion.div
              className={styles.blogGrid}
              initial="hidden"
              whileInView="visible"
              variants={staggerContainer}
              viewport={{ once: true, amount: 0.1 }}
            >
              {remainingPosts.map((post, index) => (
                <motion.div
                  key={post.id}
                  variants={fadeUp}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/blog/${post.slug}`} className={styles.blogCard}>
                    <div className={styles.cardImageWrapper}>
                      <img src={post.image} alt={post.title} className={styles.cardImage} />
                      <span className={styles.cardBadge}>{post.category}</span>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardMeta}>
                        <span>{post.date}</span>
                        <span className={styles.metaDot} />
                        <span>{post.readTime} read</span>
                      </div>
                      <h3 className={styles.cardTitle}>{post.title}</h3>
                      <p className={styles.cardExcerpt}>{post.excerpt}</p>
                      <span className={styles.cardReadMore}>
                        Read Article <FiArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <div className={styles.emptyState}>
              <p>No articles found in this category.</p>
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  );
};
