import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigationItems } from '../../data/navigation';
import { socialLinks } from '../../data/socials';
import styles from './MobileMenu.module.css';
import * as Icons from 'react-icons/fi';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.menu}
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.nav
              className={styles.navContainer}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <ul className={styles.navList}>
                {navigationItems.map((item) => (
                  <motion.li key={item.label} variants={itemVariants}>
                    <a href={item.href} onClick={onClose}>
                      {item.label}
                    </a>
                    {item.children && (
                      <ul className={styles.submenu}>
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <a href={child.href} onClick={onClose}>
                              {child.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </motion.li>
                ))}
              </ul>
            </motion.nav>

            <motion.div
              className={styles.socials}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {socialLinks.map((social) => {
                const IconComponent = Icons[social.icon as keyof typeof Icons] as React.ComponentType<any>;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.platform}
                  >
                    {IconComponent && <IconComponent size={20} />}
                  </a>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
