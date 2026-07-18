"use client";

import { useEffect } from 'react';

// Define the color stops for each section
const colorStops = [
  { id: 'work', bg: [10, 10, 10] },         // #0A0A0A
  { id: 'about', bg: [214, 211, 206] },     // #D6D3CE (warm light gray)
  { id: 'feedback', bg: [229, 229, 229] },  // #E5E5E5
  { id: 'book', bg: [247, 245, 242] },      // #F7F5F2
];

function interpolateColor(color1: number[], color2: number[], factor: number) {
  const result = color1.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
  }
  return result;
}

// Calculate relative luminance based on WCAG
function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
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

      document.body.style.setProperty('--bg-color', `rgb(${interpolatedBg[0]}, ${interpolatedBg[1]}, ${interpolatedBg[2]})`);
      document.body.style.setProperty('--bg-rgb', `${interpolatedBg[0]}, ${interpolatedBg[1]}, ${interpolatedBg[2]}`);
      
      // Determine contrast threshold using exact WCAG luminance
      const luminance = getLuminance(interpolatedBg[0], interpolatedBg[1], interpolatedBg[2]);
      
      if (luminance > 0.45) {
        document.body.setAttribute('data-theme', 'light');
      } else {
        document.body.setAttribute('data-theme', 'dark');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run once on mount
    setTimeout(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      // Reset styles when leaving page
      document.body.style.removeProperty('--bg-color');
      document.body.style.removeProperty('--bg-rgb');
      document.body.removeAttribute('data-theme');
    };
  }, []);

  return null; // This is a logic-only component
}

