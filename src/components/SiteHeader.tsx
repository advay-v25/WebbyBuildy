"use client";

import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import styles from "@/app/page.module.css";

type Section = "top" | "work" | "process" | "founders" | "contact";

export function SiteHeader({ activeSection = "top" }: { activeSection?: Section }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={styles.header} data-active-section={activeSection}>
      {/* Plain anchor (not next/link) so it does a full navigation to "/" —
          this resets the hero to its pre-animation, SPACE-gated first-visit
          state from every page, and lands at the absolute top with no hash. */}
      <a href="/" className={styles.wordmark} aria-label="Sitesmith home" onClick={closeMenu}>
        SITESMITH
      </a>
      <button
        className={styles.menuButton}
        onClick={() => setMenuOpen((open) => !open)}
        aria-expanded={menuOpen}
        aria-controls="site-navigation"
        aria-label="Toggle navigation"
      >
        <span />
        <span />
      </button>
      <nav id="site-navigation" className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`} aria-label="Main navigation">
        <Link data-active={activeSection === "work"} href="/#work" onClick={closeMenu}>Work</Link>
        <Link data-active={activeSection === "process"} href="/#process" onClick={closeMenu}>Process</Link>
        <Link data-active={activeSection === "founders"} href="/studio" onClick={closeMenu}>Studio</Link>
        <Link data-magnetic href="/book" className={styles.navCta} onClick={closeMenu}>
          Start a project <ArrowUpRight size={15} />
        </Link>
      </nav>
    </header>
  );
}
