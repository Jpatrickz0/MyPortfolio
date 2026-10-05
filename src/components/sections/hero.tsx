"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HeroCharacter } from "@/components/site/hero-character";
import { profile } from "@/content";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const reduce = useReducedMotion();

  // Split the name across two centered lines for the poster composition.
  const parts = profile.name.split(" ");
  const last = parts.pop() ?? "";
  const first = parts.join(" ");

  return (
    <section
      id="home"
      className="relative flex h-dvh min-h-[640px] items-center justify-center overflow-hidden"
    >
      {/* ---- Background ---- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20 bg-grid-faint [background-size:64px_64px] opacity-[0.22] [mask-image:radial-gradient(75%_75%_at_50%_45%,black,transparent)]"
      />
      {/* Cinematic spotlight that blooms in behind the figure */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-20 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, hsl(38 92% 58% / 0.18), transparent 65%)",
        }}
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
      />
      {/* Slowly rotating archival ring */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-20 hidden -translate-x-1/2 -translate-y-1/2 sm:block"
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ duration: 140, repeat: Infinity, ease: "linear" }}
      >
        <div className="size-[620px] rounded-full border border-border/40 lg:size-[800px]" />
      </motion.div>

      {/* ---- Giant name (sits BEHIND the figure) ---- */}
      <h1
        aria-label={profile.name}
        className="pointer-events-none absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 px-4 text-center font-display font-semibold uppercase leading-[0.82] tracking-tightest text-[clamp(3rem,15vw,13rem)]"
      >
        <Line text={first} delay={0.35} reduce={!!reduce} className="text-foreground/90" />
        <Line
          text={last}
          delay={0.5}
          reduce={!!reduce}
          className="bg-gradient-to-b from-brand to-brand/40 bg-clip-text text-transparent"
        />
      </h1>

      {/* ---- Particle figure (centered, in FRONT of the name) ---- */}
      <div className="absolute inset-x-0 bottom-0 z-10 mx-auto h-[86dvh] w-full max-w-2xl">
        {/* Soft amber ground glow behind the particle field */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-[10%] bottom-0 top-[12%] -z-0 rounded-[40%] blur-3xl"
          style={{
            background:
              "radial-gradient(60% 70% at 50% 45%, hsl(38 92% 58% / 0.20), transparent 70%)",
          }}
        />
        <HeroCharacter />
      </div>

      {/* ---- Outlined echo of the name (in FRONT of the figure) ---- */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-[15] -translate-y-1/2 px-4 text-center font-display font-semibold uppercase leading-[0.82] tracking-tightest text-[clamp(3rem,15vw,13rem)]"
      >
        <Line text={first} delay={0.35} reduce={!!reduce} stroke="hsl(var(--foreground) / 0.55)" />
        <Line text={last} delay={0.5} reduce={!!reduce} stroke="hsl(var(--brand) / 0.75)" />
      </div>

      {/* ---- Top label ---- */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.15 }}
        className="absolute inset-x-0 top-28 z-20 flex justify-center px-4"
      >
        <span className="flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground sm:text-xs">
          <span className="size-1.5 rounded-full bg-brand" />
          Memory 00 — Present · The Archive of {profile.shortName}
        </span>
      </motion.div>

      {/* ---- Bottom: tagline + CTAs (in front of everything) ---- */}
      <div className="absolute inset-x-0 bottom-0 z-20">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-64 bg-gradient-to-t from-background via-background/85 to-transparent" />
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col items-center gap-6 px-5 pb-9 text-center"
        >
          <p className="max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            {profile.brand}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild size="lg">
              <a href="#contact" data-magnetic="0.4">
                Start a project
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#work" data-magnetic="0.4">
                Explore the archive
              </a>
            </Button>
          </div>
          <motion.a
            href="#about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
            className="mt-1 inline-flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <motion.span
              animate={reduce ? {} : { y: [0, 4, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            >
              <ArrowDown className="size-4" />
            </motion.span>
            Begin the archive
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function Line({
  text,
  delay,
  reduce,
  className,
  stroke,
}: {
  text: string;
  delay: number;
  reduce: boolean;
  className?: string;
  /** Render as a hollow outline in this color instead of a fill. */
  stroke?: string;
}) {
  const style = stroke
    ? { color: "transparent", WebkitTextStroke: `1.5px ${stroke}` }
    : undefined;
  if (reduce)
    return (
      <span className={`block ${className ?? ""}`} style={style}>
        {text}
      </span>
    );
  return (
    <span className="block overflow-hidden">
      <motion.span
        style={style}
        className={`block ${className ?? ""}`}
        initial={{ y: "115%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 1, ease: EASE, delay }}
      >
        {text}
      </motion.span>
    </span>
  );
}
