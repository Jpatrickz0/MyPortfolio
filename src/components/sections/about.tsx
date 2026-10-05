"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Compass,
  Flame,
  ScanSearch,
  ShieldCheck,
  Users,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { about, profile, sections } from "@/content";

const EASE = [0.22, 1, 0.36, 1] as const;

const TRAIT_ICONS: Record<string, LucideIcon> = {
  flame: Flame,
  zap: Zap,
  scan: ScanSearch,
  users: Users,
  compass: Compass,
  shield: ShieldCheck,
};

export function About() {
  const reduce = useReducedMotion();
  const [greeting, ...story] = about.paragraphs;

  return (
    <section id={sections.about.id} className="section relative overflow-hidden border-t border-border/60">
      {/* Ambient amber wash behind the dossier print */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/3 -z-10 size-[640px] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, hsl(var(--brand) / 0.12), transparent 65%)" }}
      />

      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index={sections.about.index} title={sections.about.title} />
          <Reveal>
            <p className="font-mono text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
              Subject file · {profile.shortName}-01
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
          {/* ---------- Dossier print ---------- */}
          <Reveal className="relative mx-auto w-full max-w-sm lg:max-w-md">
            <div className="group relative">
              {/* Ghost prints stacked behind */}
              <div
                aria-hidden
                className="absolute inset-0 -rotate-6 rounded-2xl border border-border bg-card/40 transition-transform duration-700 ease-out group-hover:-rotate-[9deg]"
              />
              <div
                aria-hidden
                className="absolute inset-0 rotate-3 rounded-2xl border border-brand/25 bg-brand/[0.04] transition-transform duration-700 ease-out group-hover:rotate-6"
              />

              {/* Main print */}
              <figure className="relative -rotate-1 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] transition-transform duration-700 ease-out group-hover:rotate-0">
                <div className="relative aspect-[4/5]">
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "radial-gradient(75% 60% at 50% 32%, hsl(var(--brand) / 0.28), transparent 70%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-grid-faint [background-size:28px_28px] opacity-20"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={profile.aboutPhoto}
                    alt={`${profile.name} smiling`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-top pt-8 transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    style={{ filter: "drop-shadow(0 0 22px hsl(var(--brand) / 0.3))" }}
                  />

                  {/* Scan line */}
                  {!reduce && (
                    <motion.div
                      aria-hidden
                      className="absolute inset-x-0 h-px bg-brand/70 shadow-[0_0_14px_2px_hsl(var(--brand)/0.55)]"
                      initial={{ top: "0%" }}
                      animate={{ top: ["0%", "100%"] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  {/* Corner brackets */}
                  {[
                    "left-3 top-3 border-l border-t",
                    "right-3 top-3 border-r border-t",
                    "left-3 bottom-3 border-l border-b",
                    "right-3 bottom-3 border-r border-b",
                  ].map((pos) => (
                    <span
                      key={pos}
                      aria-hidden
                      className={`absolute size-5 border-brand ${pos}`}
                    />
                  ))}

                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-card via-card/70 to-transparent" />
                </div>

                {/* ID strip */}
                <figcaption className="relative grid grid-cols-[1fr_auto] items-end gap-4 border-t border-border px-5 py-4">
                  <div className="space-y-1 font-mono text-[0.62rem] uppercase tracking-[0.2em]">
                    <p className="text-muted-foreground">
                      Subject <span className="text-foreground">{profile.name}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Based <span className="text-foreground">{profile.location}</span>
                    </p>
                    <p className="flex items-center gap-2 text-muted-foreground">
                      Status
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-brand opacity-75" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-brand" />
                      </span>
                      <span className="text-brand">Available</span>
                    </p>
                  </div>
                  <Barcode />
                </figcaption>
              </figure>

              <Stamp reduce={!!reduce} />
            </div>
          </Reveal>

          {/* ---------- Story ---------- */}
          <div>
            <Reveal>
              <p className="font-display text-4xl font-medium leading-[1.05] tracking-tightest sm:text-5xl">
                {greeting.replace(profile.name + ".", "")}
                <span className="bg-gradient-to-r from-brand to-brand/50 bg-clip-text text-transparent">
                  {profile.name}.
                </span>
              </p>
            </Reveal>

            <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground">
              {story.map((p, i) => (
                <Reveal as="p" key={i} delay={0.08 + i * 0.06}>
                  {i === story.length - 1 ? <span className="text-foreground">{p}</span> : p}
                </Reveal>
              ))}
            </div>

            {/* Little things about me */}
            <div className="mt-12">
              <Reveal>
                <p className="flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">
                  <span className="h-px w-8 bg-brand" />
                  Little things about me
                </p>
              </Reveal>
              <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {about.traits.map((t, i) => {
                  const Icon = TRAIT_ICONS[t.icon] ?? Flame;
                  return (
                    <motion.li
                      key={t.title}
                      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.97 }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.55, ease: EASE, delay: 0.05 + i * 0.06 }}
                      className="group/trait relative overflow-hidden rounded-xl border border-border bg-card/40 p-4 transition-[border-color,transform,background-color] duration-300 hover:-translate-y-1 hover:border-brand/50 hover:bg-card"
                    >
                      <span
                        aria-hidden
                        className="pointer-events-none absolute -right-8 -top-8 size-24 rounded-full bg-brand/0 blur-2xl transition-colors duration-500 group-hover/trait:bg-brand/20"
                      />
                      <span className="relative flex size-9 items-center justify-center rounded-lg border border-brand/30 bg-brand/10 text-brand transition-all duration-300 group-hover/trait:-rotate-6 group-hover/trait:bg-brand group-hover/trait:text-brand-foreground">
                        <Icon className="size-4" />
                      </span>
                      <p className="relative mt-4 font-display text-lg leading-tight text-foreground">
                        {t.title}
                      </p>
                      <p className="relative mt-1 text-sm leading-snug text-muted-foreground">
                        {t.note}
                      </p>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Rotating circular "archive" seal pinned to the print's corner. */
function Stamp({ reduce }: { reduce: boolean }) {
  const text = `The archive of ${profile.shortName} • Memory 01 • `;
  return (
    <div aria-hidden className="absolute -right-6 -top-8 size-28 sm:-right-10 sm:size-32">
      <motion.svg
        viewBox="0 0 120 120"
        className="size-full"
        animate={reduce ? {} : { rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
      >
        <defs>
          <path id="stamp-circle" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
        </defs>
        <circle cx="60" cy="60" r="58" className="fill-background/80 stroke-brand/40" strokeWidth="1" />
        <text className="fill-brand font-mono text-[9.5px] uppercase tracking-[0.28em]">
          <textPath href="#stamp-circle">{text}</textPath>
        </text>
        <circle cx="60" cy="60" r="16" className="fill-brand" />
      </motion.svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-sm font-semibold text-brand-foreground">
        {profile.shortName}
      </span>
    </div>
  );
}

/** Decorative barcode for the ID strip. */
function Barcode() {
  const bars = [2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 1, 3];
  return (
    <div aria-hidden className="flex h-9 items-stretch gap-[2px] opacity-70">
      {bars.map((w, i) => (
        <span key={i} className="bg-foreground/80" style={{ width: w }} />
      ))}
    </div>
  );
}
