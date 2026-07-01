import React from "react";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ─── Reusable entrance animations ───────────────────────────────────────────

export function useFadeInUp(ref: React.RefObject<HTMLElement | null>, deps: any[] = []) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.fromTo(el, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
  }, deps);
}

export function useStaggerChildren(
  containerRef: React.RefObject<HTMLElement | null>,
  childSelector: string,
  options: { stagger?: number; fromVars?: gsap.TweenVars; toVars?: gsap.TweenVars } = {}
) {
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const children = el.querySelectorAll(childSelector);
    if (!children.length) return;
    gsap.fromTo(
      children,
      { opacity: 0, y: 30, ...options.fromVars },
      { opacity: 1, y: 0, duration: 0.6, stagger: options.stagger || 0.08, ease: "power2.out", ...options.toVars }
    );
  }, [containerRef, childSelector]);
}

export function useScrollReveal(
  ref: React.RefObject<HTMLElement | null>,
  options: { trigger?: string; start?: string; toggleActions?: string } = {}
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { opacity: 0, y: 60, scale: 0.97 }, {
        opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power3.out",
        scrollTrigger: {
          trigger: options.trigger || el,
          start: options.start || "top 85%",
          toggleActions: options.toggleActions || "play none none reset",
        },
      });
    });
    return () => ctx.revert();
  }, [ref]);
}

export function useParallax(
  ref: React.RefObject<HTMLElement | null>,
  speed: number = 0.3
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: () => window.innerHeight * speed * -1,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
    return () => ctx.revert();
  }, [ref, speed]);
}

export function useCounter(
  ref: React.RefObject<HTMLElement | null>,
  end: number,
  duration: number = 2
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(el, { textContent: 0 }, {
        textContent: end, duration, ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none reset" },
      });
    });
    return () => ctx.revert();
  }, [ref, end, duration]);
}

// ─── Page-level master entrance timeline ────────────────────────────────────

export function usePageEntrance() {
  const tl = useRef<gsap.core.Timeline | null>(null);

  const createEntrance = useCallback((elements: (HTMLElement | null)[], onComplete?: () => void) => {
    const valid = elements.filter(Boolean) as HTMLElement[];
    if (!valid.length) return;
    tl.current = gsap.timeline({ onComplete });
    tl.current
      .set(valid, { opacity: 0, y: 30 })
      .to(valid, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out" });
  }, []);

  const play = useCallback(() => tl.current?.play(), []);
  const reverse = useCallback(() => tl.current?.reverse(), []);

  return { createEntrance, play, reverse };
}

// ─── Cleanup hook ───────────────────────────────────────────────────────────

export function useGsapCleanup() {
  useEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.killTweensOf("*");
    };
  }, []);
}
