import React, { useState } from 'react';
import { useScrollPosition } from '../../hooks/useScrollPosition';
import { navigationItems } from '../../data/navigation';
import { MobileMenu } from './MobileMenu';
import { ScrollProgress } from './ScrollProgress';
import styles from './Header.module.css';
import { FiMenu, FiX } from 'react-icons/fi';
import logo from '../../assets/Dr.-CY-Logo-FINAL-023-scaled (1).webp';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollPosition = useScrollPosition();

  return (
    <>
      <ScrollProgress />
      <header className={`${styles.header} ${scrollPosition > 50 ? styles.scrolled : ''}`}>
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logo}>
            <a href="/" className={styles.logoLink}>
              <img src={logo} alt="Logo" />
            </a>
          </div>

          {/* Main Navigation */}
          <nav className={styles.nav}>
            <ul className={styles.navList}>
              {navigationItems.map((item) => (
                <li key={item.label} className={styles.navItem}>
                  <a href={item.href} className={styles.navLink}>
                    {item.label}
                  </a>
                  {item.children && (
                    <ul className={styles.submenu}>
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <a href={child.href} className={styles.submenuLink}>{child.label}</a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Book Consultation CTA */}
          <div className={styles.contact}>
            <a href="/appointment" className={styles.bookButton} title="Book a consultation">
              Book Consultation
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            className={styles.mobileMenuButton}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
};
