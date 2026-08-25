import React from 'react';
import { PageTransition } from '../layout/PageTransition';
import { HeroSection } from '../sections/HeroSection';
import { AboutSection } from '../sections/AboutSection';
import { FacilitiesSection } from '../sections/FacilitiesSection';
import { StatsSection } from '../sections/StatsSection';
import { ServicesSection } from '../sections/ServicesSection';
import { TestimonialsSection } from '../sections/TestimonialsSection';
import { ScheduleSection } from '../sections/ScheduleSection';
import { BlogSection } from '../sections/BlogSection';
import { CTASection } from '../sections/CTASection';
import { LogoCarouselSection } from '../sections/LogoCarouselSection';

export const HomePage: React.FC = () => {
  return (
    <PageTransition>
      <HeroSection />
      <AboutSection />
      <FacilitiesSection />
      <StatsSection />
      <ServicesSection />
      <TestimonialsSection />
      <ScheduleSection />
      <BlogSection />
      <CTASection />
      <LogoCarouselSection />
    </PageTransition>
  );
};
