"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { projects, sections, type Project } from "@/content";
import { startLenis, stopLenis } from "@/lib/lenis";
import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { SmartImage } from "@/components/site/smart-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  // Lock the page (Lenis) while the modal is open so it doesn't scroll behind.
  useEffect(() => {
    if (active) stopLenis();
    else startLenis();
    return () => startLenis();
  }, [active]);

  return (
    <section id={sections.projects.id} className="section border-t border-border/60">
      <div className="container-x">
        <SectionHeading
          className="mb-14"
          index={sections.projects.index}
          title={sections.projects.title}
          description="A vault of selected work. Open any piece to explore the full story."
        />

        <div className="grid gap-8 lg:grid-cols-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.08}>
              <button
                type="button"
                onClick={() => setActive(p)}
                data-cursor="hover"
                className="group block w-full text-left"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border transition-transform duration-500 group-hover:-translate-y-1">
                  <SmartImage
                    src={p.cover}
                    alt={p.title}
                    accent={p.accent}
                    label={p.title}
                    className="absolute inset-0 h-full w-full"
                    imgClassName="transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-background/30" />

                  {/* Customizable text overlay (set `overlay` in projects.ts) */}
                  {p.overlay && (
                    <span className="absolute left-6 top-6 rounded-full border border-border bg-background/50 px-3 py-1 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-foreground/90 backdrop-blur">
                      {p.overlay}
                    </span>
                  )}

                  {/* Project name + meta */}
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                    <div>
                      <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                        {p.category} · {p.year}
                      </div>
                      <h3 className="mt-1 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
                        {p.title}
                      </h3>
                    </div>
                    <span className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-background/60 backdrop-blur transition-all duration-300 group-hover:bg-brand group-hover:text-brand-foreground">
                      <ArrowUpRight className="size-5 transition-transform duration-300 group-hover:rotate-45" />
                    </span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-w-5xl">
          {active && <ProjectView project={active} />}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function ProjectView({ project }: { project: Project }) {
  return (
    <div className="flex flex-col overflow-y-auto">
      {/* Title + minimal meta */}
      <div className="px-6 pt-6 sm:px-8 sm:pt-8">
        <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
          {project.category} · {project.year}
        </div>
        <DialogTitle className="mt-2">{project.title}</DialogTitle>
      </div>

      <div className="p-6 sm:p-8">
        {project.embedUrl ? (
          /* Optional: live Figma embed (heavier — opt-in per project) */
          <div className="overflow-hidden rounded-xl border border-border bg-background">
            <iframe
              src={project.embedUrl}
              title={project.title}
              loading="lazy"
              allowFullScreen
              className="aspect-video w-full"
            />
          </div>
        ) : (
          /* Recommended: fast static showcase (cover + any extra images) */
          <div className="space-y-4">
            <SmartImage
              src={project.cover}
              alt={project.title}
              accent={project.accent}
              label={project.title}
              className="min-h-[300px] w-full rounded-xl border border-border"
              imgClassName="!h-auto"
            />
            {project.mockups?.map((src, i) => (
              <SmartImage
                key={i}
                src={src}
                alt={`${project.title} — ${i + 1}`}
                accent={project.accent}
                label={`Image ${i + 1}`}
                className="min-h-[300px] w-full rounded-xl border border-border"
                imgClassName="!h-auto"
              />
            ))}
          </div>
        )}

        {/* Actions */}
        {(project.prototypeUrl || project.liveUrl) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.prototypeUrl && (
              <Button asChild size="lg">
                <a href={project.prototypeUrl} target="_blank" rel="noreferrer">
                  View prototype
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            )}
            {project.liveUrl && (
              <Button asChild size="lg" variant="outline">
                <a href={project.liveUrl} target="_blank" rel="noreferrer">
                  Visit live site
                  <ArrowUpRight className="size-4" />
                </a>
              </Button>
            )}
          </div>
        )}

        {/* About this project */}
        {project.about && (
          <div className="mt-8 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              About this project
            </p>
            <div className="mt-4 space-y-4">
              {project.about.split(/\n\s*\n/).map((para, i) => (
                <p key={i} className="leading-relaxed text-muted-foreground">
                  {para}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
