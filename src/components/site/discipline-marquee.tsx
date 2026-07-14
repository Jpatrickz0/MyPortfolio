"use client";

import { useEffect, useRef } from "react";

import { profile } from "@/content";

/**
 * KINETIC DISCIPLINE MARQUEE
 * --------------------------
 * An "archive ticker" of the disciplines that scrolls continuously and
 * speeds up + skews with scroll velocity. Decorative (aria-hidden) — the
 * disciplines are already listed accessibly in the About section.
 *
 * JS-driven transform (not a CSS animation) so scroll velocity can modulate it
 * without restarts. Static for reduced-motion users.
 */
export function DisciplineMarquee() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 0;
    let vel = 0;
    let last = window.scrollY;

    const loop = () => {
      const y = window.scrollY;
      vel += (y - last - vel) * 0.1;
      last = y;

      const boost = Math.min(Math.abs(vel) * 0.5, 14);
      x -= 0.5 + boost;
      const half = track.scrollWidth / 2;
      if (half > 0 && -x >= half) x += half;

      const skew = Math.max(-8, Math.min(8, vel * 0.15));
      track.style.transform = `translate3d(${x}px,0,0) skewX(${skew}deg)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const Row = () => (
    <div className="flex shrink-0 items-center">
      {profile.disciplines.map((d) => (
        <span key={d} className="flex items-center gap-8 pr-8">
          <span className="whitespace-nowrap font-display text-[clamp(1.6rem,4vw,3rem)] font-medium uppercase tracking-tightest text-foreground/90">
            {d}
          </span>
          <span aria-hidden className="size-2 shrink-0 rotate-45 bg-brand/80" />
        </span>
      ))}
    </div>
  );

  return (
    <section
      aria-hidden
      className="relative overflow-hidden border-y border-border/60 bg-card/20 py-6"
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <Row />
        <Row />
      </div>
    </section>
  );
}
