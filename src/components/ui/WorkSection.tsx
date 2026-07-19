/* eslint-disable */
"use client";

import { useRef, useState, useEffect } from 'react';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import Image, { StaticImageData } from 'next/image';
import plannraiLogo from '../../../public/images/plannrai-logo.png';
import plannraiHero from '../../../public/images/plannrai-hero.png';
import client3Consulting from '../../../public/images/client3-consulting.png';

interface WorkCardProps {
  label: string;
  title: string;
  logo?: string | StaticImageData;
  linkHref?: string;
  linkText?: string;
  image?: string | StaticImageData;
  imagePlaceholderText?: string;
  goal: string;
  meta: string;
  quote: string;
  delay?: string;
}

function WorkCard({ label, title, logo, linkHref, linkText, image, imagePlaceholderText, goal, meta, quote, delay }: WorkCardProps) {
  return (
    <div className="work-card" style={delay ? { transitionDelay: delay } : undefined}>
      <div className="work-card-header" style={{ marginBottom: '1rem' }}>
        <span className="client-type">{label}</span>
        {logo ? (
          <div className="flex items-center gap-4 plannrai-title-row" style={{ marginTop: '0.5rem' }}>
            <Image src={logo} alt={`${title} Logo`} width={40} height={40} className="plannrai-logo rounded-md" />
            <h3>{title}</h3>
          </div>
        ) : (
          <h3 style={{ marginTop: '0.5rem' }}>{title}</h3>
        )}
        {(linkHref && linkText) && (
          <a 
            href={linkHref} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()}
            style={{ 
              display: 'inline-block', 
              marginTop: '0.5rem', 
              color: 'var(--text-muted-color)',
              fontSize: '0.875rem',
              textDecoration: 'none',
              transition: 'color 0.2s ease, text-decoration 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent)';
              e.currentTarget.style.textDecoration = 'underline';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted-color)';
              e.currentTarget.style.textDecoration = 'none';
            }}
          >
            {linkText}
          </a>
        )}
      </div>
      
      <div className="placeholder-image aspect-video w-full rounded-xl overflow-hidden" style={{ minHeight: 'auto', position: 'relative' }}>
        {image ? (
          <Image src={image} alt={title} fill className="object-cover" style={{ objectPosition: 'top center' }} />
        ) : (
          imagePlaceholderText
        )}
      </div>

      <div className="work-card-content" style={{ marginTop: '1rem' }}>
        <p className="work-details" style={{ fontSize: '1.1rem' }}>{goal}</p>
        <p className="built-in">{meta}</p>
        <blockquote className="pull-quote">"{quote}"</blockquote>
      </div>
    </div>
  );
}

