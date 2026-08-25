import React from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '../layout/PageTransition';
import { SectionHeading } from '../ui/SectionHeading';
import { careerTimeline } from '../../data/career';
import { staggerContainer, fadeUp, fadeDown } from '../../utils/motion';
import styles from './AboutPage.module.css';
import drPhoto from '../../assets/WhatsApp Image 2026-03-26 at 1.11.16 PM (1).jpeg';

export const AboutPage: React.FC = () => {
  return (
    <PageTransition>
      {/* Hero Banner */}
      <section className={styles.heroBanner}>
        <motion.div
          className={styles.bannerContent}
          initial="hidden"
          animate="visible"
          variants={fadeDown}
          transition={{ duration: 0.6 }}
        >
          <h1>About Me</h1>
          <p>Aesthetic Dermatologist & Medical Consultant</p>
        </motion.div>
      </section>

      {/* Bio / Introduction Section */}
      <section className={styles.bioSection}>
        <div className={styles.container}>
          <motion.div
            className={styles.bioGrid}
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div className={styles.bioImage} variants={fadeUp}>
              <motion.img
                src={drPhoto}
                alt="Dr. Christeen Youssef"
                className={styles.profilePhoto}
                loading="lazy"
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 100, damping: 15 }}
              />
            </motion.div>

            <motion.div className={styles.bioContent} variants={staggerContainer}>
              <motion.div variants={fadeUp} className={styles.meetHeader}>
                <span className={styles.elegantBadge}>About Me</span>
                <h2 className={styles.meetTitle}>Dr. Christeen Youssef</h2>
                <p className={styles.meetSubtitle}>Aesthetic Dermatologist & Medical Consultant</p>
                <div className={styles.divider} />
              </motion.div>

              <motion.p variants={fadeUp} className={`${styles.bioParagraph} ${styles.lead}`}>
                With over 12 years of dedicated practice in aesthetic medicine, Dr. Christeen Youssef has established herself as a leading authority in non-surgical facial rejuvenation. Her approach combines artistic precision with evidence-based clinical expertise to deliver natural, harmonious results.
              </motion.p>

              <motion.p variants={fadeUp} className={styles.bioParagraph}>
                A graduate of prestigious international institutions including Harvard Medical School and the American Academy of Aesthetic Medicine, she brings world-class training to every consultation. Her commitment to advancing the field is reflected in her peer-reviewed publications and regular presentations at global dermatology conferences.
              </motion.p>

              <motion.div variants={fadeUp} className={styles.expertiseArea}>
                <p className={styles.expertiseTitle}>Areas of Expertise</p>
                <ul className={styles.specialties}>
                  <li>Advanced Injectables</li>
                  <li>Facial Harmonization</li>
                  <li>Laser Resurfacing</li>
                  <li>Scar Revision</li>
                  <li>Medical Dermatology</li>
                  <li>Skin Rejuvenation</li>
                </ul>
              </motion.div>

              <motion.p variants={fadeUp} className={styles.bioParagraph}>
                At Everlast Wellness Medical Center in Abu Dhabi, Dr. Youssef leads a patient-centered practice built on trust, education, and uncompromising safety standards. Every treatment plan is uniquely crafted to honor individual facial anatomy and aesthetic goals.
              </motion.p>

              <motion.div variants={fadeUp} className={styles.credentials}>
                <div className={styles.credentialItem}>
                  <span className={styles.credentialNumber}>12+</span>
                  <span className={styles.credentialLabel}>Years Experience</span>
                </div>
                <div className={styles.credentialDivider} />
                <div className={styles.credentialItem}>
                  <span className={styles.credentialNumber}>5000+</span>
                  <span className={styles.credentialLabel}>Procedures</span>
                </div>
                <div className={styles.credentialDivider} />
                <div className={styles.credentialItem}>
                  <span className={styles.credentialNumber}>15+</span>
                  <span className={styles.credentialLabel}>Publications</span>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Career Timeline */}
      <section className={styles.timelineSection}>
        <div className={styles.container}>
          <SectionHeading
            title="Career Timeline"
            subtitle="A journey of expertise & dedication"
            centered
          />

          <motion.div
            className={styles.timeline}
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, amount: 0.15 }}
          >
            {careerTimeline.map((entry) => (
              <motion.div
                key={entry.id}
                className={styles.timelineEntry}
                variants={fadeUp}
              >
                <div className={styles.timelineNode} />
                <div className={styles.timelineContent}>
                  <div className={styles.entryCard}>
                    <span className={styles.period}>{entry.period}</span>
                    <h3 className={styles.title}>{entry.title}</h3>
                    <span className={styles.organisation}>{entry.organisation}</span>
                    <p className={styles.description}>{entry.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </PageTransition>
  );
};
