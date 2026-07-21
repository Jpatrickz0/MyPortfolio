"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { X, ArrowUpRight } from "lucide-react";
import type { IconType } from "react-icons";
import {
  SiFigma,
  SiShopify,
  SiCanva,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiNodedotjs,
  SiFlutter,
  SiDart,
} from "react-icons/si";

import type { Project } from "@/content";
import { cn } from "@/lib/utils";
import { startLenis, stopLenis } from "@/lib/lenis";
import { Button } from "@/components/ui/button";
import { MobileMockup } from "@/components/site/mobile-mockup";
import { TakeoverHeroFx } from "@/components/site/takeover-hero-fx";

const TECH_ICONS: Record<string, IconType> = {
  figma: SiFigma,
  shopify: SiShopify,
  canva: SiCanva,
  react: SiReact,
  "next.js": SiNextdotjs,
  typescript: SiTypescript,
  "tailwind css": SiTailwindcss,
  "node.js": SiNodedotjs,
  flutter: SiFlutter,
  dart: SiDart,
};
const TECH_MONO: Record<string, string> = {
  photoshop: "Ps",
  "premiere pro": "Pr",
  "after effects": "Ae",
  lightroom: "Lr",
  capcut: "Cc",
  klaviyo: "Kl",
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * PROJECT TAKEOVER — fullscreen immersive case study.
 *
 * Opens by expanding the clicked cover (shared `layoutId`) to fill a tall hero,
 * then scrolls through the write-up and the mockups shown huge in browser
 * frames with per-image reveals. Replaces the old centered modal.
 */
export function ProjectTakeover({
  project,
  index,
  onClose,
}: {
  project: Project;
  index: number;
  onClose: () => void;
}) {
  useEffect(() => {
    stopLenis();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      startLenis();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} — case study`}
      data-lenis-prevent
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        data-magnetic="0.4"
        className="fixed right-5 top-5 z-30 grid size-11 place-items-center rounded-full border border-border bg-background/70 text-foreground backdrop-blur transition-colors hover:border-brand hover:text-brand"
      >
        <X className="size-5" />
      </button>

      {/* HERO — shared element cover expands here */}
      <section className="relative h-[72vh] min-h-[440px] w-full overflow-hidden">
        <motion.div
          layoutId={`cover-${project.slug}`}
          className="absolute inset-0"
          transition={{ duration: 0.6, ease: [0.7, 0, 0.2, 1] }}
        >
          {project.cover && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.cover}
              alt={project.title}
              className={cn(
                "h-full w-full object-cover",
                project.coverFit === "contain" && "object-contain p-16"
              )}
            />
          )}
        </motion.div>
        <TakeoverHeroFx />
        <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-background via-background/30 to-background/40" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: EASE }}
          className="absolute inset-x-0 bottom-0 z-10"
        >
          <div className="mx-auto max-w-5xl px-6 pb-12">
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-brand">
              MEM {String(index).padStart(2, "0")} · {project.category} ·{" "}
              {project.year}
            </div>
            <h2 className="mt-3 font-display font-medium leading-[0.92] tracking-tightest text-[clamp(2.5rem,7vw,5.5rem)]">
              {project.title}
            </h2>
          </div>
        </motion.div>
      </section>

      {/* BODY */}
      <div className="mx-auto max-w-5xl px-6 pb-28 pt-14">
        {/* About + Tools */}
        <div className="grid gap-12 border-b border-border/60 pb-14 lg:grid-cols-[1.5fr_1fr]">
          {project.about && (
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-brand">
                About this project
              </p>
              <div className="space-y-4">
                {project.about.split(/\n\s*\n/).map((para, i) => (
                  <p key={i} className="text-lg leading-relaxed text-muted-foreground">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          )}
          {project.tech && project.tech.length > 0 && (
            <div>
              <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-brand">
                Tools used
              </p>
              <div className="flex flex-wrap gap-2.5">
                {project.tech.map((t) => {
                  const Icon = TECH_ICONS[t.toLowerCase()];
                  const mono = TECH_MONO[t.toLowerCase()];
                  return (
                    <span
                      key={t}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-card/50 px-4 py-2 text-sm text-foreground"
                    >
                      {Icon ? (
                        <Icon className="size-4 text-brand" />
                      ) : mono ? (
                        <span className="font-display text-sm font-semibold leading-none text-brand">
                          {mono}
                        </span>
                      ) : null}
                      {t}
                    </span>
                  );
                })}
              </div>
              {(project.prototypeUrl || project.liveUrl) && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.prototypeUrl && (
                    <Button asChild size="lg">
                      <a
                        href={project.prototypeUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View prototype <ArrowUpRight className="size-4" />
                      </a>
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button asChild size="lg" variant="outline">
                      <a href={project.liveUrl} target="_blank" rel="noreferrer">
                        Visit live site <ArrowUpRight className="size-4" />
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* App projects: the screens as phone mockups */}
        {project.device === "phone" && project.screens && project.screens.length > 0 && (
          <div className="pt-14">
            <div className="mb-8 flex items-baseline justify-between">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                The screens
              </p>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                {project.screens.length} screens
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {project.screens.map((s, i) => (
                <MobileMockup
                  key={i}
                  src={s.src}
                  alt={`${project.title} — ${s.label ?? `screen ${i + 1}`}`}
                  accent={project.accent}
                  label={s.label}
                />
              ))}
            </div>
          </div>
        )}

        {/* Mockups shown huge */}
        {project.mockups && project.mockups.length > 0 && (
          <div className="pt-14">
            <div className="mb-8 flex items-baseline justify-between">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
                The pages
              </p>
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
                {project.mockups.length} screen{project.mockups.length === 1 ? "" : "s"}
              </p>
            </div>
            <div className="space-y-20">
              {project.mockups.map((src, i) => (
                <TakeoverMockup
                  key={src}
                  src={src}
                  index={i}
                  total={project.mockups!.length}
                  host={`${project.slug}.com`}
                  alt={`${project.title} — mockup ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

function TakeoverMockup({
  src,
  index,
  total,
  host,
  alt,
}: {
  src: string;
  index: number;
  total: number;
  host: string;
  alt: string;
}) {
  const label = (src.split("/").pop() || "")
    .replace(/\.\w+$/, "")
    .replace(/^\d+[-_]/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <motion.figure
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-12%" }}
      transition={{ duration: 0.7, ease: EASE }}
      className="group"
    >
      <figcaption className="mb-3 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.25em] text-muted-foreground">
        <span>
          <span className="text-brand">{String(index + 1).padStart(2, "0")}</span>{" "}
          / {String(total).padStart(2, "0")}
        </span>
        <span>{label}</span>
      </figcaption>
      <div className="rounded-2xl border border-border bg-card/40 shadow-[0_50px_120px_-60px_rgba(0,0,0,0.95)] transition-colors duration-300 group-hover:border-brand/30">
        {/* Sticky browser chrome — stays pinned while you scroll a tall mockup */}
        <div className="sticky top-0 z-10 flex items-center gap-2 rounded-t-2xl border-b border-border/70 bg-background/95 px-4 py-3 backdrop-blur">
          <span className="size-2.5 rounded-full bg-destructive/60" />
          <span className="size-2.5 rounded-full bg-brand/70" />
          <span className="size-2.5 rounded-full bg-emerald-500/50" />
          <span className="ml-3 hidden max-w-[55%] truncate rounded-full border border-border bg-card px-3 py-1 font-mono text-[0.6rem] tracking-wide text-muted-foreground sm:inline-block">
            {host}
          </span>
        </div>
        <div className="overflow-hidden rounded-b-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="block w-full transition-transform duration-[1200ms] ease-out group-hover:scale-[1.01]"
          />
        </div>
      </div>
    </motion.figure>
  );
}
