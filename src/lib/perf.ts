/**
 * Device performance tiering — one place to decide how heavy the WebGL/animation
 * work should be, so weaker devices (phones, low-core laptops) stay smooth.
 *
 * Client-only: call inside effects/handlers, never during SSR.
 */
export type Quality = {
  /** "low" → cut particle counts, drop decorative layers, lower DPR. */
  tier: "high" | "low";
  /** Coarse pointer or narrow viewport → treat as mobile. */
  mobile: boolean;
  /** Capped device pixel ratio to render at. */
  dpr: number;
  /** User asked for reduced motion. */
  reduce: boolean;
};

export function getQuality(): Quality {
  if (typeof window === "undefined") {
    return { tier: "high", mobile: false, dpr: 1, reduce: false };
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const mobile = coarse || window.innerWidth < 768;

  const cores = navigator.hardwareConcurrency || 8;
  // deviceMemory is Chromium-only (and capped at 8); default optimistic.
  const mem =
    (navigator as Navigator & { deviceMemory?: number }).deviceMemory || 8;

  const low = reduce || mobile || cores <= 4 || mem <= 4;
  const dpr = Math.min(window.devicePixelRatio || 1, low ? 1.5 : 2);

  return { tier: low ? "low" : "high", mobile, dpr, reduce };
}
