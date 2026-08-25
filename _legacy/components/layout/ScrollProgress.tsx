import React from 'react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import styles from './ScrollProgress.module.css';

export const ScrollProgress: React.FC = () => {
  const scrollPosition = useScrollPosition();
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollPosition / scrollHeight) * 100 : 0;

  return (
    <div
      className={styles.progress}
      style={{ width: `${progress}%` }}
      aria-hidden="true"
    />
  );
};
