import React from 'react';
import { motion } from 'framer-motion';
import { FiMapPin, FiClock, FiPhoneCall } from 'react-icons/fi';
import { schedule } from '../../data/schedule';
import { fadeLeft, fadeRight } from '../../utils/motion';
import styles from './ScheduleSection.module.css';

export const ScheduleSection: React.FC = () => {
  return (
    <section className={styles.section} id="schedule">
      <div className={styles.container}>
        <motion.div
          className={styles.info}
          variants={fadeLeft}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.headerContent}>
            <span className={styles.badge}>Consultations & Treatments</span>
            <h2 className={styles.title}>My Regular Schedule</h2>
            <div className={styles.accentLine}></div>
            <p className={styles.infoText}>
              Committed to providing comprehensive aesthetic care & personalized
              treatment plans. Please review the working hours below & reach out
              to confirm appointment availability.
            </p>
          </div>
        </motion.div>

        <motion.div
          className={styles.scheduleWrapper}
          variants={fadeRight}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.glassCard}>
            <div className={styles.cardHeader}>
              <h3 className={styles.clinic}>{schedule.clinicName}</h3>
              <p className={styles.role}>{schedule.role}</p>
            </div>

            <div className={styles.cardBody}>
              <div className={styles.detailRow}>
                <div className={styles.iconBox}>
                  <FiMapPin size={20} className={styles.detailIcon} />
                </div>
                <div className={styles.detail}>
                  <strong>Location</strong>
                  <p>{schedule.address}</p>
                </div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.iconBox}>
                  <FiClock size={20} className={styles.detailIcon} />
                </div>
                <div className={styles.detail}>
                  <strong>Hours</strong>
                  <p>{schedule.hours}</p>
                </div>
              </div>

              <div className={styles.detailRow}>
                <div className={styles.iconBox}>
                  <FiPhoneCall size={20} className={styles.detailIcon} />
                </div>
                <div className={styles.detail}>
                  <strong>Contact</strong>
                  <p>
                    <a href={`tel:${schedule.phone}`} className={styles.phoneLink}>{schedule.phone}</a>
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.cardFooter}>
              <a href={`tel:${schedule.phone}`} className={styles.ctaButton}>
                Call For Appointment
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
