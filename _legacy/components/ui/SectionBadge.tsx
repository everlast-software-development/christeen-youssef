import React from 'react';
import styles from './SectionBadge.module.css';

interface SectionBadgeProps {
  text: string;
  className?: string;
}

export const SectionBadge: React.FC<SectionBadgeProps> = ({ text, className = '' }) => {
  return (
    <div className={`${styles.badge} ${className}`}>
      {text}
    </div>
  );
};
