import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';
import { staggerContainer } from '../../utils/motion';
import doctorImage from '../../assets/DR._CHRISTEEN_YOUSSEF-removebg-preview.png';
import styles from './AboutSection.module.css';

const imageAnimation = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] as const }
  }
};

const textItemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" as const } }
};

export const AboutSection: React.FC = () => {
  return (
    <section className={styles.section} id="about">
      <div className={styles.container}>
        {/* Left: Image with premium offset frame */}
        <motion.div
          className={styles.imageWrapper}
          variants={imageAnimation}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.imageOffsetBg}></div>
          <div className={styles.imageFrame}>
            <img src={doctorImage} alt="Dr. Christeen Youssef" />
          </div>
          <div className={styles.floatingBadge}>
            <span className={styles.badgeNumber}>12+</span>
            <span className={styles.badgeText}>Years of<br/>Excellence</span>
          </div>
        </motion.div>

        {/* Right: Content with enhanced animations */}
        <motion.div
          className={styles.content}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={textItemVariants}>
             <h4 className={styles.elegantBadge}>About Me</h4>
             <h2 className={styles.mainTitle}>Dr. Christeen Youssef</h2>
             <h3 className={styles.subTitle}>Dermatologist & Aesthetic Medicine Specialist</h3>
             <span className={styles.divider} />
          </motion.div>

          <motion.p variants={textItemVariants} className={styles.text}>
            Motivational keynote speaker & subject matter expert for 12 strong years in the field of Aesthetic Medicine. Efficient communicator who engages with diverse audiences through insightful presentations on emerging topics in the complex areas of Aesthetics & Dermatology.
          </motion.p>
          
          <motion.p variants={textItemVariants} className={styles.textSecondary}>
            Active member of the international healthcare community with a passion for furthering standards of excellence in Aesthetic Dermatology, spearheading clinically proven & safe best practices. Dynamic mentor dedicated to influencing positive change as a peer adviser, consultant, & healthcare educator.
          </motion.p>

          <motion.div variants={textItemVariants} className={styles.signatureWrapper}>
             <div className={styles.signature}>Dr. Christeen Youssef</div>
          </motion.div>

          <motion.div variants={textItemVariants} className={styles.buttonWrapper}>
            <Button href="/about-me" variant="primary">
              Learn More About My Practice
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
