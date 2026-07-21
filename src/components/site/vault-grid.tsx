"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import type { Project } from "@/content";
import { cn } from "@/lib/utils";

/**
 * VAULT GRID — refined project grid whose covers are shared elements.
 *
 * Each cover carries `layoutId={cover-<slug>}`. When a project opens, the same
 * layoutId re-mounts inside the fullscreen takeover, so Framer animates the
 * cover *out of its tile and up to fill the screen*. The tile's cover is hidden
 * while its takeover is open (so the shared element lives in exactly one place).
 */
export function VaultGrid({
  projects,
  onOpen,
  activeSlug,
}: {
  projects: Project[];
  onOpen: (p: Project) => void;
  activeSlug: string | null;
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {projects.map((p, i) => (
        <button
          key={p.slug}
          type="button"
          data-cursor="hover"
          onClick={() => onOpen(p)}
          className="group relative aspect-[16/11] overflow-hidden rounded-2xl border border-border text-left"
        >
          {/* Shared-element cover (hidden while this project's takeover is open) */}
          {activeSlug !== p.slug && (
            <motion.div
              layoutId={`cover-${p.slug}`}
              className="absolute inset-0"
              transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
            >
              {p.cover ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.cover}
                  alt={p.title}
                  loading="lazy"
                  className={cn(
                    "h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105",
                    p.coverFit === "contain" && "object-contain p-10"
                  )}
                />
              ) : (
                <div className="h-full w-full bg-card" />
              )}
            </motion.div>
          )}

          {/* Legibility gradient + reticle frame */}
          <div className="reticle pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-t from-background/90 via-background/10 to-background/20" />

          {/* Archival address */}
          <div className="absolute left-5 top-5 z-10 flex items-center gap-2 font-mono text-[0.62rem] uppercase tracking-[0.25em]">
            <span className="size-1.5 rounded-full bg-brand transition-transform duration-300 group-hover:scale-150" />
            <span className="text-muted-foreground">
              MEM {String(i + 1).padStart(2, "0")}
            </span>
          </div>

          {/* Title + meta + open affordance */}
          <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-display text-2xl tracking-tight text-foreground transition-transform duration-500 group-hover:translate-x-1 sm:text-3xl">
                {p.title}
              </h3>
              <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">
                {p.category} · {p.year}
              </div>
            </div>
            <span className="grid size-10 shrink-0 place-items-center rounded-full border border-border bg-background/50 backdrop-blur transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-brand-foreground">
              <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" />
            </span>
          </div>
        </button>
      ))}
    </div>
  );
}
