import React, { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import * as Icons from 'react-icons/fi';
import styles from './Counter.module.css';

interface CounterProps {
  value: number;
  label: string;
  suffix?: string;
  icon?: string;
}

export const Counter: React.FC<CounterProps> = ({ value, label, suffix = '', icon }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
  const [displayValue, setDisplayValue] = useState(0);

  const IconComponent = icon ? (Icons[icon as keyof typeof Icons] as React.ComponentType<any>) : null;

  // Format number with commas
  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    const startValue = 0;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(startValue + (value - startValue) * progress);
      setDisplayValue(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isVisible, value]);

  return (
    <div ref={ref} className={styles.counter}>
      <div className={styles.iconWrapper}>
        {IconComponent && <IconComponent size={28} />}
      </div>
      <div className={styles.content}>
        <div className={styles.number}>
          {formatNumber(displayValue)}
          {suffix}
        </div>
        <p className={styles.label}>{label}</p>
      </div>
    </div>
  );
};
