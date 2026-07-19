"use client";

import { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const faqs = [
  {
    q: "How much does a website cost?",
    a: "Every project gets a fixed, written quote in your proposal within 48 hours of the intro call. No hourly billing, no surprises. You pay an advance to begin, and the balance only once your site is live."
  },
  {
    q: "How fast is \"fast\"?",
    a: "First draft in days. Launch typically in [1–2 weeks]."
  },
  {
    q: "Who owns the website after launch?",
    a: "You do: domain, content, code, everything."
  },
  {
    q: "Is it a template?",
    a: "No. Every site is designed from scratch for you. AI-accelerated tools are why we're fast, not why it's generic."
  },
  {
    q: "What counts as a revision?",
    a: "Unlimited revisions until launch. Changes to agreed scope are quoted separately, in writing, before we do them."
  },
  {
    q: "What happens after launch?",
    a: "A handover walkthrough, plus optional maintenance if you want it."
  },
  {
    q: "What do you need from me?",
    a: "Content, photos, and a call. We handle the rest, including writing your copy if needed."
  }
];

export default function FeedbackSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="feedback" className="section feedback-section" ref={sectionRef}>
      <div className="container relative-content">
        <div className="feedback-grid">
          <div className="feedback-form-block reveal">
            <h2 className="section-title" style={{ marginBottom: '1rem' }}>Let us know your feedback</h2>
            <p className="section-intro">
              Tell us what you think: of this site, of an idea you have, of anything.
            </p>
            
            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a 
                href="mailto:aaravaher25@gmail.com" 
                style={{ 
                  color: 'var(--accent)', 
                  fontWeight: 700, 
                  textDecoration: 'none', 
                  fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
                  display: 'inline-block',
                  transition: 'transform 0.2s ease, text-decoration 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.textDecoration = 'underline';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.textDecoration = 'none';
                }}
              >
                aaravaher25@gmail.com
              </a>
              <p className="text-muted" style={{ fontSize: '1.1rem' }}>
                or <a href="https://wa.me/919619011111" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'underline' }}>WhatsApp us</a>
              </p>
            </div>
          </div>

          <div className="faq-block reveal">
            <h2>Questions, answered</h2>
            <div className="accordion">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`accordion-item ${openIndex === idx ? 'open' : ''}`}>
                  <button 
                    className="accordion-trigger" 
                    onClick={() => toggleFaq(idx)}
                    aria-expanded={openIndex === idx}
                  >
                    {faq.q}
                    <ChevronDown className="accordion-icon" />
                  </button>
                  <div className="accordion-content">
                    <p>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
