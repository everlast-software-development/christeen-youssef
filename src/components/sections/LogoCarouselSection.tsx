import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import styles from './LogoCarouselSection.module.css';

// Import all partner logos
import logo1 from '../../assets/1 (1).webp';
import logo2 from '../../assets/2-1.webp';
import logo3 from '../../assets/3.webp';
import logo4 from '../../assets/4.webp';
import logo5 from '../../assets/5.webp';
import logo6 from '../../assets/6.webp';
import logo7 from '../../assets/7.webp';
import logo8 from '../../assets/8.webp';
import logo9 from '../../assets/9.webp';

const logos = [
  { id: 1, src: logo1, alt: 'Partner Logo 1' },
  { id: 2, src: logo2, alt: 'Partner Logo 2' },
  { id: 3, src: logo3, alt: 'Partner Logo 3' },
  { id: 4, src: logo4, alt: 'Partner Logo 4' },
  { id: 5, src: logo5, alt: 'Partner Logo 5' },
  { id: 6, src: logo6, alt: 'Partner Logo 6' },
  { id: 7, src: logo7, alt: 'Partner Logo 7' },
  { id: 8, src: logo8, alt: 'Partner Logo 8' },
  { id: 9, src: logo9, alt: 'Partner Logo 9' },
];

const headingVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

export const LogoCarouselSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headingVariants}
        >
          <SectionHeading
            title="Our Partners"
            subtitle="Trusted by leading healthcare organizations"
            centered
          />
        </motion.div>

        {/*
          Two-track infinite marquee.
          Each track is flex-shrink:0 and animates translateX(0→-100%).
          -100% refers to the track's OWN width, so both tracks
          travel exactly one full set width — no fit-content math needed.
          Track 2 starts naturally to the right of Track 1 (flex row),
          so when Track 1 exits left, Track 2 slides into view seamlessly.
        */}
        <div className={styles.carouselWrapper}>
          <div className={styles.track}>
            {logos.map((logo) => (
              <div key={logo.id} className={styles.logoItem}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={styles.logo}
                  loading="eager"
                />
              </div>
            ))}
          </div>
          <div className={styles.track} aria-hidden="true">
            {logos.map((logo) => (
              <div key={logo.id} className={styles.logoItem}>
                <img
                  src={logo.src}
                  alt={logo.alt}
                  className={styles.logo}
                  loading="eager"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
