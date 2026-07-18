"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Toolbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`toolbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="toolbar-container">
        <Link href="/" className="wordmark">
          <span className="logo-box">[LOGO]</span>
          <span className="brand-name">[BRAND NAME]</span>
        </Link>
        
        <button 
          className="mobile-menu-toggle" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>

        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`}>
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <Link href="/studio#work" onClick={() => setIsMobileMenuOpen(false)}>Work</Link>
          <Link href="/studio#about" onClick={() => setIsMobileMenuOpen(false)}>About</Link>
          <Link href="/studio#feedback" onClick={() => setIsMobileMenuOpen(false)}>FAQ</Link>
          <Link href="/studio#book" className="btn-primary btn-nav" onClick={() => setIsMobileMenuOpen(false)}>
            Book a Free Call
          </Link>
        </nav>
      </div>
    </header>
  );
}
