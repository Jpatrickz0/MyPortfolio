"use client";

import { useEffect } from "react";
import Lenis from "lenis";

import { registerLenis } from "@/lib/lenis";

/**
 * Lenis smooth scrolling. Disabled automatically when the user prefers
 * reduced motion. Intercepts in-page anchor links for buttery scrolling.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    registerLenis(lenis);

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Keep GSAP ScrollTrigger in sync with Lenis so scroll-driven reveals fire
    // at the right positions under smooth scrolling.
    let stCleanup = () => {};
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        const update = () => ScrollTrigger.update();
        lenis.on("scroll", update);
        ScrollTrigger.refresh();
        stCleanup = () => lenis.off("scroll", update);
      }
    );

    // Smooth-scroll same-page anchor links.
    function onClick(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest(
        'a[href^="#"], a[href^="/#"]'
      ) as HTMLAnchorElement | null;
      if (!target) return;
      const hash = target.getAttribute("href")!.split("#")[1];
      if (!hash) return;
      const el = document.getElementById(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, { offset: -88 });
      history.pushState(null, "", `#${hash}`);
    }
    document.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(rafId);
      stCleanup();
      document.removeEventListener("click", onClick);
      registerLenis(null);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
