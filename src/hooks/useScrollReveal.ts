"use client";

import { useEffect, RefObject } from 'react';

export function useScrollReveal(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (!ref.current) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const elements = ref.current.querySelectorAll('.reveal');
      elements.forEach(el => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.1
    });

    const elements = ref.current.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [ref]);
}
