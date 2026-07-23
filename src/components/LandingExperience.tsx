"use client";

import { useGSAP } from "@gsap/react";
import { animate } from "animejs";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownRight, ArrowLeft, ArrowRight, ArrowUpRight, Compass } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import Image from "next/image";
import Link from "next/link";
import { CSSProperties, useCallback, useEffect, useRef, useState, SVGProps } from "react";
import styles from "@/app/page.module.css";
import { SiteHeader } from "@/components/SiteHeader";
import ScrollScrubVideo from "@/components/ScrollScrubVideo";
import { CinematicMotionField } from "@/components/CinematicMotionField";

gsap.registerPlugin(ScrollTrigger);

const founders = [
  ["Aarav", "Aher", "International Business at Northeastern"],
  ["Abhimanyu", "Gupta", "Cadet with IndiGo"],
  ["Advay", "Vaidya", "CFA aspirant"],
] as const;

const DesigningIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <g transform="scale(0.7) translate(2, 2)">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>
    </g>
    <g transform="scale(0.6) translate(16, 16)">
      <path d="M15 12l-8.5 8.5c-.83.83-2.17.83-3 0 0 0 0 0 0 0a2.12 2.12 0 0 1 0-3L12 9"></path>
      <path d="M17.64 15L22 10.64"></path>
      <path d="m20.91 11.7-1.25-1.25c-.6-.6-.93-1.4-.93-2.25v-.86L16.01 4.6a5.56 5.56 0 0 0-3.94-1.64H9l.92.82A6.18 6.18 0 0 1 12 8.4v1.56l2 2h2.47l2.26 1.91"></path>
    </g>
  </svg>
);

const RefiningIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <g transform="scale(0.65) translate(1, 9)">
      <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
      <rect x="9" y="9" width="6" height="6"></rect>
      <line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>
    </g>
    <g transform="scale(0.9) translate(9, -2)">
      <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"></path>
      <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" fill="white"></path>
      <path d="M4 2v4m-2-2h4" strokeWidth="1.5" />
    </g>
  </svg>
);

const DeliveryIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <g transform="scale(0.8) translate(3, 4)">
      <polyline points="20 12 20 22 4 22 4 12"></polyline>
      <rect x="2" y="7" width="20" height="5"></rect>
      <line x1="12" y1="22" x2="12" y2="7"></line>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
    </g>
    <path d="M4 2v4m-2-2h4" strokeWidth="1.5" />
    <path d="M20 5v4m-2-2h4" strokeWidth="1.5" />
    <path d="M19 16v4m-2-2h4" strokeWidth="1.5" />
  </svg>
);

const capabilities = [
  ["01", "Direction", "Grasping what to make before starting - your requirements, specifics, even just the feel you want to bring to your website", Compass],
  ["02", "Designing", "Turning your demands into tangible realities as we build your perfect website", DesigningIcon],
  ["03", "Refining", "Any changes or improvements you may want, all the way down to the smallest intricacies, made without any hassle", RefiningIcon],
  ["04", "Delivery", "Delivering your ideal website to you, ready for use by your own clients", DeliveryIcon],
] as const;

const projects = [
  { number: "01", title: "PlannrAI", copy: "A complete AI-powered product, designed, built and launched by the three of us", live: true, image: "/images/plannrai-hero.png", link: "https://plannrai.in" },
  { number: "02", title: "Be3", copy: "A human resources platform shaped around clearer services, stronger trust and a more confident digital presence", live: true, image: "/images/be3-hero.png", link: "https://be3.co.in" },
  { number: "03", title: "Private Consulting Website", copy: "A private consulting site that positions an individual brand", live: true, image: "/images/client3-consulting.png", link: "#" },
] as const;

const deckPose = (index: number, active: number) => {
  const position = (index - active + projects.length) % projects.length;
  if (position === 0) return { x: "0%", y: 0, scale: 1, rotateY: 0, opacity: 1, zIndex: 6 };
  if (position === 1) return { x: "58%", y: 24, scale: 0.76, rotateY: -13, opacity: 0.56, zIndex: 3 };
  return { x: "-38%", y: 30, scale: 0.68, rotateY: 14, opacity: 0.38, zIndex: 2 };
};

