import React from 'react';
import styles from './GrainOverlay.module.css';

export const GrainOverlay: React.FC = () => {
  return (
    <div className={styles.grain}>
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            result="noise"
            seed="1"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" fill="#0F1117" filter="url(#noise)" opacity="0.04" />
      </svg>
    </div>
  );
};
