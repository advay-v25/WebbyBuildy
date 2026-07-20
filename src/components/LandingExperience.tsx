"use client";

import { useGSAP } from "@gsap/react";
import { animate } from "animejs";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Braces, Compass, Orbit, PenTool } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useCallback, useEffect, useRef, useState } from "react";
import styles from "@/app/page.module.css";
import { SiteHeader } from "@/components/SiteHeader";
import ScrollScrubVideo from "@/components/ScrollScrubVideo";

gsap.registerPlugin(ScrollTrigger);

const founders = [
  ["Aarav", "Aher", "Student at Northeastern University"],
  ["Abhimanyu", "Gupta", "Cadet with IndiGo"],
  ["Advay", "Vaidya", "CFA aspirant"],
] as const;

const capabilities = [
  ["01", "Direction", "Clarity before pixels", Compass],
  ["02", "Design", "Beautiful, useful, on-brand", PenTool],
  ["03", "Development", "Fast, scalable, future-ready", Braces],
  ["04", "Motion", "Meaning in every movement", Orbit],
] as const;

const projects = [
  { number: "01", title: "PlannrAI", copy: "A complete AI-powered product, designed, built and launched by the three of us", live: true, image: "/images/plannrai-hero.png", link: "https://plannrai.in" },
  { number: "02", title: "Private Consulting Website", copy: "Goal: a private consulting page that positions an individual brand", live: true, image: "/images/client3-consulting.png", link: "#" },
  { number: "03", title: "Next project", copy: "There will be more work here soon", live: false, image: "", link: "#" },
] as const;

const deckPose = (index: number, active: number) => {
  const position = (index - active + projects.length) % projects.length;
  if (position === 0) return { x: "0%", y: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 6 };
  if (position === 1) return { x: "58%", y: 24, scale: 0.76, rotateY: -13, opacity: 0.56, zIndex: 3 };
  return { x: "-38%", y: 30, scale: 0.68, rotateY: 14, opacity: 0.38, zIndex: 2 };
};

const keyboardFragments = Array.from({ length: 28 }, (_, index) => {
  const columns = 7;
  const rows = 4;
  const column = index % columns;
  const row = Math.floor(index / columns);
  return {
    index,
    column,
    row,
    clipPath: `inset(${(row * 100) / rows}% ${100 - ((column + 1) * 100) / columns}% ${100 - ((row + 1) * 100) / rows}% ${(column * 100) / columns}%)`,
  };
});

