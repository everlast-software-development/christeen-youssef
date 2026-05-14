import React from 'react';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPhoneCall } from 'react-icons/fi';
import { fadeUp, staggerContainer } from '../../utils/motion';
import styles from './CTASection.module.css';

export const CTASection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.card}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Abstract glass shapes for luxury depth */}
          <div className={styles.glassShape1}></div>
          <div className={styles.glassShape2}></div>

          <div className={styles.contentGrid}>
            <motion.div variants={fadeUp} className={styles.textColumn}>
              <div className={styles.badgeWrapper}>
                <span className={styles.badge}>Begin Your Journey</span>
                <div className={styles.badgeLine}></div>
              </div>
              <h2 className={styles.heading}>
                Ready to Discover Your <span className={styles.goldText}>Best Skin?</span>
              </h2>
              <p className={styles.subtext}>
                Schedule a highly personalized consultation today & experience the pinnacle of aesthetic dermatology. 
                Let us craft a bespoke treatment plan exclusively for you.
              </p>
            </motion.div>

            <motion.div variants={fadeUp} className={styles.actionColumn}>
              <div className={styles.actionCard}>
                <h3 className={styles.actionTitle}>Take the First Step</h3>
                <p className={styles.actionDesc}>Our dedicated patient coordinators are ready to assist you right now.</p>
                <div className={styles.buttonGroup}>
                  <a href="/appointment" className={styles.primaryBtn}>
                    Book Consultation <FiArrowRight className={styles.btnIcon} />
                  </a>
                  <a href="tel:+971600551615" className={styles.secondaryBtn}>
                    <FiPhoneCall className={styles.btnIconLeft} /> Call Directly
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
