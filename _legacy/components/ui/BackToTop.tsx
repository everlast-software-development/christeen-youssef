import React, { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import styles from './BackToTop.module.css';

export const BackToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) return null;

  return (
    <button className={styles.button} onClick={scrollToTop} aria-label="Back to top">
      <FiArrowUp size={20} />
    </button>
  );
};
