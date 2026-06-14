import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../layout/PageTransition';
import { fadeDown, fadeLeft, fadeRight, staggerContainer } from '../../utils/motion';
import styles from './PublicationsPage.module.css';
import drPhoto from '../../assets/DR._CHRISTEEN_YOUSSEF-removebg-preview.png';

export const PublicationsPage: React.FC = () => {
  return (
    <PageTransition>
      {/* Hero Banner - Same design as About page */}
      <section className={styles.heroBanner}>
        <motion.div
          className={styles.bannerContent}
          initial="hidden"
          animate="visible"
          variants={fadeDown}
          transition={{ duration: 0.6 }}
        >
          <h1>Publications</h1>
        </motion.div>
      </section>

      {/* Publications Content Section - Unique to this page only */}
      <section className={styles.publicationsSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.contentGrid}
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* LEFT SIDE - Doctor Image with Decorations */}
            <motion.div className={styles.leftSide} variants={fadeLeft}>
              <div className={styles.imageWrapper}>
                {/* Golden decorative lines */}
                <div className={styles.decorativeLineTop} />
                <div className={styles.decorativeLineBottom} />
                <div className={styles.decorativeCircle} />
                
                {/* Circular Doctor Image */}
                <div className={styles.imageContainer}>
                  <img
                    src={drPhoto}
                    alt="Dr. Christeen Youssef"
                    className={styles.doctorImage}
                  />
                </div>
              </div>
              
              {/* Doctor Name */}
              <h3 className={styles.doctorName}>DR. CHRISTEEN YOUSSEF</h3>
              
              {/* Description */}
              <p className={styles.description}>
                Leading expert in aesthetic dermatology with extensive research 
                & publications in thread lifting techniques & facial rejuvenation.
              </p>
              
              {/* Click Here Button */}
              <a 
                href="https://christeenyoussef.com/wp-content/uploads/2024/01/PME_10_2_32_41_Youssef_sp2.pdf" 
                className={styles.clickButton}
                target="_blank"
                rel="noopener noreferrer"
              >
                Click Here
              </a>
            </motion.div>

            {/* RIGHT SIDE - Publication Details */}
            <motion.div className={styles.rightSide} variants={fadeRight}>
              <h2 className={styles.publicationTitle}>
                THE ART OF THREADS
              </h2>
              <h3 className={styles.publicationSubtitle}>
                A COMPREHENSIVE REVIEW
              </h3>
              <p className={styles.publicationDescription}>
                This comprehensive review explores the intricate techniques & methodologies 
                involved in modern thread lifting procedures. Dr. Youssef delves into the 
                scientific principles, patient selection criteria, & advanced application 
                methods that define excellence in aesthetic dermatology practice.
              </p>
              <p className={styles.publicationDescription}>
                The publication serves as an essential resource for practitioners seeking 
                to master the art of thread-based facial rejuvenation, combining theoretical 
                knowledge with practical clinical insights gained from years of specialized practice.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};
