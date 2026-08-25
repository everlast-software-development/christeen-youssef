import React from 'react';
import { motion } from 'framer-motion';
import { Counter } from '../ui/Counter';
import { SectionHeading } from '../ui/SectionHeading';
import { stats } from '../../data/stats';
import { staggerContainer } from '../../utils/motion';
import styles from './StatsSection.module.css';

const counterVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const headingVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export const StatsSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={headingVariants}
          className={styles.header}
        >
          <SectionHeading
            title="Our Impact"
            subtitle="Numbers that reflect our commitment to excellence"
            centered
          />
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          {stats.map((stat) => (
            <motion.div key={stat.label} variants={counterVariants}>
              <Counter
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
                icon={stat.icon}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
