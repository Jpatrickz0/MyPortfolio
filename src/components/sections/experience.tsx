"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

import { cn } from "@/lib/utils";
import { experience, sections } from "@/content";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";

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
            {experience.map((job, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li key={job.company} className="relative">
                  {/* Node on the line */}
                  <motion.span
                    aria-hidden
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-40% 0px -40% 0px" }}
                    transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute left-4 top-3 z-10 size-3 -translate-x-1/2 rounded-full border-2 border-brand bg-background lg:left-1/2"
                  />

                  <div
                    className={cn(
                      "pl-12 lg:w-[calc(50%-2.5rem)] lg:pl-0",
                      isLeft
                        ? "lg:mr-auto lg:pr-12"
                        : "lg:ml-auto lg:pl-12"
                    )}
                  >
                    <Reveal>
                      <div className="rounded-2xl border border-border bg-card/40 p-6 transition-colors duration-300 hover:border-brand/30">
                        <span className="font-mono text-sm text-brand">
                          {job.period}
                        </span>
                        <h3 className="mt-3 font-display text-xl tracking-tight text-foreground sm:text-2xl">
                          {job.role}
                        </h3>
                        {job.company && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {job.company}
                          </p>
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
                      </div>
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
