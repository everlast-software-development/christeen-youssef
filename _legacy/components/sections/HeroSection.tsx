import React from 'react';
import { motion } from 'framer-motion';
import { fadeLeft, fadeRight } from '../../utils/motion';
import heroImage from '../../assets/s-e1704383352984.webp';
import styles from './HeroSection.module.css';

export const HeroSection: React.FC = () => {
  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className={styles.hero}>
      {/* Left Side Medical Elements */}
      <div className={styles.geometricElement1} />
      <div className={styles.geometricElement2} />
      <div className={styles.geometricElement3} />

      {/* Right Side Medical Elements */}
      <div className={styles.geometricElement4} />
      <div className={styles.geometricElement5} />
      <div className={styles.geometricElement6} />

      <div className={styles.container}>
        {/* Left Content Section */}
        <motion.div
          className={styles.contentSection}
          variants={fadeLeft}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className={styles.content}
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Accent Dot */}
            <motion.div variants={itemVariants}>
              <div className={styles.accentDot} />
            </motion.div>

            {/* Tagline */}
            <motion.div variants={itemVariants}>
              <p className={styles.tagline}>
                Aesthetic Excellence & Dermatological Expertise
              </p>
            </motion.div>

            {/* Main Headline */}
            <motion.div variants={itemVariants}>
              <h1 className={styles.headline}>
                Discover Your
                <br />
                Most Radiant Self
              </h1>
            </motion.div>

            {/* Description */}
            <motion.div variants={itemVariants}>
              <p className={styles.description}>
                With 12+ years of clinical excellence & innovative aesthetic treatments designed uniquely for you.
              </p>
            </motion.div>

            {/* CTA Button */}
            <motion.div variants={itemVariants} className={styles.buttonContainer}>
              <a href="/appointment" className={styles.ctaButton}>
                Make an appointment
              </a>
            </motion.div>

            {/* Stat Pills */}
            <motion.div variants={itemVariants} className={styles.statPills}>
              <div className={styles.pill}>
                <span className={styles.pillValue}>22K+</span>
                <span className={styles.pillLabel}>Patients Transformed</span>
              </div>
              <div className={styles.pill}>
                <span className={styles.pillValue}>20+</span>
                <span className={styles.pillLabel}>Industry Awards</span>
              </div>
              <div className={styles.pill}>
                <span className={styles.pillValue}>12+</span>
                <span className={styles.pillLabel}>Years Experience</span>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Right Image Section */}
        <motion.div
          className={styles.imageSection}
          variants={fadeRight}
          initial="hidden"
          animate="visible"
        >
          <img
            src={heroImage}
            alt="Dr. Christeen Youssef"
            className={styles.heroImage}
          />
        </motion.div>
      </div>
    </section>
  );
};
