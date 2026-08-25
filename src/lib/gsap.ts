'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Register once, here, so no component has to think about plugin setup.
// useGSAP is registered as a plugin per GSAP's React guidance.
gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);

// House style for every tween that doesn't override it. Matches --ease-brand.
gsap.defaults({
  ease: 'power3.out',
  duration: 1,
});

export { gsap, ScrollTrigger, SplitText, useGSAP };
