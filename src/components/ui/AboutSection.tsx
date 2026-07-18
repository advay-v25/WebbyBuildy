"use client";

import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="about" className="section about-section" ref={sectionRef}>
      <div className="container relative-content">
        <h2 className="section-title reveal">The three of us</h2>
        
        <div className="founders-grid">
          <div className="founder-card reveal">
            <div className="placeholder-image aspect-square">
              [IMAGE: founder photo 1]
            </div>
            <div className="founder-info">
              <h3>[Name 1] — [role]</h3>
              <p className="founder-bio">[One-line bio placeholder]</p>
            </div>
          </div>
          <div className="founder-card reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="placeholder-image aspect-square">
              [IMAGE: founder photo 2]
            </div>
            <div className="founder-info">
              <h3>[Name 2] — [role]</h3>
              <p className="founder-bio">[One-line bio placeholder]</p>
            </div>
          </div>
          <div className="founder-card reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="placeholder-image aspect-square">
              [IMAGE: founder photo 3]
            </div>
            <div className="founder-info">
              <h3>[Name 3] — [role]</h3>
              <p className="founder-bio">[One-line bio placeholder]</p>
            </div>
          </div>
        </div>

        <div className="story-block reveal">
          <p className="story-text">
            We're three university students in Mumbai who build websites the way agencies will in five years — with modern AI-assisted tools that turn months of work into days. We built and shipped our own product, PlannrAI, then started building sites for people around us. Now we do it properly: custom design, honest timelines, and you always talk directly to one of us three. [PLACEHOLDER: refine to ~150 words]
          </p>
        </div>

        <div className="how-we-work-block reveal">
          <p className="prominent-line">
            Direct WhatsApp and calls with the people building your site. Clear timelines. No account managers, no agency bureaucracy.
          </p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card reveal">
            <blockquote className="testimonial-quote">"[Client quote placeholder — must mention speed and communication]"</blockquote>
            <p className="testimonial-author">— [Name, client type]</p>
          </div>
          <div className="testimonial-card reveal" style={{ transitionDelay: '0.1s' }}>
            <blockquote className="testimonial-quote">"[Client quote placeholder — must mention speed and communication]"</blockquote>
            <p className="testimonial-author">— [Name, client type]</p>
          </div>
          <div className="testimonial-card reveal" style={{ transitionDelay: '0.2s' }}>
            <blockquote className="testimonial-quote">"[Client quote placeholder — must mention speed and communication]"</blockquote>
            <p className="testimonial-author">— [Name, client type]</p>
          </div>
        </div>
      </div>
    </section>
  );
}
