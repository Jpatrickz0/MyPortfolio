"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";
import { profile } from "@/content";

const SESSION_KEY = "jpr_entered";
const DURATION = 1900; // ms of "indexing" before the archive opens
const CELLS = 16; // 4×4 grid of memory cells

// Best practice: show the intro once per browser session — first impression
// gets the full animation; refreshes and in-page navigation during that visit
// don't replay it (returning in a new session shows it again). Set to `false`
// to instead play on every page load.
const SHOW_ONCE_PER_SESSION = true;

export function Loader() {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [closing, setClosing] = useState(false);
  const [opening, setOpening] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const hardClose = () => {
      if (SHOW_ONCE_PER_SESSION) {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
      }
      document.documentElement.style.overflow = "";
      setShow(false); // unmount via React — never depends on animation finishing
    };

    const visited =
      SHOW_ONCE_PER_SESSION &&
      typeof window !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY) === "1";

    // Fail-open: skip for revisits (when enabled), reduced-motion, or
    // background tabs (which freeze the timers the loader relies on).
    if (visited || reduce || document.hidden) {
      hardClose();
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / DURATION);
      setCount(Math.round(p * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t1 = setTimeout(() => setOpening(true), DURATION);
    const t2 = setTimeout(() => setClosing(true), DURATION + 600);
    const t3 = setTimeout(hardClose, DURATION + 1200);

    const onHide = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        [t1, t2, t3].forEach(clearTimeout);
        hardClose();
      }
    };
    document.addEventListener("visibilitychange", onHide);

    return () => {
      cancelAnimationFrame(raf);
      [t1, t2, t3].forEach(clearTimeout);
      document.removeEventListener("visibilitychange", onHide);
      document.documentElement.style.overflow = "";
    };
  }, [reduce]);

  if (!show) return null;

  const lit = Math.ceil((count / 100) * CELLS);

  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "fixed inset-0 z-[120] flex flex-col items-center justify-center bg-background transition-opacity duration-500",
        closing ? "opacity-0" : "opacity-100"
      )}
    >
      {/* Archive grid being indexed */}
      <motion.div
        className="grid grid-cols-4 gap-2"
        animate={opening ? { scale: 1.35, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
      >
        {Array.from({ length: CELLS }).map((_, i) => {
          const isLit = i < lit;
          return (
            <div
              key={i}
              className={cn(
                "size-7 rounded-[4px] border transition-colors duration-300 sm:size-9",
                isLit
                  ? "border-brand/60 bg-brand/80"
                  : "border-border bg-card"
              )}
            />
          );
        })}
      </motion.div>

      <div
        className={cn(
          "mt-10 flex flex-col items-center gap-3 transition-opacity duration-300",
          opening && "opacity-0"
        )}
      >
        <div className="font-mono text-xs uppercase tracking-[0.4em] text-muted-foreground">
          Indexing memories
        </div>
        <div className="font-display text-4xl tabular-nums tracking-tightest text-foreground">
          {String(count).padStart(3, "0")}
          <span className="text-brand">%</span>
        </div>
        <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground/70">
          {profile.name} — The Archive
        </div>
      </div>
    </div>
  );
}
