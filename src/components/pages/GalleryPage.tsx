import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '../layout/PageTransition';
import { fadeDown, fadeUp, staggerContainer } from '../../utils/motion';
import styles from './GalleryPage.module.css';
import beforeAfter1 from '../../assets/before & after.png';
import beforeAfter2 from '../../assets/before & after (2).png';
import beforeAfter3 from '../../assets/before & after .png';
import image2 from '../../assets/2.png';
import image3 from '../../assets/3.png';
import image4 from '../../assets/4.png';
import image5 from '../../assets/5.png';
import image6 from '../../assets/6.png';
import image7 from '../../assets/7.png';
import image8 from '../../assets/8.png';
import image10 from '../../assets/10.png';
import image11 from '../../assets/11.png';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const galleryImages = [
  {
    id: 1,
    src: beforeAfter1,
    title: 'Facial Rejuvenation',
    description: 'Thread lifting transformation results',
  },
  {
    id: 2,
    src: beforeAfter2,
    title: 'Skin Enhancement',
    description: 'Advanced aesthetic treatment outcome',
  },
  {
    id: 3,
    src: beforeAfter3,
    title: 'Youthful Glow',
    description: 'Natural-looking rejuvenation',
  },
];

interface SimpleImage {
  id: number;
  src: string;
  title?: string;
  description?: string;
}

const simpleImages: SimpleImage[] = [
  { id: 4, src: image2 },
  { id: 5, src: image3 },
  { id: 6, src: image4 },
  { id: 7, src: image5 },
  { id: 8, src: image6 },
  { id: 9, src: image7 },
  { id: 10, src: image8 },
  { id: 11, src: image10 },
  { id: 12, src: image11 },
];

const allImages: SimpleImage[] = [...galleryImages, ...simpleImages];

export const GalleryPage: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const goToPrevious = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? galleryImages.length - 1 : selectedImage - 1);
    }
  }, [selectedImage]);

  const goToNext = useCallback(() => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === galleryImages.length - 1 ? 0 : selectedImage + 1);
    }
  }, [selectedImage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, goToPrevious, goToNext]);
  return (
    <PageTransition>
      {/* Hero Banner - Same design as About page */}
      <section className={styles.heroBanner}>
        <motion.div
          className={styles.bannerContent}
          initial="hidden"
          animate="visible"
          variants={fadeDown}
          transition={{ duration: 0.6 }}
        >
          <h1>Before & After</h1>
          <p>Real Results, Real Transformations</p>
        </motion.div>
      </section>

      {/* Gallery Section */}
      <section className={styles.gallerySection}>
        <div className={styles.container}>
          <motion.div
            className={styles.introText}
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            <h2>Witness the Transformation</h2>
            <p>
              Explore our collection of before & after results showcasing the artistry
              & expertise of Dr. Christeen Youssef's aesthetic treatments.
            </p>
          </motion.div>

          <motion.div
            className={styles.galleryGrid}
            initial="hidden"
            whileInView="visible"
            variants={staggerContainer}
            viewport={{ once: true, amount: 0.2 }}
          >
            {galleryImages.map((image, index) => (
              <motion.div
                key={image.id}
                className={`${styles.galleryCard} ${styles.simpleCard}`}
                variants={fadeUp}
                transition={{ delay: index * 0.1 }}
              >
                <div 
                  className={styles.simpleImageFrame}
                  onClick={() => openLightbox(index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openLightbox(index)}
                >
                  <img
                    src={image.src}
                    alt={image.title}
                    className={styles.galleryImage}
                  />
                </div>
              </motion.div>
            ))}

            {simpleImages.map((image, index) => (
              <motion.div
                key={image.id}
                className={`${styles.galleryCard} ${styles.simpleCard}`}
                variants={fadeUp}
                transition={{ delay: (galleryImages.length + index) * 0.1 }}
              >
                <div 
                  className={styles.simpleImageFrame}
                  onClick={() => openLightbox(galleryImages.length + index)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && openLightbox(galleryImages.length + index)}
                >
                  <img
                    src={image.src}
                    alt="Before and After"
                    className={styles.galleryImage}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className={styles.trustIndicators}
            initial="hidden"
            whileInView="visible"
            variants={fadeUp}
            viewport={{ once: true }}
          >
            <div className={styles.indicator}>
              <span className={styles.indicatorNumber}>22K+</span>
              <span className={styles.indicatorLabel}>Happy Patients</span>
            </div>
            <div className={styles.indicatorDivider} />
            <div className={styles.indicator}>
              <span className={styles.indicatorNumber}>12+</span>
              <span className={styles.indicatorLabel}>Years Experience</span>
            </div>
            <div className={styles.indicatorDivider} />
            <div className={styles.indicator}>
              <span className={styles.indicatorNumber}>100%</span>
              <span className={styles.indicatorLabel}>Natural Results</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            className={styles.lightboxOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeLightbox}
          >
            {/* Close button */}
            <button 
              className={styles.closeButton}
              onClick={closeLightbox}
              aria-label="Close lightbox"
            >
              <FiX size={28} />
            </button>

            {/* Previous button */}
            <button 
              className={`${styles.navButton} ${styles.prevButton}`}
              onClick={(e) => { e.stopPropagation(); goToPrevious(); }}
              aria-label="Previous image"
            >
              <FiChevronLeft size={32} />
            </button>

            {/* Next button */}
            <button 
              className={`${styles.navButton} ${styles.nextButton}`}
              onClick={(e) => { e.stopPropagation(); goToNext(); }}
              aria-label="Next image"
            >
              <FiChevronRight size={32} />
            </button>

            {/* Image container */}
            <motion.div 
              className={styles.lightboxContent}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.lightboxImageWrapper}>
                <img
                  src={allImages[selectedImage].src}
                  alt={allImages[selectedImage].title || 'Before and After'}
                  className={styles.lightboxImage}
                />
              </div>
              
              {/* Image info - only show if title exists */}
              {(allImages[selectedImage].title || allImages[selectedImage].description) && (
                <div className={styles.lightboxInfo}>
                  {allImages[selectedImage].title && <h3>{allImages[selectedImage].title}</h3>}
                  {allImages[selectedImage].description && <p>{allImages[selectedImage].description}</p>}
                </div>
              )}
              <span className={styles.imageCounter}>
                {selectedImage + 1} / {allImages.length}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  );
};
