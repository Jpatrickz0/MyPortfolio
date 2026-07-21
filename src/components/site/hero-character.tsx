"use client";

import { useEffect, useRef, useState } from "react";

import { profile } from "@/content";
import { HeroParticles } from "@/components/site/hero-particles";

/**
 * HERO CHARACTER — an animated 2D illustrated "you".
 *
 * Loads a transparent cartoon/illustration PNG (`profile.character`). When it
 * exists it becomes the hero figure: a gentle idle float/breathe (CSS) plus a
 * subtle lean toward the cursor, like it's looking at you. Until the art is
 * added, it falls back to the particle portrait — so the hero is never empty.
 *
 * A single flat PNG gives idle + cursor-lean. For a wave/blink, supply layered
 * art (head/arm as separate PNGs) or a Lottie and those can be rigged too.
 */
export function HeroCharacter() {
  const [ready, setReady] = useState(false);
  const leanRef = useRef<HTMLDivElement>(null);
  const src = profile.character;

  // Only use the character once the art actually loads.
  useEffect(() => {
    if (!src) return;
    const img = new Image();
    img.onload = () => setReady(img.naturalWidth > 0);
    img.onerror = () => setReady(false);
    img.src = src;
  }, [src]);

  // Lean toward the cursor (smoothed by a CSS transition on transform).
  useEffect(() => {
    if (!ready) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = leanRef.current;
    if (!el) return;
    const onMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1;
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      el.style.transform = `translate(${nx * 16}px, ${ny * 9}px) rotate(${nx * 3}deg)`;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [ready]);

  if (!ready) return <HeroParticles />;

  return (
    <div className="relative flex h-full items-end justify-center">
      {/* Amber ground glow behind the figure */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[10%] bottom-0 top-[12%] -z-0 rounded-[40%] blur-3xl"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 45%, hsl(38 92% 58% / 0.22), transparent 70%)",
        }}
      />
      <div
        ref={leanRef}
        className="relative z-10 h-full w-full transition-transform duration-500 ease-out"
        style={{ willChange: "transform" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={`${profile.name} — illustrated character`}
          className="h-full w-full animate-floaty object-contain object-bottom [filter:drop-shadow(0_25px_40px_rgba(0,0,0,0.45))]"
        />
      </div>
    </div>
  );
}
