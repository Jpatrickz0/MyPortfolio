"use client";

import { useEffect } from "react";

/**
 * MAGNETIC BUTTONS (GSAP)
 * -----------------------
 * Any element tagged `data-magnetic` gently pulls toward the cursor while
 * hovered and springs back on leave. Optional strength: `data-magnetic="0.5"`.
 *
 * Mounted once (in the layout); wires every tagged element after mount.
 * Disabled on touch and for reduced-motion users.
 */
export function MagneticButtons() {
  useEffect(() => {
    if (
      window.matchMedia("(pointer: coarse)").matches ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let cancelled = false;
    const cleanups: Array<() => void> = [];

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
        const strength = Number(el.dataset.magnetic) || 0.4;
        const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
        const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

        const onMove = (e: PointerEvent) => {
          const r = el.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * strength);
          yTo((e.clientY - (r.top + r.height / 2)) * strength);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
        };

        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        cleanups.push(() => {
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerleave", onLeave);
          gsap.set(el, { x: 0, y: 0 });
        });
      });
    })();

    return () => {
      cancelled = true;
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return null;
}
