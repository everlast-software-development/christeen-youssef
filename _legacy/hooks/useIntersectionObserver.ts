import { useRef, useState, useEffect } from 'react';
import type { RefObject } from 'react';

interface IntersectionOptions {
  threshold?: number | number[];
  rootMargin?: string;
  root?: Element | null;
}

export const useIntersectionObserver = (
  options: IntersectionOptions = {}
): [RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, {
      threshold: options.threshold || 0.1,
      rootMargin: options.rootMargin || '0px',
      root: options.root || null
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return [ref, isVisible];
};
