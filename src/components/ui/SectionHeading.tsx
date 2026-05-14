import React from 'react';
import styles from './SectionHeading.module.css';
import { SectionBadge } from './SectionBadge';

interface SectionHeadingProps {
  title: string;
  badge?: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  badge,
  subtitle,
  centered = false,
  className = ''
}) => {
  return (
    <div className={`${styles.container} ${centered ? styles.centered : ''} ${className}`}>
      {badge && <SectionBadge text={badge} />}
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
    </div>
  );
};
