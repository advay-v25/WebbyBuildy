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
              <h3>Aarav Aher</h3>
              <p className="founder-bio">Student at Northeastern University</p>
            </div>
          </div>
          <div className="founder-card reveal" style={{ transitionDelay: '0.1s' }}>
            <div className="placeholder-image aspect-square">
              [IMAGE: founder photo 2]
            </div>
            <div className="founder-info">
              <h3>Abhimanyu Gupta</h3>
              <p className="founder-bio">Cadet with IndiGo</p>
            </div>
          </div>
          <div className="founder-card reveal" style={{ transitionDelay: '0.2s' }}>
            <div className="placeholder-image aspect-square">
              [IMAGE: founder photo 3]
            </div>
            <div className="founder-info">
              <h3>Advay Vaidya</h3>
              <p className="founder-bio">CFA Aspirant</p>
            </div>
          </div>
        </div>

        <div className="story-block reveal">
          <p className="story-text">
            We're three friends from Mumbai with one shared skill: we build fast with the AI-assisted tools agencies will be using in five years. We built and shipped our own product, PlannrAI, then started building websites for people around us. Now we do it properly. Custom design, honest timelines, a fixed written quote before we start, and you'll always talk directly to one of us three, never an account manager.
          </p>
        </div>

        <div className="how-we-work-block reveal">
          <p className="prominent-line">
            Direct WhatsApp and calls with the people building your site. Clear timelines. No account managers, no agency bureaucracy.
          </p>
        </div>

        <div className="testimonials-grid">
          <div className="testimonial-card reveal">
            <blockquote className="testimonial-quote">"[Client quote placeholder: must mention speed and communication]"</blockquote>
            <p className="testimonial-author">[Name, client type]</p>
          </div>
          <div className="testimonial-card reveal" style={{ transitionDelay: '0.1s' }}>
            <blockquote className="testimonial-quote">"[Client quote placeholder: must mention speed and communication]"</blockquote>
            <p className="testimonial-author">[Name, client type]</p>
          </div>
          <div className="testimonial-card reveal" style={{ transitionDelay: '0.2s' }}>
            <blockquote className="testimonial-quote">"[Client quote placeholder: must mention speed and communication]"</blockquote>
            <p className="testimonial-author">[Name, client type]</p>
          </div>
        </div>
      </div>
    </section>
  );
}
