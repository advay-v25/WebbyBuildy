"use client";

import { useState, useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function BookSection() {
  const [isHovering, setIsHovering] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <section id="book" className={`section book-section ${isHovering ? 'bulb-lit' : ''}`} ref={sectionRef}>
      {/* Lightbulb SVG Background Effect */}
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

      <div className="container relative-content z-10">
        <div className="book-header reveal">
          <h2 className="section-title">Got an idea? Let's talk.</h2>
          <p className="section-intro">A free 20-minute call. You'll get a written proposal within 48 hours — decide in your own time.</p>
        </div>

        <div className="book-grid">
          <div className="scheduler-embed reveal">
            <div className="placeholder-image scheduler-placeholder">
              [SCHEDULER EMBED — Calendly link goes here]
            </div>
          </div>

          <div className="intake-form-block reveal">
            {isSubmitted ? (
              <div className="success-state">
                <h3>Thanks for reaching out!</h3>
                <p>We'll be in touch within 24 hours to schedule our call.</p>
              </div>
            ) : (
              <form className="intake-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <input type="text" placeholder="Name" required aria-label="Name" />
                </div>
                <div className="form-group">
                  <select required aria-label="What's the site for?" defaultValue="">
                    <option value="" disabled>What's the site for?</option>
                    <option value="personal">Personal brand</option>
                    <option value="freelance">Freelance / Consulting</option>
                    <option value="small_business">Small business</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <input type="url" placeholder="Existing site URL (optional)" aria-label="Existing site URL" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="Rough timeline" required aria-label="Rough timeline" />
                </div>
                <div className="form-group">
                  <input type="text" placeholder="How did you hear about us?" required aria-label="How did you hear about us?" />
                </div>
                
                <input type="text" name="hp_field" style={{ display: 'none' }} tabIndex={-1} autoComplete="off" />

                <button 
                  type="submit" 
                  className="btn-primary btn-book"
                  onMouseEnter={() => setIsHovering(true)}
                  onMouseLeave={() => setIsHovering(false)}
                  onFocus={() => setIsHovering(true)}
                  onBlur={() => setIsHovering(false)}
                  onTouchStart={() => setIsHovering(true)}
                >
                  Book a Free Call
                </button>
                <p className="microcopy text-muted">
                  Free, no obligation.
                </p>
              </form>
            )}
          </div>
        </div>

        <div className="alternative-contact reveal">
          <a href="mailto:[email placeholder]" className="contact-link">[email placeholder]</a>
          <span className="dot-separator">·</span>
          <a href="tel:[phone placeholder]" className="contact-link">[phone placeholder]</a>
          <span className="dot-separator">·</span>
          <a href="https://wa.me/[PLACEHOLDER]" target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
            WhatsApp
          </a>
        </div>
      </div>

      <footer className="footer reveal">
        <div className="container footer-content">
          <div className="footer-links">
            <a href="mailto:[email]">[email]</a>
            <span className="dot-separator">·</span>
            <a href="tel:[phone]">[phone]</a>
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