export default function LandingExperience() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const introVideo = useRef<HTMLVideoElement>(null);
  const spaceKey = useRef<HTMLSpanElement>(null);
  const lenis = useLenis(() => ScrollTrigger.update());
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoSettled, setVideoSettled] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [activeCapability, setActiveCapability] = useState(0);
  const [hoveredCapability, setHoveredCapability] = useState<number | null>(null);
  const [activeFounder, setActiveFounder] = useState(0);
  const [activeSection, setActiveSection] = useState<"top" | "work" | "process" | "founders" | "contact">("top");

  const enterSite = useCallback(() => {
    setIsSpacePressed(true);
    setVideoSettled(true);
    introVideo.current?.pause();
    if (spaceKey.current) {
      animate(spaceKey.current, {
        translateY: [0, 7, 0],
        scale: [1, 0.975, 1],
        duration: 720,
        ease: "inOutQuint",
      });
    }
    const workSection = document.getElementById("work");
    const cinematicTrigger = ScrollTrigger.getById("hero-cinematic");
    const destination = workSection
      ? window.scrollY + workSection.getBoundingClientRect().top - 18
      : cinematicTrigger?.end ?? (hero.current?.offsetTop ?? 0) + window.innerHeight * 1.9;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    lenis?.scrollTo(destination, {
      duration: reducedMotion ? 0 : 4.2,
      immediate: reducedMotion,
      easing: (t) => 0.5 - Math.cos(Math.PI * t) / 2,
    });
    if (!lenis) window.scrollTo({ top: destination });
    window.setTimeout(() => setIsSpacePressed(false), 1450);
  }, [lenis]);

  const moveProject = useCallback((direction: -1 | 1) => {
    setActiveProject((current) => (current + direction + projects.length) % projects.length);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code !== "Space" || event.repeat || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      event.preventDefault();
      enterSite();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [enterSite]);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        registrations.forEach((registration) => {
          if (registration.scope.startsWith(window.location.origin)) void registration.unregister();
        });
      }).catch(() => undefined);
    }

    const fallback = window.setTimeout(() => {
      setVideoReady(true);
      setVideoSettled(true);
    }, 6500);
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);

    return () => {
      window.clearTimeout(fallback);
    };
  }, []);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
    intro
      .fromTo("[data-hero-line]", { yPercent: 110 }, { yPercent: 0, duration: 1.15, stagger: 0.08 })
      .fromTo("[data-hero-copy]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
      .fromTo("[data-space-prompt]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.4");

    const heroTimeline = gsap.timeline({
      scrollTrigger: {
        id: "hero-cinematic",
        trigger: hero.current,
        start: "top top",
        end: "+=190%",
        pin: true,
        scrub: 1.2,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (self.progress <= 0.002) {
            gsap.set("[data-space-prompt]", { opacity: 1, y: 0 });
          }
        },
      },
    });
    heroTimeline
      .to("[data-hero-copy-wrap]", { opacity: 0, y: -64, duration: 0.18, ease: "power2.in" }, 0.04)
      .to("[data-space-prompt]", { opacity: 0, y: 22, duration: 0.12, ease: "power2.in" }, 0.03)
      .to("[data-keyboard-idle]", { scale: 1.035, rotateX: -2, opacity: 0, duration: 0.22, ease: "power2.inOut" }, 0.02)
      .fromTo("[data-keyboard-pressed]", { opacity: 0, scale: 1 }, { opacity: 1, scale: 1.035, rotateX: -2, duration: 0.18, ease: "power2.out" }, 0.02)
      .set("[data-keyboard-fragment]", { opacity: 1 }, 0.1)
      .fromTo("[data-story-curtain]", { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.34, ease: "power3.inOut" }, 0.14)
      .fromTo("[data-curtain-line]", { scaleX: 0 }, { scaleX: 1, duration: 0.26, ease: "power2.out" }, 0.27)
      .fromTo("[data-curtain-copy]", { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.22, ease: "power2.out" }, 0.3)
      .to(hero.current, { "--hero-shade-opacity": 0, duration: 0.24, ease: "power1.out" }, 0.3)
      .to("[data-keyboard-fragment]", {
        xPercent: (index) => {
          const column = index % 7;
          return (column - 3) * 48;
        },
        yPercent: (index) => {
          const row = Math.floor(index / 7);
          return (row - 1.5) * 62;
        },
        z: (index) => 90 + (index % 5) * 85,
        rotateX: (index) => (index % 2 ? 1 : -1) * (8 + (index % 4) * 3),
        rotateY: (index) => (index % 3 - 1) * 15,
        rotateZ: (index) => ((index % 2 ? 1 : -1) * (4 + (index % 7) * 1.6)),
        scale: 0.68,
        filter: "blur(10px)",
        opacity: 0,
        stagger: { amount: 0.18, from: "center" },
        duration: 0.48,
        ease: "power3.inOut",
      }, 0.2)
      .to("[data-keyboard-pressed]", { opacity: 0, duration: 0.18 }, 0.44)
      .to("[data-curtain-copy]", { y: -18, duration: 0.3, ease: "none" }, 0.7);

    ([
      ["#top", "top"],
      ["#work", "work"],
      ["#process", "process"],
      ["#founders", "founders"],
      ["#contact", "contact"],
    ] as const).forEach(([selector, section]) => {
      ScrollTrigger.create({
        trigger: selector,
        start: "top 48%",
        end: "bottom 48%",
        onEnter: () => setActiveSection(section),
        onEnterBack: () => setActiveSection(section),
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((element) => {
      gsap.from(element, {
        opacity: 0,
        y: 28,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: { trigger: element, start: "top 86%", toggleActions: "play none none reverse" },
      });
    });

    const capabilityTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: "[data-capabilities]",
        start: "top 78%",
        toggleActions: "play none none reverse",
      },
    });
    capabilityTimeline
      .from("[data-capability-copy]", { opacity: 0, xPercent: -8, duration: 0.22 }, 0)
      .from("[data-system-node]", { opacity: 0, y: 70, rotateX: -28, stagger: 0.08, duration: 0.58, ease: "power2.out" }, 0.04)
      .fromTo("[data-energy-path]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.72, ease: "none" }, 0.16)
      .from("[data-capability-note]", { opacity: 0, y: 30, duration: 0.2 }, 0.62);

    gsap.utils.toArray<HTMLElement>("[data-project-panel]").forEach((panel, index) => {
      gsap.from(panel, {
        opacity: 0,
        clipPath: index === 0 ? "inset(0 0 100% 0 round 28px)" : "inset(0 0 0 100% round 28px)",
        duration: 0.9,
        ease: "expo.out",
        scrollTrigger: { trigger: panel, start: "top 88%" },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-zoom-media]").forEach((media) => {
      gsap.fromTo(media, { scale: 1.08 }, {
        scale: 1,
        ease: "none",
        scrollTrigger: { trigger: media, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((layer, index) => {
      gsap.fromTo(layer, { yPercent: index % 2 ? -8 : 8 }, {
        yPercent: index % 2 ? 8 : -8,
        ease: "none",
        scrollTrigger: { trigger: layer.parentElement, start: "top bottom", end: "bottom top", scrub: 0.8 },
      });
    });


    gsap.fromTo("[data-founder-panel]", {
      opacity: 0,
      clipPath: "inset(0 100% 0 0 round 26px)",
    }, {
      opacity: 1,
      clipPath: "inset(0 0% 0 0 round 26px)",
      stagger: 0.08,
      ease: "none",
      scrollTrigger: { trigger: "[data-founder-grid]", start: "top 94%", end: "top 56%", scrub: 0.75 },
    });

    ScrollTrigger.create({
      trigger: "[data-founder-grid]",
      start: "top 88%",
      end: "bottom 46%",
      onUpdate: ({ progress }) => setActiveFounder(Math.min(founders.length - 1, Math.floor(progress * founders.length))),
    });

    gsap.fromTo("[data-contact-arch]", { scaleY: 0.08, yPercent: 46 }, {
      scaleY: 1,
      yPercent: 0,
      ease: "none",
      scrollTrigger: { trigger: "#contact", start: "top 92%", end: "top 34%", scrub: 0.9 },
    });

    const cleanups: Array<() => void> = [];
    gsap.utils.toArray<HTMLElement>("[data-magnetic]").forEach((element) => {
      const xTo = gsap.quickTo(element, "--magnet-x", { duration: 0.35, ease: "power3.out" });
      const yTo = gsap.quickTo(element, "--magnet-y", { duration: 0.35, ease: "power3.out" });
      const onMove = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        xTo((event.clientX - rect.left - rect.width / 2) * 0.16);
        yTo((event.clientY - rect.top - rect.height / 2) * 0.16);
      };
      const onLeave = () => { xTo(0); yTo(0); };
      element.addEventListener("mousemove", onMove);
      element.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        element.removeEventListener("mousemove", onMove);
        element.removeEventListener("mouseleave", onLeave);
      });
    });

    gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((element) => {
      const rotateXTo = gsap.quickTo(element, "--tilt-x", { duration: 0.45, ease: "power3.out" });
      const rotateYTo = gsap.quickTo(element, "--tilt-y", { duration: 0.45, ease: "power3.out" });
      const onMove = (event: MouseEvent) => {
        const rect = element.getBoundingClientRect();
        rotateXTo(((event.clientY - rect.top) / rect.height - 0.5) * -7);
        rotateYTo(((event.clientX - rect.left) / rect.width - 0.5) * 7);
      };
      const onLeave = () => { rotateXTo(0); rotateYTo(0); };
      element.addEventListener("mousemove", onMove);
      element.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        element.removeEventListener("mousemove", onMove);
        element.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, { scope: root });

  return (
    <div ref={root} className={styles.site}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <SiteHeader activeSection={activeSection} />

      <main id="main-content">
        <section id="top" ref={hero} className={styles.hero}>
          <div data-hero-copy-wrap className={styles.heroCopy}>
            <h1 aria-label="Websites that move at the speed of your idea">
              <span className={styles.lineClip}><span data-hero-line>Websites that move</span></span>
              <span className={styles.lineClip}><span data-hero-line>at the speed of</span></span>
              <span className={styles.lineClip}><span data-hero-line>your idea</span></span>
            </h1>
            <p data-hero-copy>Custom websites, built in days, directly with the people making them</p>
          </div>

          <div className={styles.heroMedia} aria-hidden="true">
            <video
              ref={introVideo}
              className={`${styles.heroVideo} ${videoReady ? styles.heroVideoReady : ""} ${videoSettled ? styles.heroVideoSettled : ""}`}
              autoPlay
              muted
              playsInline
              preload="auto"
              poster="/hero/keyboard-poster.jpg"
              onCanPlay={() => setVideoReady(true)}
              onTimeUpdate={(event) => {
                if (event.currentTarget.currentTime >= 4 && !videoSettled) setVideoSettled(true);
                if (event.currentTarget.currentTime >= 4.75) event.currentTarget.pause();
              }}
              onEnded={() => setVideoSettled(true)}
            >
              <source src="/hero/keyboard-pullback-real.mp4" type="video/mp4" />
            </video>
            <div data-keyboard-idle className={`${styles.keyboardIdle} ${videoSettled ? styles.keyboardIdleVisible : ""}`} />
            <div data-keyboard-pressed className={`${styles.keyboardPressed} ${isSpacePressed ? styles.keyboardPressedActive : ""}`} />
            <div className={styles.keyboardFragments}>
              {keyboardFragments.map(({ index, column, row, clipPath }) => (
                <i
                  data-keyboard-fragment
                  key={index}
                  style={{ clipPath, "--fragment-column": column, "--fragment-row": row } as CSSProperties}
                />
              ))}
            </div>
          </div>

          <button data-space-prompt className={`${styles.spacePrompt} ${isSpacePressed ? styles.spacePressed : ""}`} onClick={enterSite}>
            <span ref={spaceKey} className={styles.spaceKey}>PRESS SPACE TO ENTER</span>
            <span className={styles.scrollLabel}>or scroll to explore <ArrowDownRight size={14} /></span>
          </button>

          <div data-story-curtain className={styles.storyCurtain}>
            <div data-curtain-line className={styles.curtainLine} />
            <div data-curtain-copy>
              <span>Selected work / 2026</span>
              <strong>Built to be used<br /><em>Designed to be felt</em></strong>
              <p>Strategy, design, development and motion — without the agency drag</p>
            </div>
          </div>
        </section>

        <section id="work" data-cinematic-section className={styles.workSection}>
          <div data-reveal className={styles.workHeading}>
            <h2>Work that <span>earns</span> attention</h2>
            <div className={styles.workUtility}>
              <p>Three spaces One is live Two are ready for what comes next</p>
              <div className={styles.carouselControls} aria-label="Project carousel controls">
                <button onClick={() => moveProject(-1)} aria-label="Previous project"><ArrowLeft size={17} /></button>
                <span>0{activeProject + 1} / 03</span>
                <button onClick={() => moveProject(1)} aria-label="Next project"><ArrowRight size={17} /></button>
              </div>
            </div>
          </div>
          <div data-project-rail className={styles.projectRail}>
            {projects.map((project, index) => (
              <motion.article
                data-project-panel
                data-project-index={index}
                data-active={activeProject === index}
                tabIndex={0}
                role="button"
                aria-label={project.live ? "Preview PlannrAI" : `Preview future project slot ${project.number}`}
                aria-pressed={activeProject === index}
                onFocus={() => setActiveProject(index)}
                onClick={() => setActiveProject(index)}
                key={project.number}
                className={`${styles.projectPanel} ${project.live ? styles.liveProject : styles.futureProject}`}
                animate={deckPose(index, activeProject)}
                whileHover={activeProject === index ? { y: -12, rotateX: -2.5, rotateY: 2.5, scale: 1.018 } : { y: 12, opacity: .74 }}
                whileTap={{ scale: .985 }}
                transition={{ type: "spring", stiffness: 145, damping: 24, mass: 1.05 }}
              >
                {project.live ? (
                  <div data-zoom-media className={styles.liveMedia}>
                    <Image src={project.image} alt={`${project.title} website screenshot`} fill loading="eager" sizes="(max-width: 800px) 100vw, 55vw" />
                  </div>
                ) : (
                  <><div className={styles.redSeam} aria-hidden="true" /><div className={styles.futureGeometry} aria-hidden="true"><i /><i /><i /></div></>
                )}
                <div className={styles.projectMeta}><span>{project.number} · {project.live && project.title === "PlannrAI" ? "AI PRODUCT" : (project.live ? "CLIENT SITE" : "NEXT PROJECT")}</span>{project.live ? <strong>LIVE</strong> : null}</div>
                <div className={styles.projectCopy}>
                  <h3>{project.live ? project.title : <>Next<br />project</>}</h3>
                  <p>{project.copy}</p>
                </div>
                {project.live && activeProject === index && project.link !== "#" ? (
                  <a className={styles.projectVisit} href={project.link} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title}`}><ArrowUpRight /></a>
                ) : <ArrowDownRight className={styles.projectArrow} aria-hidden="true" />}
              </motion.article>
            ))}
          </div>
        </section>

        <section data-capabilities data-cinematic-section className={styles.capabilitiesSection}>
          <div className={styles.capabilitiesCopy} data-capability-copy>
            <p className={styles.mono}>ONE CONTINUOUS SYSTEM</p>
            <h2>From a spark to a<br />site people <em>remember</em></h2>
            <p>Strategy, design, development and motion—built as one continuous system</p>
          </div>
          <div className={styles.systemStage}>
            <div className={styles.systemRail} aria-hidden="true"><i /></div>
            <div className={styles.systemNodes}>
            {capabilities.map(([number, title, copy, Icon], index) => (
              <motion.button
                data-system-node
                data-active={activeCapability === index || hoveredCapability === index}
                aria-label={`${title}: ${copy}`}
                onClick={() => setActiveCapability(index)}
                onMouseEnter={() => setHoveredCapability(index)}
                onMouseLeave={() => setHoveredCapability(null)}
                onFocus={() => setHoveredCapability(index)}
                onBlur={() => setHoveredCapability(null)}
                key={number}
                className={styles.systemNode}
                animate={activeCapability === index || hoveredCapability === index ? { y: -12, scale: 1.07, rotateX: -6, rotateY: index % 2 ? 5 : -5, opacity: 1 } : { y: 5, scale: .91, rotateX: 0, rotateY: 0, opacity: .62 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 190, damping: 22 }}
              >
                <span className={styles.nodeIndex}>{number}</span>
                <span className={styles.optic}><Icon aria-hidden="true" /><i /><b /></span>
                <span className={styles.nodeTitle}>{title}</span>
              </motion.button>
            ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.aside key={activeCapability} className={styles.capabilityDisplay} initial={{ opacity: 0, y: 18, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -12, filter: "blur(6px)" }} transition={{ duration: 0.34 }}>
                <span>ACTIVE MODULE · {capabilities[activeCapability][0]}</span>
                <h3>{capabilities[activeCapability][1]}</h3>
                <p>{capabilities[activeCapability][2]}</p>
              </motion.aside>
            </AnimatePresence>
            <svg className={styles.energyLine} viewBox="0 0 1000 400" preserveAspectRatio="none" aria-hidden="true">
              <defs><filter id="redGlow"><feGaussianBlur stdDeviation="7" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs>
              <path data-energy-path pathLength="1" d="M-40 370 C90 340 120 288 230 300 S350 250 440 254 S540 195 625 208 S740 118 805 142 S920 60 1040 28" />
            </svg>
          </div>
          <p data-capability-note className={styles.capabilityNote}><em>Every interaction has a job</em><br />Every frame moves the story forward</p>
        </section>

        <section id="process" className={styles.howItWorksSection}>
          <ScrollScrubVideo />
        </section>

        <section id="founders" data-cinematic-section className={styles.foundersSection}>
          <div data-reveal className={styles.foundersIntro}>
            <p className={styles.mono}>FOUNDERS / STUDIO</p>
            <h2>Three paths<br /><span>One studio</span></h2>
            <p className={styles.founderLead}>Three friends from Mumbai, building with the tools agencies will be using five years from now</p>
            <p className={styles.founderSmall}>You speak directly to the people designing and building your site No account managers No hand-offs</p>
                <Link data-magnetic href="/studio" className={styles.founderButton}>Meet the studio <ArrowUpRight size={18} /></Link>
          </div>
          <div data-founder-grid className={styles.founderGrid}>
            <div className={styles.founderPanorama} aria-hidden="true">
              <Image src="/images/studio-founders-panorama.png" alt="" fill sizes="(max-width: 800px) 100vw, 68vw" />
            </div>
            {founders.map(([first, last, discipline], index) => (
              <article
                data-founder-panel
                data-tilt
                data-active={activeFounder === index}
                tabIndex={0}
                onMouseEnter={() => setActiveFounder(index)}
                onFocus={() => setActiveFounder(index)}
                onClick={() => setActiveFounder(index)}
                key={first}
                className={styles.founderPanel}
              >
                <ArrowUpRight className={styles.founderPanelArrow} aria-hidden="true" />
                <div><h3>{first} {last}</h3><p>{discipline}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section id="contact" data-cinematic-section className={styles.contactSection}>
          <div data-contact-arch className={styles.contactArch} aria-hidden="true" />
          <div data-reveal>
            <h2>Got an idea?<br />Let’s build <span>it</span></h2>
            <a href="mailto:aaravaher25@gmail.com" className={styles.email}>aaravaher25@gmail.com</a>
          </div>
          <Link data-reveal data-magnetic href="/book" className={styles.bookButton}>Book a free call <ArrowUpRight size={21} /></Link>
          <footer><span>Mumbai · India</span><span>WEBBYBUILDY © {new Date().getFullYear()}</span></footer>
        </section>
      </main>
    </div>
  );
}