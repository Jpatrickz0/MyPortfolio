"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { skillCategories, sections } from "@/content";
import { SectionHeading } from "@/components/site/section-heading";
import { SkillWeb } from "@/components/site/skill-web";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.05 } },
};

export function Skills() {
  const reduce = useReducedMotion();

  // Springy pop-in for each badge (opacity-only when reduced motion).
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.9 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: reduce
        ? { duration: 0.3 }
        : { type: "spring", stiffness: 320, damping: 22 },
    },
  };

  return (
    <section id={sections.skills.id} className="section border-t border-border/60">
      <div className="container-x">
        <SectionHeading
          className="mb-14"
          index={sections.skills.index}
          title={sections.skills.title}
          description="The tools I've picked up across design, development, ecommerce, and marketing."
        />

        {/* Neural memory web (the categorised list below is the fallback) */}
        <SkillWeb />

        <div className="mt-6 grid gap-10 sm:grid-cols-2">
          {skillCategories.map((category) => (
            <div key={category.title}>
              <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-brand">
                {category.title}
              </h3>
              <motion.div
                className="grid grid-cols-2 gap-3 sm:grid-cols-3"
                variants={container}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-60px" }}
              >
                {category.items.map((it) => (
                  <motion.div
                    key={it.name}
                    variants={item}
                    whileHover={reduce ? undefined : { y: -6, scale: 1.04 }}
                    transition={{ type: "spring", stiffness: 400, damping: 18 }}
                    data-cursor="hover"
                    className="group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card/50 px-3 py-6 text-center transition-[border-color,background-color,box-shadow] duration-300 hover:border-brand/50 hover:bg-card hover:shadow-[0_14px_44px_-14px_hsl(var(--brand)/0.5)]"
                  >
                    <span className="grid size-12 place-items-center rounded-xl border border-border bg-background text-foreground transition-all duration-300 group-hover:scale-110 group-hover:border-brand/50 group-hover:bg-brand/10 group-hover:text-brand">
                      {it.mask ? (
                        // Logo silhouette filled with currentColor, like the icon set.
                        <span
                          aria-hidden
                          className="size-6 bg-current"
                          style={{
                            maskImage: `url(${it.mask})`,
                            WebkitMaskImage: `url(${it.mask})`,
                            maskSize: "contain",
                            WebkitMaskSize: "contain",
                            maskRepeat: "no-repeat",
                            WebkitMaskRepeat: "no-repeat",
                            maskPosition: "center",
                            WebkitMaskPosition: "center",
                          }}
                        />
                      ) : it.Icon ? (
                        <it.Icon className="size-6" />
                      ) : (
                        <span className="font-display text-lg font-semibold tracking-tight">
                          {it.mono}
                        </span>
                      )}
                    </span>
                    <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                      {it.name}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
