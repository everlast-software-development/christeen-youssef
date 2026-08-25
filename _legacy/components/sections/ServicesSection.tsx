import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { Card } from '../ui/Card';
import { services } from '../../data/services';
import * as Icons from 'react-icons/fi';
import { staggerContainer } from '../../utils/motion';
import styles from './ServicesSection.module.css';

const serviceCardVariants = {
  hidden: { opacity: 0, y: 60, scale: 0.88 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.75 } }
};

const headingVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } }
};

export const ServicesSection: React.FC = () => {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={headingVariants}
        >
          <SectionHeading
            title="Aesthetic & Medical Services"
            centered
          />
        </motion.div>

        <motion.div
          className={styles.grid}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {services.map((service) => {
            const IconComponent = Icons[service.icon as keyof typeof Icons] as React.ComponentType<any>;

            return (
              <motion.div key={service.id} variants={serviceCardVariants}>
                <Card>
                  <div className={styles.iconWrapper}>
                    {IconComponent && <IconComponent size={24} />}
                  </div>
                  <h3 className={styles.title}>{service.title}</h3>
                  <p className={styles.description}>
                    {service.description}
                  </p>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};
