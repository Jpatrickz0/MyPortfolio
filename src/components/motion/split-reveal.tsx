"use client";

import { Fragment, useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * SPLIT REVEAL (GSAP + ScrollTrigger)
 * -----------------------------------
 * Splits a heading into characters that rise + unblur in a stagger when the
 * heading scrolls into view — the "archive decoding" motion, tied to scroll.
 *
 * Accessible & robust: the container carries an aria-label with the full text
 * and the split characters are aria-hidden, so screen readers read the word,
 * not the fragments. The text renders visible by default (SSR / no-JS / reduced
 * motion), and GSAP only animates as an enhancement.
 */
export function SplitReveal({
  text,
  className,
  as: Tag = "h2",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let ctx: { revert: () => void } | null = null;
    let cancelled = false;

    (async () => {
      const [{ gsap }, stMod] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled || !ref.current) return;
      const ScrollTrigger = stMod.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      const chars = ref.current.querySelectorAll("[data-char]");
      ctx = gsap.context(() => {
        gsap.from(chars, {
          yPercent: 120,
          opacity: 0,
          filter: "blur(8px)",
          duration: 0.7,
          ease: "power3.out",
          stagger: 0.018,
          scrollTrigger: {
            trigger: ref.current!,
            start: "top 85%",
            once: true,
          },
        });
      }, ref.current!);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [text]);

  // Split into words (kept whole for wrapping) → characters.
  const words = text.split(" ");

  return (
    <Tag
      ref={ref as never}
      aria-label={text}
      className={cn("[text-wrap:balance]", className)}
    >
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span aria-hidden className="inline-block whitespace-nowrap">
            {word.split("").map((ch, ci) => (
              <span key={ci} data-char className="inline-block">
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </Tag>
  );
}
