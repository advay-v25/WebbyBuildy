"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { View } from '@react-three/drei';
import Keyboard from '@/components/3d/Keyboard';

export default function Home() {
  const router = useRouter();
  const keyboardRef = useRef<HTMLDivElement>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const triggerTransition = useCallback(() => {
    if (isTransitioning) return;
    
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    setIsSpacePressed(true);
    setIsTransitioning(true);
    
    if (prefersReducedMotion) {
      router.push('/studio#work');
    } else {
      // 900ms total transition: dolly camera for 700ms, then flash
      setTimeout(() => {
        setIsFlashing(true);
      }, 700);

      setTimeout(() => {
        router.push('/studio#work');
      }, 900);
    }
  }, [isTransitioning, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault(); 
        triggerTransition();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerTransition]);

  const marqueeText = "First draft in days · No templates, ever · Unlimited revisions until launch · You own everything · Talk directly to the builders · Built in Mumbai · ";

  return (
    <div 
      className="hero-page"
      onClick={triggerTransition}
      onTouchStart={triggerTransition}
      onWheel={triggerTransition}
    >
      {isFlashing && <div className="flash-overlay"></div>}

      <div className="hero-content">
        <div className="hero-kicker">[BRAND NAME] — WEB DESIGN STUDIO, MUMBAI</div>
        <h1 className="hero-title">
          <span className="muted-line" style={{ color: '#9CA3AF' }}>Most websites take months and cost lakhs.</span>
          <br />
          <strong className="bright-line" style={{ color: 'white' }}>Yours will take days.</strong>
        </h1>
        <p className="hero-subline">
          Custom-designed websites for your brand or business — built by three people you'll actually talk to.
        </p>
      </div>

      <div className="keyboard-zone">
        <div className="keyboard-container" ref={keyboardRef}>
          <View className="keyboard-view" style={{ width: '100%', height: '100%' }}>
            <Keyboard isSpacePressed={isSpacePressed} transitioning={isTransitioning} />
          </View>
        </div>
      </div>

      <div className="cta-prompt-container">
        <div className="cta-prompt">
          <span className="prompt-text desktop-only">press <span className={`spacebar-key ${isSpacePressed ? 'pressed' : ''}`}>[ SPACE ]</span> to see our work</span>
          <span className="prompt-text mobile-only">tap the spacebar</span>
        </div>
      </div>

      <div className="marquee-container">
        <div className="marquee-track">
          <div className="marquee-content">{marqueeText}</div>
          <div className="marquee-content">{marqueeText}</div>
        </div>
      </div>
    </div>
  );
}
