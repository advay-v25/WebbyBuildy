"use client";

import { useEffect } from 'react';

// Define the color stops for each section
const colorStops = [
  { id: 'work', bg: [10, 10, 10], text: [255, 255, 255] },        // #0A0A0A
  { id: 'about', bg: [138, 138, 138], text: [10, 10, 10] },      // #8A8A8A
  { id: 'feedback', bg: [229, 229, 229], text: [10, 10, 10] },   // #E5E5E5
  { id: 'book', bg: [247, 245, 242], text: [10, 10, 10] },       // #F7F5F2
];

function interpolateColor(color1: number[], color2: number[], factor: number) {
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

export default function ScrollColorManager() {
  useEffect(() => {
    const handleScroll = () => {
      // Find current scroll progress through the page
      const scrollY = window.scrollY;
      
      const sections = colorStops.map(stop => document.getElementById(stop.id));
      if (!sections.every(Boolean)) return; // sections not mounted

      let currentStopIndex = 0;
      let nextStopIndex = 1;
      let factor = 0;

      for (let i = 0; i < sections.length - 1; i++) {
        const currentSection = sections[i];
        const nextSection = sections[i + 1];
        
        if (currentSection && nextSection) {
          const currentTop = currentSection.offsetTop;
          const nextTop = nextSection.offsetTop;
          
          if (scrollY >= currentTop && scrollY < nextTop) {
            currentStopIndex = i;
            nextStopIndex = i + 1;
            factor = (scrollY - currentTop) / (nextTop - currentTop);
            break;
          } else if (scrollY >= nextTop && i === sections.length - 2) {
            currentStopIndex = sections.length - 1;
            nextStopIndex = sections.length - 1;
            factor = 0;
          }
        }
      }

      const currentColor = colorStops[currentStopIndex];
      const nextColor = colorStops[nextStopIndex];

      const interpolatedBg = interpolateColor(currentColor.bg, nextColor.bg, factor);
      const interpolatedText = interpolateColor(currentColor.text, nextColor.text, factor);

      document.body.style.setProperty('--bg-color', `rgb(${interpolatedBg[0]}, ${interpolatedBg[1]}, ${interpolatedBg[2]})`);
      document.body.style.setProperty('--bg-rgb', `${interpolatedBg[0]}, ${interpolatedBg[1]}, ${interpolatedBg[2]}`);
      document.body.style.setProperty('--text-color', `rgb(${interpolatedText[0]}, ${interpolatedText[1]}, ${interpolatedText[2]})`);
      
      // Determine contrast threshold for muted text
      const brightness = (interpolatedBg[0] * 299 + interpolatedBg[1] * 587 + interpolatedBg[2] * 114) / 1000;
      if (brightness > 128) {
        document.body.style.setProperty('--text-muted-color', 'var(--text-muted-dark)');
      } else {
        document.body.style.setProperty('--text-muted-color', 'var(--text-muted-light)');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Reset colors when leaving page
      document.body.style.removeProperty('--bg-color');
      document.body.style.removeProperty('--bg-rgb');
      document.body.style.removeProperty('--text-color');
      document.body.style.removeProperty('--text-muted-color');
    };
  }, []);

  return null; // This is a logic-only component
}
