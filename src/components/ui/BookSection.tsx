"use client";

import { useState, useRef, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { CALENDLY_URL } from '@/lib/constants';

export default function BookSection() {
  const [isHovering, setIsHovering] = useState(false);
  const [loadCalendly, setLoadCalendly] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const calendlyRef = useRef<HTMLDivElement>(null);
  
  useScrollReveal(sectionRef);

  useEffect(() => {
    const currentRef = calendlyRef.current;
    if (!currentRef) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadCalendly(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (loadCalendly) {
      const script = document.createElement('script');
      script.src = 'https://assets.calendly.com/assets/external/widget.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, [loadCalendly]);

  useEffect(() => {
    // Only apply scroll-based hover for touch devices
    if (window.matchMedia('(hover: none)').matches) {
      const currentRef = calendlyRef.current;
      if (!currentRef) return;
      
      const hoverObserver = new IntersectionObserver(
        (entries) => {
          setIsHovering(entries[0].isIntersecting);
        },
        { threshold: 0.3 }
      );
      
      hoverObserver.observe(currentRef);
      return () => hoverObserver.disconnect();
    }
  }, []);

  return (
    <section id="book" className={`section book-section ${isHovering ? 'bulb-lit' : ''}`} ref={sectionRef}>
      <div className="container relative-content z-10">
        <div className="book-two-column-layout">
          
          <div className="book-left-column">
            {/* Lightbulb SVG Background Effect - Moved to left column */}
            <div className="lightbulb-container">
              <svg viewBox="0 0 100 150" className="svg-lightbulb" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <radialGradient id="bulbGlow" cx="50%" cy="40%" r="50%">
                    <stop offset="0%" stopColor="#fff8e7" stopOpacity={isHovering ? "0.8" : "0"} />
                    <stop offset="100%" stopColor="#ffdb80" stopOpacity="0" />
                  </radialGradient>
                  <filter id="glowBlur" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="5" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                {/* Outer glow */}
                <circle cx="50" cy="50" r="45" fill="url(#bulbGlow)" className="bulb-glow-layer" />

                {/* Glass envelope (A-shape) */}
                <path 
                  d="M50 10 C30 10, 20 25, 20 45 C20 65, 35 75, 35 90 L35 110 L65 110 L65 90 C65 75, 80 65, 80 45 C80 25, 70 10, 50 10 Z" 
                  fill="transparent" 
                  stroke={isHovering ? "#fff" : "#555"} 
                  strokeWidth="1.5" 
                  className="bulb-glass"
                />
                
                {/* Inner support posts */}
                <line x1="42" y1="110" x2="42" y2="70" stroke="#555" strokeWidth="1" />
                <line x1="58" y1="110" x2="58" y2="70" stroke="#555" strokeWidth="1" />
                
                {/* Tungsten filament (zigzag) */}
                <polyline 
                  points="42,70 45,60 50,65 55,60 58,70" 
                  fill="none" 
                  stroke={isHovering ? "#fff5cc" : "#885522"} 
                  strokeWidth={isHovering ? "2.5" : "1.5"} 
                  className="bulb-filament"
                  filter={isHovering ? "url(#glowBlur)" : "none"}
                />

                {/* Metal screw base with threads */}
                <rect x="35" y="110" width="30" height="25" fill="#333" rx="2" />
                <line x1="33" y1="115" x2="67" y2="115" stroke="#555" strokeWidth="2" strokeLinecap="round" />
                <line x1="33" y1="122" x2="67" y2="122" stroke="#555" strokeWidth="2" strokeLinecap="round" />
                <line x1="33" y1="129" x2="67" y2="129" stroke="#555" strokeWidth="2" strokeLinecap="round" />
                
                {/* Bottom contact tip */}
                <path d="M42 135 C42 140, 58 140, 58 135 Z" fill="#222" />
              </svg>
            </div>
            
            <div className="book-text-content relative z-10">
              <h2 className="section-title">Got an idea? Let's talk.</h2>
              <div className="section-descriptor">
                <p className="descriptor-lead"><strong>A free, no-obligation 30-minute call.</strong></p>
                <p className="descriptor-body text-muted">When booking, leave your name and a line on what you need the website for — it helps us come prepared.</p>
                <p className="descriptor-body text-muted" style={{ marginTop: '0.75rem' }}>Within 48 hours of the call, you'll receive a written proposal with a fixed price and a clear timeline. Decide in your own time.</p>
              </div>

              <div className="alternative-contact reveal" style={{ marginTop: '3rem' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
                  <a href="mailto:aaravaher25@gmail.com" className="contact-link">aaravaher25@gmail.com</a>
                  <span className="dot-separator hidden-mobile">·</span>
                  <a href="tel:+919619011111" className="contact-link">+91 96190 11111</a>
                  <span className="dot-separator hidden-mobile">·</span>
                  <a href="https://wa.me/919619011111" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div 
            className="book-right-column scheduler-embed reveal" 
            ref={calendlyRef}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {loadCalendly ? (
              <div 
                className="calendly-inline-widget" 
                data-url={CALENDLY_URL} 
                style={{ minWidth: '320px', height: '630px', width: '100%' }}
              />
            ) : (
              <div className="placeholder-image scheduler-placeholder" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', minHeight: '630px' }}>
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>
                  Open the booking page →
                </a>
              </div>
            )}
          </div>
          
        </div>
      </div>

      <footer className="footer reveal">
        <div className="container footer-content">
          <div className="footer-links">
            <a href="mailto:aaravaher25@gmail.com">aaravaher25@gmail.com</a>
            <span className="dot-separator">·</span>
            <a href="tel:+919619011111">+91 96190 11111</a>
            <span className="dot-separator">·</span>
            <span>Mumbai</span>
            <span className="dot-separator">·</span>
            <a href="#">[Social Link 1]</a>
            <span className="dot-separator">·</span>
            <a href="#">[Social Link 2]</a>
          </div>
          <p className="footer-note text-muted">This site is our own work — it's what a first draft from us looks like.</p>
        </div>
      </footer>
    </section>
  );
}
