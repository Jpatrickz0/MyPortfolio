import type Lenis from "lenis";

/**
 * Small singleton so any component can pause/resume the Lenis smooth-scroll
 * engine — e.g. to lock the page behind an open modal (Lenis intercepts wheel
 * events globally, so the browser's normal scroll lock isn't enough).
 */
let instance: Lenis | null = null;

export function registerLenis(l: Lenis | null) {
  instance = l;
}

export function stopLenis() {
  instance?.stop();
}

export function startLenis() {
  instance?.start();
}
