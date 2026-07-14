"use client";

import { useEffect, useRef, useState } from "react";

import { profile } from "@/content";

/**
 * INTRO LOADER — "Archive plate, indexed"
 * ---------------------------------------
 * The name is ALWAYS solid, large, high-contrast real text — legibility first.
 * The character comes from the framing: an amber scan-line sweeps top→bottom to
 * "index" the plate (revealing the already-solid name), inside a reticle frame
 * with an indexing readout. The name then holds fully legible before a
 * curtain-split hands off to the hero.
 *
 * Accessible by construction: real DOM text (read by screen readers), high
 * contrast, and it fails open — skipped for reduced-motion and background tabs,
 * so the page underneath is never trapped behind it.
 */

const SESSION_KEY = "jpr_entered";
const REVEAL_MS = 1250; // scan-line sweep
const HOLD_MS = 1100; // name holds fully legible (generous, easy to read)
const EXIT_MS = 850; // curtain split → hero
// Play on EVERY page load / refresh. Flip to `true` to only show it once per
// browser session instead.
const SHOW_ONCE_PER_SESSION = false;

export function Loader() {
  const [show, setShow] = useState(true);
  const [closing, setClosing] = useState(false);

  const nameRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hardClose = () => {
      if (SHOW_ONCE_PER_SESSION) {
        try {
          sessionStorage.setItem(SESSION_KEY, "1");
        } catch {}
      }
      document.documentElement.style.overflow = "";
      setShow(false);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const visited =
      SHOW_ONCE_PER_SESSION && sessionStorage.getItem(SESSION_KEY) === "1";

    // Fail-open: reduced-motion / background tabs / revisits go straight to the
    // page (no blocking overlay).
    if (visited || reduce || document.hidden) {
      hardClose();
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / REVEAL_MS);
      // Reveal the solid name top→bottom as the scan-line descends.
      if (nameRef.current)
        nameRef.current.style.clipPath = `inset(0 0 ${(1 - p) * 100}% 0)`;
      if (barRef.current) {
        barRef.current.style.top = `${p * 100}%`;
        barRef.current.style.opacity = p < 1 ? "1" : "0";
      }
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${p})`;
      if (pctRef.current)
        pctRef.current.textContent = String(Math.round(p * 100)).padStart(3, "0");
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const t1 = setTimeout(() => setClosing(true), REVEAL_MS + HOLD_MS);
    const t2 = setTimeout(hardClose, REVEAL_MS + HOLD_MS + EXIT_MS);

    const onHide = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
        clearTimeout(t1);
        clearTimeout(t2);
        hardClose();
      }
    };
    document.addEventListener("visibilitychange", onHide);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      document.removeEventListener("visibilitychange", onHide);
      document.documentElement.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  // Two-line poster composition, matching the hero.
  const parts = profile.name.split(" ");
  const last = parts.pop() ?? "";
  const first = parts.join(" ");

  return (
    <div
      role="status"
      aria-label={`Loading — ${profile.name}`}
      className="fixed inset-0 z-[120] overflow-hidden"
    >
      {/* Curtain panels — split apart on exit to reveal the hero. */}
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-background transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ transform: closing ? "translateY(-101%)" : "translateY(0)" }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-background transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)]"
        style={{ transform: closing ? "translateY(101%)" : "translateY(0)" }}
      />

      {/* Content — fades up quickly as the curtains part. */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6 transition-all duration-500 ease-out"
        style={{
          opacity: closing ? 0 : 1,
          transform: closing ? "translateY(-14px)" : "translateY(0)",
        }}
      >
        {/* Eyebrow */}
        <div className="mb-8 flex items-center gap-2 font-mono text-[0.6rem] uppercase tracking-[0.4em] text-muted-foreground sm:text-xs">
          <span className="size-1.5 animate-pulse rounded-full bg-brand" />
          The Archive of {profile.shortName}
        </div>

        {/* Reticle-framed name plate */}
        <div className="reticle relative px-6 py-5 sm:px-10 sm:py-7">
          {/* The name — solid, high-contrast, revealed by the scan-line. */}
          <div
            ref={nameRef}
            className="text-center font-display font-semibold uppercase leading-[0.9] tracking-tightest text-foreground text-[clamp(2.4rem,11vw,7rem)]"
            style={{ clipPath: "inset(0 0 100% 0)" }}
          >
            <span className="block">{first}</span>
            <span className="block bg-gradient-to-b from-brand to-brand/50 bg-clip-text text-transparent">
              {last}
            </span>
          </div>

          {/* Sweeping amber scan-line. */}
          <div
            ref={barRef}
            aria-hidden
            className="pointer-events-none absolute inset-x-4 h-px bg-brand"
            style={{
              top: "0%",
              boxShadow:
                "0 0 12px 1px hsl(38 92% 58% / 0.9), 0 0 40px 6px hsl(38 92% 58% / 0.35)",
            }}
          />
        </div>

        {/* Indexing readout */}
        <div className="mt-10 w-[min(80vw,360px)]">
          <div className="mb-2 flex items-center justify-between font-mono text-[0.6rem] uppercase tracking-[0.3em] text-muted-foreground">
            <span>Indexing memory</span>
            <span className="text-brand">
              <span ref={pctRef}>000</span>%
            </span>
          </div>
          <div className="h-px w-full overflow-hidden bg-border">
            <div
              ref={fillRef}
              className="h-full w-full origin-left bg-brand"
              style={{ transform: "scaleX(0)" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
