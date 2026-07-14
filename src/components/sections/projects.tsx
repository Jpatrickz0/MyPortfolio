"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { projects, sections, type Project } from "@/content";
import { cn } from "@/lib/utils";
import { startLenis, stopLenis } from "@/lib/lenis";
import { SectionHeading } from "@/components/site/section-heading";
import { SmartImage } from "@/components/site/smart-image";
import { VaultCells } from "@/components/site/vault-cells";
import { MobileMockup } from "@/components/site/mobile-mockup";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
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

// Brand icons by tech name (case-insensitive). Add new tools here.
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

// 2-letter fallback for tools without a brand icon (e.g. Adobe apps).
const TECH_MONO: Record<string, string> = {
  photoshop: "Ps",
  "premiere pro": "Pr",
  "after effects": "Ae",
  lightroom: "Lr",
  capcut: "Cc",
  klaviyo: "Kl",
};

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

        <VaultCells projects={projects} onOpen={setActive} />
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
        {project.device === "phone" ? (
          /* Mobile app — show the screens as phone mockups */
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
            {(project.screens ??
              ([{ src: project.cover }] as {
                src?: string;
                label?: string;
              }[])
            ).map((s, i) => (
              <MobileMockup
                key={i}
                src={s.src}
                alt={`${project.title} — ${s.label ?? `screen ${i + 1}`}`}
                accent={project.accent}
                label={s.label}
              />
            ))}
          </div>
        ) : project.embedUrl ? (
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
              className={cn(
                "w-full rounded-xl border border-border",
                project.coverFit === "contain"
                  ? "aspect-video"
                  : "min-h-[300px]"
              )}
              imgClassName={
                project.coverFit === "contain" ? "!object-contain p-10" : "!h-auto"
              }
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

        {/* Tech stack / tools used */}
        {project.tech && project.tech.length > 0 && (
          <div className="mt-8">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand">
              Tools used
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {project.tech.map((t) => {
                const key = t.toLowerCase();
                const Icon = TECH_ICONS[key];
                const mono = TECH_MONO[key];
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
          </div>
        )}
      </div>
    </div>
  );
}
