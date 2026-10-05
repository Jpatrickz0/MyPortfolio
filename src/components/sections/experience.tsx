"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";

import { cn } from "@/lib/utils";
import { experience, sections, type Experience as Job } from "@/content";
import { SectionHeading } from "@/components/site/section-heading";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Experience() {
  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start center", "end center"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section id={sections.experience.id} className="section border-t border-border/60">
      <div className="container-x">
        <SectionHeading
          className="mb-16 lg:mx-auto lg:text-center"
          align="center"
          index={sections.experience.index}
          title={sections.experience.title}
          description="The skills, roles, and milestones collected over the years — in order."
        />

        <div ref={trackRef} className="relative mx-auto max-w-4xl">
          {/* Base line */}
          <div
            aria-hidden
            className="absolute left-4 top-0 h-full w-px bg-border lg:left-1/2 lg:-translate-x-1/2"
          />
          {/* Animated progress line (grows as you scroll) */}
          <motion.div
            aria-hidden
            style={{ scaleY: lineScale }}
            className="absolute left-4 top-0 h-full w-px origin-top bg-brand lg:left-1/2 lg:-translate-x-1/2"
          />

          <ol className="space-y-12 lg:space-y-4">
            {experience.map((job, i) => (
              <TimelineNode
                key={job.company + job.period}
                job={job}
                index={i}
                total={experience.length}
                isLeft={i % 2 === 0}
                progress={lineScale}
              />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/**
 * A single memory on the timeline. Its dot and card light up when the amber
 * progress line first reaches it — then they LATCH on: scrolling back up keeps
 * them lit and fully legible (they never re-fade), so revisiting the timeline
 * stays easy to read.
 */
function TimelineNode({
  job,
  index,
  total,
  isLeft,
  progress,
}: {
  job: Job;
  index: number;
  total: number;
  isLeft: boolean;
  progress: MotionValue<number>;
}) {
  // Where along the line this node sits (0 = top … 1 = bottom).
  const at = total > 1 ? index / (total - 1) : 0;
  const fill = useTransform(progress, [at - 0.06, at + 0.01], [0, 1]);
  const [active, setActive] = useState(false);

  // Latch on the first time the line reaches this node — never turn back off.
  useMotionValueEvent(fill, "change", (v) => {
    if (v >= 0.6) setActive(true);
  });
  useEffect(() => {
    if (fill.get() >= 0.6) setActive(true);
  }, [fill]);

  return (
    <li className="relative">
      {/* Node on the line */}
      <motion.span
        aria-hidden
        initial={false}
        animate={
          active
            ? {
                backgroundColor: "hsl(var(--brand))",
                scale: 1.4,
                boxShadow: "0 0 16px 2px hsl(var(--brand) / 0.65)",
              }
            : {
                backgroundColor: "hsl(var(--background))",
                scale: 1,
                boxShadow: "0 0 0 0 hsl(var(--brand) / 0)",
              }
        }
        transition={{ duration: 0.45, ease: EASE }}
        className="absolute left-4 top-3 z-10 size-3 -translate-x-1/2 rounded-full border-2 border-brand lg:left-1/2"
      />

      <div
        className={cn(
          "pl-12 lg:w-[calc(50%-2.5rem)] lg:pl-0",
          isLeft ? "lg:mr-auto lg:pr-12" : "lg:ml-auto lg:pl-12"
        )}
      >
        <motion.div
          initial={false}
          animate={{
            opacity: active ? 1 : 0.55,
            borderColor: active
              ? "hsl(var(--brand) / 0.4)"
              : "hsl(var(--border))",
          }}
          whileHover={{ y: -3 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="rounded-2xl border bg-card/40 p-6"
        >
          <span className="font-mono text-sm text-brand">{job.period}</span>
          <h3 className="mt-3 font-display text-xl tracking-tight text-foreground sm:text-2xl">
            {job.role}
          </h3>
          {job.company && (
            <p className="mt-1 text-sm text-muted-foreground">{job.company}</p>
          )}
          {job.summary && (
            <p className="mt-4 text-sm leading-relaxed text-foreground/85">{job.summary}</p>
          )}
          <ul className="mt-4 space-y-2">
            {job.responsibilities.map((r) => (
              <li
                key={r}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <span className="mt-1.5 size-1 shrink-0 rounded-full bg-brand" />
                {r}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </li>
  );
}
