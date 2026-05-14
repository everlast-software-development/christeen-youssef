import React from 'react';
import { motion } from 'framer-motion';
import { FiHeart, FiTarget, FiZap } from 'react-icons/fi';
import { staggerContainer } from '../../utils/motion';
import styles from './FacilitiesSection.module.css';

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: "easeOut" as const }
  }
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const facilities = [
  {
    numeral: '01',
    icon: FiHeart,
    title: 'Follow-Up Care',
    description: 'Dedicated post-treatment support & clinical guidance to monitor your progress & ensure absolute satisfaction.'
  },
  {
    numeral: '02',
    icon: FiTarget,
    title: 'Customized Plans',
    description: 'Tailored aesthetic solutions for individual skin concerns, ensuring deeply personalized care for every single patient.'
  },
  {
    numeral: '03',
    icon: FiZap,
    title: 'Advanced Therapies',
    description: 'Providing innovative treatments powered by state-of-the-art laser therapies, PRP, & clinically proven regimens.'
  }
];

export const FacilitiesSection: React.FC = () => {
  return (
    <section className={styles.section} id="facilities">
      <div className={styles.container}>
        <motion.div
          className={styles.headingWrapper}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={headingVariants}
        >
          <span className={styles.elegantBadge}>Patient Experience</span>
          <h2 className={styles.mainTitle}>Unrivaled Care Facilities</h2>
          <div className={styles.divider}></div>
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {facilities.map((facility, index) => {
            const Icon = facility.icon;
            return (
              <motion.div key={index} variants={cardVariants} className={styles.facilityCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.numeral}>{facility.numeral}</div>
                  <div className={styles.iconWrapper}>
                    <Icon size={24} />
                  </div>
                </div>
                <h3 className={styles.title}>{facility.title}</h3>
                <p className={styles.description}>{facility.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
