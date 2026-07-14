"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

/**
 * MEMORY INDEX RAIL
 * -----------------
 * A fixed vertical index (right side, desktop only) of the site's "memories".
 * The section crossing the viewport centre is highlighted with a longer amber
 * tick + label; the rest are short ticks that reveal their label on hover.
 * Each entry is an anchor, so the existing smooth-scroll handler moves to it.
 */

const ITEMS = [
  { id: "home", index: "00", label: "Present" },
  { id: "about", index: "01", label: "Origins" },
  { id: "experience", index: "02", label: "Timeline" },
  { id: "work", index: "03", label: "Vault" },
  { id: "skills", index: "04", label: "Tools" },
  { id: "contact", index: "05", label: "Contact" },
];

export function MemoryRail() {
  const [active, setActive] = useState("home");

  useEffect(() => {
    const els = ITEMS.map((it) => document.getElementById(it.id)).filter(
      (el): el is HTMLElement => !!el
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      // A 1px band at the viewport centre — whichever section crosses it wins.
      { rootMargin: "-50% 0px -50% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section index"
      className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 lg:flex"
    >
      {ITEMS.map((it) => {
        const on = active === it.id;
        return (
          <a
            key={it.id}
            href={`#${it.id}`}
            className="group flex items-center justify-end gap-3"
          >
            <span
              className={cn(
                "font-mono text-[0.6rem] uppercase tracking-[0.2em] transition-all duration-300",
                on
                  ? "translate-x-0 text-foreground opacity-100"
                  : "translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              )}
            >
              <span className="text-brand">MEM {it.index}</span> · {it.label}
            </span>
            <span
              className={cn(
                "h-px shrink-0 transition-all duration-300",
                on
                  ? "w-8 bg-brand"
                  : "w-4 bg-border group-hover:w-6 group-hover:bg-brand/60"
              )}
            />
          </a>
        );
      })}
    </nav>
  );
}
