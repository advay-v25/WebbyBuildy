"use client";

import { useRef } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="work" className="section work-section" ref={sectionRef}>
      <div className="container relative-content">
        <div className="work-content">
          <div className="reveal">
            <h2 className="section-title">What we've built</h2>
            <p className="section-intro text-muted">Real projects, real clients, real deadlines.</p>
          </div>
          
          <div className="work-grid">
            <div className="work-card work-card-wide reveal">
              <div className="work-card-header">
                <span className="client-type">AND WHEN THE PROJECT IS BIGGER…</span>
                <h3>PlannrAI</h3>
              </div>
              <div className="placeholder-image aspect-wide">
                [IMAGE: PlannrAI screens]
              </div>
              <div className="work-card-content">
                <p className="work-details">A full AI-powered day-planning web app for college students — designed, built, and shipped by us as co-founders. Not a client website: a complete software product.</p>
              </div>
            </div>

            <div className="work-card reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="placeholder-image aspect-video">
                [IMAGE: client site 1 screenshot]
              </div>
              <div className="work-card-content">
                <span className="client-type">PERSONAL BRAND SITE</span>
                <h3>[Client 1 name] — [profession]</h3>
                <p className="work-details">Goal: a credible online identity that looks as good as their work.</p>
                <p className="built-in">Built in [X] days.</p>
                <blockquote className="pull-quote">"[Client quote placeholder — speed and communication]"</blockquote>
              </div>
            </div>

            <div className="work-card reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="placeholder-image aspect-video">
                [IMAGE: client site 2 screenshot]
              </div>
              <div className="work-card-content">
                <span className="client-type">SMALL BUSINESS SITE</span>
                <h3>[Client 2 business name]</h3>
                <p className="work-details">Goal: a professional presence that brings enquiries, not just exists.</p>
                <p className="built-in">Built in [X] days.</p>
                <blockquote className="pull-quote">"[Client quote placeholder — speed and communication]"</blockquote>
              </div>
            </div>
          </div>

          <div className="services-block reveal">
            <h3>Whatever you need, we build it</h3>
            <div className="tag-chips">
              <span className="chip">personal brand sites</span>
              <span className="chip">lead-generation sites</span>
              <span className="chip">booking systems</span>
              <span className="chip">clinic & salon sites</span>
              <span className="chip">restaurant sites</span>
              <span className="chip">galleries</span>
              <span className="chip">WhatsApp integration</span>
              <span className="chip">payment links</span>
              <span className="chip">multilingual sites</span>
              <span className="chip">logo & brand kits</span>
            </div>
            <p className="prominent-line">
              Whatever you need your website to do, tell us on a call — we'll figure out the right build together. No request is too small or too odd.
            </p>
          </div>

          <div className="included-block reveal">
            <h3>Included in every site</h3>
            <ul className="included-list">
              <li>mobile-responsive design</li>
              <li>contact & enquiry forms</li>
              <li>WhatsApp click-to-chat</li>
              <li>Google Maps where relevant</li>
              <li>basic SEO setup</li>
              <li>fast load speeds</li>
              <li>a walkthrough of how to use it</li>
            </ul>
          </div>

          <div className="timeline-block reveal">
            <h3>How it works</h3>
            <div className="timeline">
              <div className="timeline-step">
                <div className="step-number">1</div>
                <p><strong>Free 20-minute intro call</strong> — we understand your goals, style, and content.</p>
              </div>
              <div className="timeline-step">
                <div className="step-number">2</div>
                <p><strong>Written proposal within 48 hours</strong> — exact scope, timeline, and a fixed price. No hourly billing, no surprises.</p>
              </div>
              <div className="timeline-step">
                <div className="step-number">3</div>
                <p><strong>First draft in days</strong> — a real working site, not sketches. Unlimited revisions until you love it.</p>
              </div>
              <div className="timeline-step">
                <div className="step-number">4</div>
                <p><strong>Launch & handover</strong> — your site goes live. You own everything: domain, content, code.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
