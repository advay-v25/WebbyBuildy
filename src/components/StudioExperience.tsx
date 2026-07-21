"use client";

import { useGSAP } from "@gsap/react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import styles from "@/app/page.module.css";
import { SiteHeader } from "@/components/SiteHeader";
import { CinematicMotionField } from "@/components/CinematicMotionField";

gsap.registerPlugin(ScrollTrigger);

const founders = [
  ["Aarav", "Aher", "Engineering", "Student at Northeastern University"],
  ["Abhimanyu", "Gupta", "Aviation", "Cadet with IndiGo"],
  ["Advay", "Vaidya", "Finance", "CFA aspirant"],
] as const;

export function StudioExperience() {
  const root = useRef<HTMLDivElement>(null);
  const [activeFounder, setActiveFounder] = useState(0);

  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.from("[data-studio-copy] > *", {
      opacity: 0,
      y: 28,
      stagger: 0.08,
      duration: 0.75,
      ease: "expo.out",
    });
    gsap.from("[data-studio-founder]", {
      opacity: 0,
      x: 46,
      rotateY: -12,
      stagger: 0.12,
      duration: 1,
      ease: "expo.out",
    });
    gsap.fromTo("[data-studio-panorama]", { scale: 1.08, filter: "brightness(.55) blur(5px)" }, {
      scale: 1,
      filter: "brightness(1) blur(0px)",
      duration: 1.4,
      ease: "power3.out",
    });
    gsap.fromTo("[data-studio-grid]", { rotateY: 3, xPercent: 2 }, {
      rotateY: -3,
      xPercent: -2,
      ease: "none",
      scrollTrigger: { trigger: "[data-studio-grid]", start: "top 78%", end: "bottom 24%", scrub: 1 },
    });
    ScrollTrigger.create({
      trigger: "[data-studio-grid]",
      start: "top 68%",
      end: "bottom 38%",
      onUpdate: ({ progress }) => setActiveFounder(Math.min(founders.length - 1, Math.floor(progress * founders.length))),
    });
    gsap.from("[data-manifesto]", {
      opacity: 0,
      y: 70,
      clipPath: "inset(24% 0 24% 0 round 28px)",
      ease: "power3.out",
      scrollTrigger: { trigger: "[data-manifesto]", start: "top 84%", end: "top 42%", scrub: .8 },
    });
    gsap.fromTo("[data-manifesto-signal]", { scaleX: 0 }, {
      scaleX: 1,
      ease: "none",
      scrollTrigger: { trigger: "[data-manifesto]", start: "top 82%", end: "bottom 48%", scrub: .7 },
    });
    gsap.fromTo("[data-contact-arch]", { scaleY: .08, yPercent: 46 }, {
      scaleY: 1,
      yPercent: 0,
      ease: "none",
      scrollTrigger: { trigger: "#contact", start: "top 92%", end: "top 34%", scrub: .9 },
    });
  }, { scope: root });

  return (
    <div ref={root} className={styles.site}>
      <SiteHeader activeSection="founders" />
      <main id="main-content">
        <section className={`${styles.foundersSection} ${styles.studioPageFounders}`}>
          <CinematicMotionField variant="studio" />
          <div data-studio-copy className={styles.foundersIntro}>
            <p className={styles.mono}>MUMBAI / FOUNDERS</p>
            <h1>Three paths<br /><span>One studio</span></h1>
            <p className={styles.founderLead}>Three friends from Mumbai, building with the tools agencies will be using five years from now</p>
            <p className={styles.founderSmall}>Engineering, aviation, and finance gave us three different ways of thinking WebbyBuildy is where they meet: precise systems, calm execution, and work built to perform</p>
            <a href="#studio-manifesto" className={styles.founderButton}>Meet the studio <ArrowUpRight size={18} /></a>
          </div>
          <div data-studio-grid className={styles.founderGrid}>
            <div data-studio-panorama className={styles.founderPanorama} aria-hidden="true">
              <Image src="/images/studio-founders-panorama.png" alt="" fill priority sizes="(max-width: 800px) 100vw, 68vw" />
            </div>
            {founders.map(([first, last, discipline, bio], index) => (
              <motion.article
                data-studio-founder
                data-active={activeFounder === index}
                layout
                tabIndex={0}
                onMouseEnter={() => setActiveFounder(index)}
                onFocus={() => setActiveFounder(index)}
                onClick={() => setActiveFounder(index)}
                key={first}
                className={styles.founderPanel}
                transition={{ layout: { type: "spring", stiffness: 150, damping: 24 } }}
                animate={activeFounder === index ? { y: -8, rotateY: index === 0 ? -3 : index === 2 ? 3 : 0 } : { y: 4, rotateY: 0 }}
                whileHover={{ y: -12 }}
              >
                <ArrowUpRight className={styles.founderPanelArrow} aria-hidden="true" />
                <div><h2>{first} {last}</h2><p>{bio}</p><span className={styles.founderDiscipline}>{discipline}</span></div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="studio-manifesto" data-manifesto className={styles.studioManifesto}>
          <CinematicMotionField variant="system" />
          <span data-manifesto-signal className={styles.manifestoSignal} aria-hidden="true" />
          <p className={styles.mono}>HOW WE WORK</p>
          <h2>You talk to the people<br />doing the work</h2>
          <div>
            <p>Direct WhatsApp and calls Clear timelines A fixed written quote before we start</p>
            <p>No account managers, no agency bureaucracy, and no hand-offs between sales and production</p>
          </div>
        </section>

        <section id="contact" className={styles.contactSection}>
          <div data-contact-arch className={styles.contactArch} aria-hidden="true" />
          <div><h2>Have something<br /><span>worth building</span></h2><a href="mailto:aaravaher25@gmail.com" className={styles.email}>aaravaher25@gmail.com</a></div>
          <Link href="/book" className={styles.bookButton}>Book a free call <ArrowUpRight size={21} /></Link>
          <footer><span>Mumbai · India</span><span>WEBBYBUILDY © {new Date().getFullYear()}</span></footer>
        </section>
      </main>
    </div>
  );
}
