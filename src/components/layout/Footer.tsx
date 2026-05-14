import React from 'react';
import { navigationItems } from '../../data/navigation';
import { socialLinks } from '../../data/socials';
import styles from './Footer.module.css';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaSnapchatGhost,
  FaWhatsapp,
  FaYoutube
} from 'react-icons/fa';
import { SiTiktok } from 'react-icons/si';
import logoImage from '../../assets/Dr.-CY-Logo-FINAL-023-scaled (1).webp';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Brand & Newsletter Section */}
        <div className={styles.brandSection}>
          <div className={styles.brandHeader}>
            <img src={logoImage} alt="Dr. Christeen Youssef Logo" className={styles.brandLogo} />
            <h3 className={styles.brandTitle}>Dr. Christeen Youssef</h3>
          </div>
          <p className={styles.description}>
            Elevating aesthetic dermatology through clinical excellence, advanced therapies,
            & a deeply personalized approach to your skin health journey.
          </p>

        </div>

        {/* Links Section */}
        <div className={styles.linksSection}>
          <h4 className={styles.sectionTitle}>Explore</h4>
          <ul className={styles.links}>
            {navigationItems.map((item) => (
              <li key={item.label}>
                <a href={item.href} className={styles.linkItem}>{item.label}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact & Social Section */}
        <div className={styles.contactSection}>
          <h4 className={styles.sectionTitle}>Reach Out</h4>
          <div className={styles.contactItems}>
            <div className={styles.contactItem}>
              <FiMail className={styles.contactIcon} />
              <a href="mailto:christeen.youssef@everlastwellness.com">
                christeen.youssef@everlastwellness.com
              </a>
            </div>
            <div className={styles.contactItem}>
              <FiPhone className={styles.contactIcon} />
              <a href="tel:+971600551615">+971 600 551615</a>
            </div>
            <div className={styles.contactItem}>
              <FiMapPin className={styles.contactIcon} />
              <span>
                446 Al Khaleej Al Arabi St<br />
                Al Bateen, Abu Dhabi, UAE
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomContent}>
          <p>&copy; {currentYear} Dr. Christeen Youssef. All rights reserved.</p>
          <div className={styles.bottomSocials}>
            {socialLinks.map((social) => {
              let IconComponent: React.ComponentType<any> | null = null;

              switch (social.platform.toLowerCase()) {
                case 'facebook':
                  IconComponent = FaFacebookF;
                  break;
                case 'linkedin':
                  IconComponent = FaLinkedinIn;
                  break;
                case 'instagram':
                  IconComponent = FaInstagram;
                  break;
                case 'snapchat':
                  IconComponent = FaSnapchatGhost;
                  break;
                case 'tiktok':
                  IconComponent = SiTiktok;
                  break;
                case 'whatsapp':
                  IconComponent = FaWhatsapp;
                  break;
                case 'youtube':
                  IconComponent = FaYoutube;
                  break;
                default:
                  IconComponent = null;
              }

              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.platform}
                  className={styles.bottomSocialLink}
                >
                  {IconComponent && <IconComponent size={16} />}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};