export default function WorkSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  useScrollReveal(sectionRef);

  useEffect(() => {
    const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isCompleted || prefersReducedMotion) {
      if (prefersReducedMotion && !isCompleted) setIsCompleted(true);
      return;
    }

    const isTouchDevice = window.matchMedia('(hover: none)').matches;

    const handleProgress = (currentProgress: number) => {
      setProgress((prev) => {
        const next = Math.max(prev, currentProgress);
        if (next >= 1) {
          setIsCompleted(true);
          return 1;
        }
        return next;
      });
    };

    if (isTouchDevice) {
      const handleScroll = () => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        let p = (windowHeight - rect.top - windowHeight * 0.1) / (rect.height * 0.8);
        p = Math.max(0, Math.min(1, p));
        handleProgress(p);
      };
      
      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      const handleMouseMove = (e: MouseEvent) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        if (e.clientY >= rect.top - 100 && e.clientY <= rect.bottom + 100) {
          let p = (e.clientX - rect.left) / rect.width;
          p = Math.max(0, Math.min(1, p));
          handleProgress(p);
        }
      };
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isCompleted]);

  const steps = [
    { num: 1, title: 'Free intro call', text: 'Free 30-minute intro call: we understand your goals, style, and content.' },
    { num: 2, title: 'Proposal in 48 hours', text: 'Written proposal within 48 hours: exact scope, timeline, and a fixed price. No hourly billing, no surprises.' },
    { num: 3, title: 'First draft in days', text: 'A real, working website that can be reviewed on a call. No sketches or rough drafts.' },
    { num: 4, title: 'Unlimited revisions', text: 'We refine until you love it. Unlimited revisions until launch, at no extra cost.' },
    { num: 5, title: 'Launch & handover', text: 'Your site goes live. You own everything: domain, content, code.' }
  ];

  return (
    <section id="work" className="section work-section" ref={sectionRef}>
      <div className="container relative-content">
        <div className="work-content">
          <div className="reveal">
            <h2 className="section-title">What we've built</h2>
            <p className="section-intro text-muted">Real projects, real clients, real deadlines.</p>
          </div>
          
          <div className="work-grid">
            <WorkCard 
              label="AND WHEN THE PROJECT IS BIGGER…"
              title="PlannrAI"
              logo={plannraiLogo}
              linkHref="https://plannrai.in"
              linkText="plannrai.in"
              image={plannraiHero}
              goal="Goal: prove we can build far more than websites."
              meta="Built and shipped as co-founders."
              quote="A complete AI-powered software product with multiple APIs and functions: designed, built, and launched by us."
            />
            <WorkCard 
              label="PERSONAL BRAND SITE"
              title="[Client 1 name], [profession]"
              imagePlaceholderText="[IMAGE: client site 1 screenshot]"
              goal="Goal: a credible online identity that looks as good as their work."
              meta="Built in [X] days."
              quote="[Client quote placeholder: speed and communication]"
              delay="0.1s"
            />
            <WorkCard 
              label="CONSULTING & PERSONAL BRAND SITE"
              title="Private Consulting Website"
              image={client3Consulting}
              goal="Goal: a private consulting page that positions an individual brand."
              meta="Built in [X] days."
              quote="[Client quote placeholder: speed and communication]"
              delay="0.2s"
            />
          </div>

          <div className="services-block reveal">
            <h3>Whatever you need, we build it</h3>
            <div className="tag-chips">
              <span className="chip" tabIndex={0}>Personal brand sites</span>
              <span className="chip" tabIndex={0}>Lead-generation sites</span>
              <span className="chip" tabIndex={0}>Booking systems</span>
              <span className="chip" tabIndex={0}>Clinic & salon sites</span>
              <span className="chip" tabIndex={0}>Restaurant sites</span>
              <span className="chip" tabIndex={0}>Galleries</span>
              <span className="chip" tabIndex={0}>WhatsApp integration</span>
              <span className="chip" tabIndex={0}>Multilingual sites</span>
              <span className="chip" tabIndex={0}>Logo & brand kits</span>
            </div>
            <p className="prominent-line">
              Whatever you need your website to do, tell us on a call and we'll figure out the right build together. No request is too small or too odd.
            </p>
          </div>

          <div className="included-block reveal">
            <h3>Included in every site</h3>
            <ul className="included-list">
              <li>Mobile-responsive design</li>
              <li>Contact & enquiry forms</li>
              <li>Basic SEO setup</li>
              <li>Fast load speeds</li>
              <li>A walkthrough of how to use it</li>
            </ul>
          </div>

          <div className="timeline-block reveal" ref={timelineRef}>
            <h3>How it works</h3>
            <div className="timeline-zigzag-container">
              
              <div className="timeline-bar-base">
                <div 
                  className="timeline-bar-fill" 
                  style={{ '--progress': isCompleted ? 1 : progress } as any}
                />
              </div>

              <div className="timeline-cards-grid">
                {steps.map((step, idx) => {
                  const nodeProgressPoint = idx / (steps.length - 1); // 0, 0.25, 0.5, 0.75, 1
                  const isActive = isCompleted || progress >= (nodeProgressPoint - 0.05); // slight early trigger
                  const isTop = idx % 2 === 0;

                  return (
                    <div key={idx} className={`timeline-step-wrapper ${isTop ? 'top-card' : 'bottom-card'}`}>
                      <div className={`timeline-node ${isActive ? 'active' : ''}`}>{step.num}</div>
                      <div className="timeline-stem"></div>
                      <div 
                        className={`flip-card-container timeline-step-card ${flippedCard === idx ? 'flipped' : ''}`}
                        onClick={() => setFlippedCard(flippedCard === idx ? null : idx)}
                        style={{ animationDelay: `${idx * 0.12}s` }}
                      >
                        <div className="flip-card-inner">
                          <div className="flip-card-front">
                            <h4>{step.title}</h4>
                          </div>
                          <div className="flip-card-back">
                            <p>{step.text}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
