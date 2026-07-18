"use client";

import { useEffect, useRef } from 'react';
import ScrollColorManager from '@/components/ui/ScrollColorManager';
import WorkSection from '@/components/ui/WorkSection';
import AboutSection from '@/components/ui/AboutSection';
import FeedbackSection from '@/components/ui/FeedbackSection';
import BookSection from '@/components/ui/BookSection';
import { View } from '@react-three/drei';
import DNA from '@/components/3d/DNA';

export default function StudioPage() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // If we have a hash in the URL, scroll to it on mount
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        // Small delay to ensure rendering is complete
        setTimeout(() => element.scrollIntoView(), 100);
      }
    }
  }, []);

  return (
    <div className="studio-page-container" ref={scrollRef}>
      <ScrollColorManager />
      
      {/* Global DNA Background layer for the studio page */}
      <div className="dna-global-background">
        <View className="dna-view" style={{ width: '100%', height: '100%' }}>
          <DNA scrollRef={scrollRef} />
        </View>
      </div>

      <WorkSection />
      <AboutSection />
      <FeedbackSection />
      <BookSection />
    </div>
  );
}
