// Fade up (default section entrance)
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Fade in from left
export const fadeLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
};

// Fade in from right
export const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.7 } }
};

// Fade down
export const fadeDown = {
  hidden: { opacity: 0, y: -40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

// Simple fade in
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6 } }
};

// Stagger children container
export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
};

// Scale in (for buttons, badges)
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

// Page transition
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

// Slide in from left
export const slideInLeft = {
  hidden: { x: -100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
};

// Slide in from right
export const slideInRight = {
  hidden: { x: 100, opacity: 0 },
  visible: { x: 0, opacity: 1, transition: { duration: 0.6 } }
};

// Rotate in
export const rotateIn = {
  hidden: { opacity: 0, rotate: -20 },
  visible: { opacity: 1, rotate: 0, transition: { duration: 0.6 } }
};

// Hover lift effect
export const hoverLift = {
  hover: { y: -8, transition: { duration: 0.3 } }
};

// Hover scale effect
export const hoverScale = {
  hover: { scale: 1.05, transition: { duration: 0.3 } }
};

// Bounce animation
export const bounce = {
  initial: { y: 0 },
  animate: { y: [-8, 0], transition: { duration: 0.6, repeat: Infinity } }
};

// Pulse animation
export const pulse = {
  animate: { opacity: [1, 0.5, 1], transition: { duration: 2, repeat: Infinity } }
};
