import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import { testimonials } from '../../data/testimonials';
import { FiStar } from 'react-icons/fi';
import styles from './TestimonialsSection.module.css';
import { fadeUp } from '../../utils/motion';

// @ts-ignore
import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';
// @ts-ignore
// @ts-ignore
import 'swiper/css/pagination';

export const TestimonialsSection: React.FC = () => {
  return (
    <section className={styles.section} id="testimonials">
      <div className={styles.container}>
        <motion.div
           initial="hidden"
           whileInView="visible"
           viewport={{ once: true, margin: "-100px" }}
           variants={fadeUp}
        >
          <SectionHeading
            title="What Our Patients Say"
            subtitle="Experiences & Success Stories"
            centered
          />
        </motion.div>

        <motion.div 
          className={styles.sliderWrapper}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={fadeUp}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className={styles.swiper}
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id} className={styles.swiperSlide}>
                <div className={styles.card}>
                  <div className={styles.quoteWatermark}>"</div>
                  
                  <div className={styles.contentWrapper}>
                    {testimonial.rating && (
                      <div className={styles.rating}>
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <FiStar key={i} size={16} fill="currentColor" strokeWidth={0} />
                        ))}
                      </div>
                    )}
                    <p className={styles.content}>"{testimonial.content}"</p>
                  </div>

                  <div className={styles.authorWrapper}>
                    <div className={styles.authorLine}></div>
                    <h4 className={styles.name}>{testimonial.name}</h4>
                    {testimonial.role && (
                      <p className={styles.role}>{testimonial.role}</p>
                    )}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};
