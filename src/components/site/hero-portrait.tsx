"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { profile } from "@/content";

/**
 * Hero subject for a BACKGROUND-REMOVED (transparent) photo. The image is shown
 * with object-contain and anchored to the bottom, so a cutout reads as a clean
 * standing figure over the background — never stretched or cropped like a cover
 * photo. Until a photo exists, a tasteful silhouette placeholder is shown.
 */
export function HeroPortrait({
  src = profile.portrait,
  className,
}: {
  src?: string;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const reduce = useReducedMotion();

  // The image can 404 before React attaches onError (hydration race). Detect a
  // already-failed/loaded image on mount so the placeholder still shows.
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete) {
      if (el.naturalWidth === 0) setFailed(true);
      else setLoaded(true);
    }
  }, []);

  return (
    <div className={cn("relative flex h-full items-end justify-center", className)}>
      {/* Soft amber glow / ground behind the figure */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-[10%] bottom-0 top-[12%] -z-0 rounded-[40%] blur-3xl"
        style={{
          background:
            "radial-gradient(60% 70% at 50% 45%, hsl(38 92% 58% / 0.22), transparent 70%)",
        }}
      />

      {/* Entrance + gentle float */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="relative z-10 flex h-full w-full items-end justify-center"
      >
        <motion.div
          animate={reduce ? {} : { y: [0, -12, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="h-full w-full"
        >
          {!failed ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              ref={imgRef}
              src={src}
              alt={`${profile.name} — portrait`}
              onLoad={() => setLoaded(true)}
              onError={() => setFailed(true)}
              className={cn(
                "h-full w-full object-contain object-bottom transition-opacity duration-700 [filter:drop-shadow(0_25px_40px_rgba(0,0,0,0.45))]",
                loaded ? "opacity-100" : "opacity-0"
              )}
            />
          ) : (
            <Silhouette />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}

function Silhouette() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-end">
      <svg
        viewBox="0 0 200 240"
        className="h-[78%] w-auto text-muted-foreground"
        fill="none"
        aria-hidden
      >
        {/* Head */}
        <circle cx="100" cy="62" r="42" fill="currentColor" opacity="0.28" />
        {/* Shoulders / bust */}
        <path
          d="M28 240 C28 168 60 132 100 132 C140 132 172 168 172 240 Z"
          fill="currentColor"
          opacity="0.28"
        />
      </svg>
      <span className="mt-4 rounded-full border border-border bg-background/60 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground backdrop-blur">
        Add your cutout PNG
      </span>
    </div>
  );
}