const fragmentRows = [
  { top: 33.2, left: 9.4, count: 18, gap: 4.55, width: 3.55, height: 6.6 },
  { top: 42.1, left: 8.8, count: 20, gap: 4.22, width: 3.5, height: 6.7 },
  { top: 50.1, left: 10.1, count: 19, gap: 4.3, width: 3.55, height: 6.8 },
  { top: 58.1, left: 10.8, count: 18, gap: 4.42, width: 3.7, height: 6.9 },
  { top: 65.9, left: 12.2, count: 17, gap: 4.48, width: 3.78, height: 7 },
] as const;

const keyboardFragments = fragmentRows.flatMap((row, rowIndex) =>
  Array.from({ length: row.count }, (_, column) => {
    const index = fragmentRows.slice(0, rowIndex).reduce((sum, item) => sum + item.count, 0) + column;
    const left = row.left + column * row.gap;
    const seed = ((index * 47 + 19) % 101) / 101;
    return {
      index,
      column,
      row: rowIndex,
      left,
      top: row.top,
      width: row.width,
      height: row.height,
      release: seed * .22 + rowIndex * .025,
      drift: (seed - .5) * 90,
      backgroundSize: `${10000 / row.width}% ${10000 / row.height}%`,
      backgroundPosition: `${(left / (100 - row.width)) * 100}% ${(row.top / (100 - row.height)) * 100}%`,
    };
  }),
);

