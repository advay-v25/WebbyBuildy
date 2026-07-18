"use client";

import BookSection from '@/components/ui/BookSection';
import { useEffect } from 'react';

export default function BookPage() {
  useEffect(() => {
    // Force the background color for the standalone book page to the final state
    document.body.style.setProperty('--bg-color', '#F7F5F2');
    document.body.style.setProperty('--text-color', '#0A0A0A');
    document.body.style.setProperty('--text-muted-color', '#555555');
    
    return () => {
      document.body.style.removeProperty('--bg-color');
      document.body.style.removeProperty('--text-color');
      document.body.style.removeProperty('--text-muted-color');
    }
  }, []);

  return (
    <div className="book-page-standalone">
      <BookSection />
    </div>
  );
}
