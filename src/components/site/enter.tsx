/**
 * Page-reveal wrapper. Pure CSS fade-in so content is NEVER trapped behind JS
 * state — it renders in the DOM immediately (good for SEO/crawlers and
 * fail-open if scripts are slow/disabled) and simply fades in when painted.
 * The intro loader sits on top of this as an opaque overlay.
 */
export function Enter({ children }: { children: React.ReactNode }) {
  return <div className="motion-safe:animate-page-in">{children}</div>;
}