export default function LandingExperience() {
  const root = useRef<HTMLDivElement>(null);
  const hero = useRef<HTMLElement>(null);
  const introVideo = useRef<HTMLVideoElement>(null);
  const idleVideo = useRef<HTMLVideoElement>(null);
  const pressVideo = useRef<HTMLVideoElement>(null);
  const spaceKey = useRef<HTMLSpanElement>(null);
  const openingTimeline = useRef<gsap.core.Timeline | null>(null);
  const entranceTimeline = useRef<gsap.core.Timeline | null>(null);
  const entranceComplete = useRef(false);
  const introSettled = useRef(false);
  const videoDecoded = useRef(false);
  const lenis = useLenis(() => ScrollTrigger.update());
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [activeCapability, setActiveCapability] = useState(0);
  const [hoveredCapability, setHoveredCapability] = useState<number | null>(null);
  const [activeFounder, setActiveFounder] = useState(0);
  const [activeSection, setActiveSection] = useState<"top" | "work" | "process" | "founders" | "contact">("top");

  const enterSite = useCallback(() => {
    if (entranceComplete.current || entranceTimeline.current?.isActive()) return;
    // Once entry begins, the intro-to-idle handoff must never run again over
    // the exit timeline, even if a delayed media event arrives.
    introSettled.current = true;
    // A fast user can enter before the opening copy reveal finishes. Resolve
    // that opening timeline first so it cannot fade the prompt back in over
    // the keyboard disassembly sequence.
    openingTimeline.current?.progress(1).pause();
    setIsSpacePressed(true);
    if (spaceKey.current) {
      animate(spaceKey.current, {
        translateY: [0, 7, 0],
        scale: [1, 0.975, 1],
        duration: 720,
        ease: "inOutQuint",
      });
    }
    introVideo.current?.pause();
    if (pressVideo.current) {
      pressVideo.current.currentTime = 0;
      void pressVideo.current.play().catch(() => undefined);
    }
    entranceTimeline.current?.restart();
  }, []);

  const settleIntro = useCallback(() => {
    if (introSettled.current) return;
    introSettled.current = true;
    // The restored loop's closest visual match to the intro's final frame is
    // near its end. Start there and crossfade so the camera never jumps back
    // to the loop's opening angle during the handoff.
    if (idleVideo.current) {
      idleVideo.current.currentTime = 7.2;
      void idleVideo.current.play().catch(() => undefined);
    }
    gsap.set(idleVideo.current, { opacity: 1, scale: 1.012, transformOrigin: "50% 58%" });
    gsap.to(introVideo.current, { opacity: 0, duration: .68, ease: "power2.inOut" });
  }, []);

  const moveProject = useCallback((direction: -1 | 1) => {
    setActiveProject((current) => (current + direction + projects.length) % projects.length);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.repeat || event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.code === "Space") {
        event.preventDefault();
        enterSite();
      } else if (event.code === "ArrowLeft") {
        event.preventDefault();
        moveProject(-1);
      } else if (event.code === "ArrowRight") {
        event.preventDefault();
        moveProject(1);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [enterSite, moveProject]);

  useEffect(() => {
    const onWheel = (event: WheelEvent) => {
      if (window.scrollY < 12 && event.deltaY > 12 && !entranceComplete.current) {
        event.preventDefault();
        enterSite();
      }
    };
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
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
      if (!videoDecoded.current) settleIntro();
    }, 4200);
    document.fonts.ready.then(() => ScrollTrigger.refresh()).catch(() => undefined);

    return () => {
      window.clearTimeout(fallback);
    };
  }, [settleIntro]);

  // Honor a hash target on load (e.g. arriving at /#work from the book page).
  // ScrollTrigger's pinned hero shifts section offsets, so wait for layout to
  // settle, refresh, then jump straight to the target section.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash || hash === "#top") return;
    let done = false;

    const goToHash = () => {
      if (done) return;
      const target = document.querySelector(hash);
      if (!target) return;
      done = true;
      ScrollTrigger.refresh();
      requestAnimationFrame(() => {
        if (lenis) lenis.scrollTo(target as HTMLElement, { immediate: true, force: true });
        else (target as HTMLElement).scrollIntoView();
      });
    };

    const timer = window.setTimeout(goToHash, 400);
    document.fonts.ready.then(goToHash).catch(() => undefined);
    return () => window.clearTimeout(timer);
  }, [lenis]);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      entranceTimeline.current = gsap.timeline({ paused: true, onComplete: () => { entranceComplete.current = true; } })
        .set("[data-hero-copy-wrap],[data-space-prompt]", { opacity: 0 })
        .set("[data-keyboard-fallback]", { opacity: 0 })
        .set("[data-story-curtain]", { yPercent: 0, opacity: 1 })
        .set("[data-curtain-copy]", { opacity: 1, y: 0 });
      return;
    }

    const intro = gsap.timeline({ defaults: { ease: "expo.out" } });
    openingTimeline.current = intro;
    intro
      .fromTo("[data-hero-line]", { yPercent: 110 }, { yPercent: 0, duration: 1.15, stagger: 0.08 })
      .fromTo("[data-hero-copy]", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7 }, "-=0.55")
      .fromTo("[data-space-prompt]", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.65 }, "-=0.4");

    gsap.set(idleVideo.current, { opacity: 0, y: 0, scale: 1.012 });
    gsap.set(pressVideo.current, { opacity: 0, y: 0, scale: 1.012 });
    gsap.set("[data-keyboard-fallback]", { opacity: 1 });
    gsap.set("[data-keyboard-fragment]", { opacity: 0 });
    gsap.set("[data-story-curtain]", { yPercent: 100, opacity: 0 });

    const resetEntrance = () => {
      entranceTimeline.current?.pause(0);
      entranceComplete.current = false;
      introSettled.current = true;
      setIsSpacePressed(false);
      introVideo.current?.pause();
      if (pressVideo.current) {
        pressVideo.current.pause();
        pressVideo.current.currentTime = 0;
      }
      if (idleVideo.current) void idleVideo.current.play().catch(() => undefined);
      gsap.set("[data-story-curtain]", { yPercent: 100, opacity: 0 });
      gsap.set("[data-curtain-copy]", { opacity: 0, y: 36 });
      gsap.set("[data-keyboard-fragment]", { opacity: 0, x: 0, y: 0, z: 0, rotateX: 0, rotateY: 0, rotateZ: 0, scale: 1, filter: "none" });
      gsap.set(introVideo.current, { opacity: 0, y: 0, scale: 1.012 });
      gsap.set(pressVideo.current, { opacity: 0, y: 0, scale: 1.012 });
      gsap.set(idleVideo.current, { opacity: 1, y: 0, scale: 1.012 });
      gsap.set("[data-keyboard-fallback]", { opacity: 1 });
      gsap.set("[data-hero-copy-wrap],[data-space-prompt]", { opacity: 1, clearProps: "transform" });
      gsap.set("[data-hero-flash]", { opacity: 0 });
      gsap.set(hero.current, { "--hero-shade-opacity": 1 });
    };

    ScrollTrigger.create({
      id: "hero-cinematic",
      trigger: hero.current,
      start: "top top",
      // One normal wheel gesture should clear the completed story frame.
      // Keep a short pinned runway so the handoff remains cinematic without
      // forcing users to repeat the same scroll several times.
      end: () => `+=${Math.max(150, Math.round(window.innerHeight * .18))}`,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if (self.progress > 0.008 && !entranceComplete.current && !entranceTimeline.current?.isActive()) enterSite();
        if (self.progress <= 0.001 && self.direction < 0 && entranceComplete.current) resetEntrance();
      },
      onLeaveBack: resetEntrance,
    });

    entranceTimeline.current = gsap.timeline({
      paused: true,
      defaults: { ease: "power3.inOut" },
      onComplete: () => {
        entranceComplete.current = true;
        idleVideo.current?.pause();
        pressVideo.current?.pause();
        gsap.set([idleVideo.current, pressVideo.current, "[data-keyboard-fallback]"], { opacity: 0 });
        setIsSpacePressed(false);
      },
    });

    entranceTimeline.current
      // Beat one — the interface quiets before the physical press
      .to("[data-space-prompt]", { opacity: 0, y: 14, duration: 0.55, ease: "power2.in" }, 0)
      .to("[data-hero-copy-wrap]", { opacity: 0, y: -28, duration: 0.9, ease: "power2.inOut" }, 0.08)
      .to(introVideo.current, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 0)
      // Beat two — compression, light response, then a deliberate hold
      .to("[data-keyboard-fallback]", { opacity: 0, duration: 0.28, ease: "power2.inOut" }, 0.12)
      .to(idleVideo.current, { y: 8, scale: 1.009, opacity: 0, duration: 0.34, ease: "power2.inOut" }, 0.12)
      .fromTo(pressVideo.current, { opacity: 0, y: 4, scale: 1.01 }, { opacity: 1, y: 8, scale: 1.009, duration: 0.34, ease: "power2.inOut" }, 0.14)
      .call(() => idleVideo.current?.pause(), [], 0.5)
      .fromTo("[data-hero-flash]", { opacity: 0 }, { opacity: 0.22, duration: 0.24, ease: "sine.out" }, 0.14)
      .to("[data-hero-flash]", { opacity: 0, duration: 0.72, ease: "sine.out" }, 0.38)
      // Beat three — keycaps lift from their switches, then fall with individual mass and inertia
      .to("[data-keyboard-fragment]", {
        opacity: 1,
        duration: .16,
        stagger: { each: .0015, from: "center" },
        ease: "power1.out",
      }, 1.5)
      .fromTo("[data-hero-flash]", { opacity: 0 }, { opacity: .16, duration: .16, ease: "sine.out" }, 1.48)
      .to("[data-hero-flash]", { opacity: 0, duration: .42, ease: "sine.out" }, 1.64)
      .to("[data-keyboard-fragment]", {
        y: (index) => -5 - (index % 4) * 1.5,
        z: (index) => 22 + (index % 7) * 5,
        rotateX: (index) => -3 - (index % 3) * 1.5,
        rotateY: (index) => ((index % 5) - 2) * 1.4,
        duration: .26,
        stagger: { each: .006, from: "random" },
        ease: "power2.out",
      }, 1.78)
      .to("[data-keyboard-fragment]", {
        x: (index) => keyboardFragments[index]?.drift ?? 0,
        y: (index) => window.innerHeight * (1.08 + (keyboardFragments[index]?.release ?? 0) * .34),
        z: (index) => 70 + (index % 9) * 18,
        rotateX: (index) => 38 + (index % 7) * 19,
        rotateY: (index) => ((index % 5) - 2) * 22,
        rotateZ: (index) => (index % 2 ? 1 : -1) * (7 + (index % 11) * 2.2),
        scale: (index) => .84 + (index % 5) * .025,
        filter: "brightness(.82) blur(.35px)",
        stagger: { each: .006, from: "random" },
        duration: 2.45,
        ease: "power2.in",
      }, 2.04)
      .to("[data-keyboard-fragment]", { opacity: 0, duration: .62, stagger: { each: .008, from: "random" }, ease: "power1.in" }, 3.54)
      // Transfer the solid keyboard into the individual keycaps before gravity
      // takes over, so a second board never remains behind the falling pieces.
      .to(pressVideo.current, { opacity: 0, y: 20, scale: 1.003, duration: .3, ease: "power2.in" }, 1.58)
      // Beat four — the next chapter arrives only after the physical action reads
      .fromTo("[data-story-curtain]", { yPercent: 100, opacity: 1, rotateX: -7, scale: 1.035, transformOrigin: "50% 100%" }, { yPercent: 0, opacity: 1, rotateX: 0, scale: 1, duration: 1.52, ease: "expo.inOut" }, 2.48)
      .fromTo("[data-curtain-line]", { scaleX: 0 }, { scaleX: 1, duration: .88, ease: "power3.out" }, 3.52)
      .fromTo("[data-curtain-copy]", { opacity: 0, y: 30, z: -90, rotateX: 5 }, { opacity: 1, y: 0, z: 0, rotateX: 0, duration: .92, ease: "power3.out" }, 3.66)
      .to(hero.current, { "--hero-shade-opacity": 0, duration: .82, ease: "power1.out" }, 3.18);

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

    const desktopMotion = gsap.matchMedia();
    desktopMotion.add("(min-width: 801px)", () => {
      const capabilityLock = ScrollTrigger.create({
        id: "capability-cinematic-lock",
        trigger: "[data-capabilities]",
        start: "top top",
        end: "+=170%",
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          setActiveCapability(Math.min(capabilities.length - 1, Math.floor(progress * capabilities.length)));
        },
      });
      return () => capabilityLock.kill();
    });

    gsap.timeline({
      scrollTrigger: {
        trigger: "#work",
        start: "top 98%",
        end: "top 62%",
        scrub: .55,
      },
    })
      .fromTo("[data-work-wipe]", { yPercent: 0, rotateX: 0, scale: 1, transformOrigin: "50% 0%" }, { yPercent: -108, rotateX: 13, scale: .965, ease: "power3.inOut" }, 0)
      .fromTo("[data-work-heading]", { opacity: 0, y: 64, z: -180, rotateX: 9, scale: .96 }, { opacity: 1, y: 0, z: 0, rotateX: 0, scale: 1, ease: "power3.out" }, .12)
      .fromTo("[data-project-rail]", { opacity: .04, y: 76, z: -260, rotateX: 12, scale: .94 }, { opacity: 1, y: 0, z: 0, rotateX: 0, scale: 1, ease: "power3.out" }, .2);

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

    gsap.utils.toArray<HTMLElement>("[data-section-stage]").forEach((stage) => {
      gsap.fromTo(stage, { y: 88, scale: .955, rotateX: 7, transformOrigin: "50% 100%" }, {
        y: 0,
        scale: 1,
        rotateX: 0,
        ease: "none",
        scrollTrigger: { trigger: stage, start: "top 94%", end: "top 55%", scrub: 1 },
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
    let chapterExitInFlight = false;
    const handleChapterExit = (event: WheelEvent) => {
      if (event.deltaY <= 0 || chapterExitInFlight || !entranceComplete.current) return;

      const heroBounds = hero.current?.getBoundingClientRect();
      const workSection = document.querySelector<HTMLElement>("#work");
      if (!heroBounds || !workSection || heroBounds.bottom <= 0 || heroBounds.top > 1) return;

      event.preventDefault();
      event.stopPropagation();
      chapterExitInFlight = true;
      lenis?.scrollTo(workSection, {
        duration: .68,
        lock: true,
        force: true,
        onComplete: () => { chapterExitInFlight = false; },
      });
    };
    window.addEventListener("wheel", handleChapterExit, { passive: false, capture: true });
    cleanups.push(() => window.removeEventListener("wheel", handleChapterExit, { capture: true }));

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

    return () => {
      desktopMotion.revert();
      cleanups.forEach((cleanup) => cleanup());
    };
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

          <div data-hero-media className={styles.heroMedia} aria-hidden="true">
            <video
              ref={introVideo}
              className={`${styles.heroVideo} ${videoReady ? styles.heroVideoReady : ""}`}
              autoPlay
              muted
              playsInline
              preload="auto"
              poster="/hero/keyboard-intro-clean-poster.jpg"
              onCanPlay={() => {
                videoDecoded.current = true;
                setVideoReady(true);
              }}
              onEnded={settleIntro}
              onError={() => {
                setVideoReady(false);
                settleIntro();
              }}
            >
              <source src="/hero/keyboard-intro-clean.mp4" type="video/mp4" />
            </video>
            <div data-keyboard-fallback className={styles.keyboardFallback} />
            <video
              ref={idleVideo}
              data-keyboard-loop
              className={styles.heroVideoLoop}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              poster="/hero/keyboard-loop-poster.jpg"
            >
              <source src="/hero/keyboard-loop.mp4" type="video/mp4" />
            </video>
            <video
              ref={pressVideo}
              data-keyboard-press
              className={styles.heroVideoPress}
              muted
              playsInline
              preload="auto"
              poster="/hero/keyboard-press-glow-still.jpg"
            >
              <source src="/hero/keyboard-press-glow.mp4" type="video/mp4" />
            </video>
            <div className={styles.keyboardFragments}>
              {keyboardFragments.map(({ index, column, row, left, top, width, height, backgroundSize, backgroundPosition }) => (
                <i
                  data-keyboard-fragment
                  key={index}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: `${width}%`,
                    height: `${height}%`,
                    backgroundSize,
                    backgroundPosition,
                    "--fragment-column": column,
                    "--fragment-row": row,
                  } as CSSProperties}
                />
              ))}
            </div>
            <div data-hero-flash className={styles.heroFlash} />
          </div>

          <button data-space-prompt className={`${styles.spacePrompt} ${isSpacePressed ? styles.spacePressed : ""}`} onClick={enterSite}>
            <span ref={spaceKey} className={styles.spaceKey}>PRESS SPACE TO ENTER</span>
            <span className={styles.scrollLabel}>or scroll to explore <ArrowDownRight size={14} /></span>
          </button>

          <div data-story-curtain className={styles.storyCurtain}>
            <div data-curtain-line className={styles.curtainLine} />
            <div data-curtain-copy>
              <strong>Built to be used<br /><em>Designed to be felt</em></strong>
              <p>Strategy, design, development and motion — without the agency drag</p>
            </div>
          </div>
        </section>

        <section id="work" data-cinematic-section className={styles.workSection}>
          <div data-work-wipe className={styles.workTransitionWipe} aria-hidden="true"><i /></div>
          <CinematicMotionField variant="work" />
          <div data-work-heading className={styles.workHeading}>
            <h2>Work that <span>earns</span> attention</h2>
            <div className={styles.workUtility}>
              <p>Every project is built with close attention, personal collaboration and a design approach shaped around the people it needs to serve</p>
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
                aria-label={project.live ? `Preview ${project.title}` : `Preview future project slot ${project.number}`}
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
                {project.live && activeProject === index ? (
                  <a className={styles.projectVisit} href={project.link} target="_blank" rel="noreferrer" aria-label={`Visit ${project.title}`}><ArrowUpRight /></a>
                ) : <ArrowDownRight className={styles.projectArrow} aria-hidden="true" />}
              </motion.article>
            ))}
          </div>
        </section>

        <section id="process" data-capabilities data-cinematic-section className={styles.capabilitiesSection}>
          <div className={styles.capabilitiesLeft}>
            <div className={styles.capabilitiesCopy} data-capability-copy>
              <p className={styles.mono}>ONE CONTINUOUS SYSTEM</p>
              <h2>From a spark to a<br />site people <em>remember</em></h2>
            </div>
            <p data-capability-note className={styles.capabilityNote}><em>Every interaction has a job</em><br />Every frame moves the story forward</p>
          </div>
          <div data-section-stage className={styles.systemStage}>
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
        </section>

        <section id="how-it-works" className={styles.howItWorksSection}>
          <ScrollScrubVideo />
        </section>

        <section id="founders" data-cinematic-section className={styles.foundersSection}>
          <CinematicMotionField variant="studio" />
          <div data-reveal className={styles.foundersIntro}>
            <p className={styles.mono}>FOUNDERS / STUDIO</p>
            <h2>Three paths<br /><span>One studio</span></h2>
            <p className={styles.founderLead}>Three friends from Mumbai, building with the tools agencies will be using five years from now</p>
            <p className={styles.founderSmall}>You speak directly to the people designing and building your site No account managers No hand-offs</p>
                <Link data-magnetic href="/studio/team" className={styles.founderButton}>Meet the studio <ArrowUpRight size={18} /></Link>
          </div>
          <div data-founder-grid data-section-stage className={styles.founderGrid}>
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
          <CinematicMotionField variant="finale" />
          <div data-contact-arch className={styles.contactArch} aria-hidden="true" />
          <div data-reveal>
            <h2>Have something<br /><span>worth building</span></h2>
            <a href="mailto:studio@sitesmith.co.in" className={styles.email}>studio@sitesmith.co.in</a>
          </div>
          <Link data-reveal data-magnetic href="/book" className={styles.bookButton}>Book a free call <ArrowUpRight size={21} /></Link>
          <footer><span>Mumbai · India</span><span>SITESMITH © {new Date().getFullYear()}</span></footer>
        </section>
      </main>
    </div>
  );
}
