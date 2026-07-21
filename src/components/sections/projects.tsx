"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";

import { projects, sections, type Project } from "@/content";
import { SectionHeading } from "@/components/site/section-heading";
import { VaultGrid } from "@/components/site/vault-grid";
import { ProjectTakeover } from "@/components/site/project-takeover";

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section id={sections.projects.id} className="section border-t border-border/60">
      <div className="container-x">
        <SectionHeading
          className="mb-14"
          index={sections.projects.index}
          title={sections.projects.title}
          description="A vault of selected work. Open any piece for the full case study."
        />

        <VaultGrid
          projects={projects}
          onOpen={setActive}
          activeSlug={active?.slug ?? null}
        />
      </div>

      <AnimatePresence>
        {active && (
          <ProjectTakeover
            project={active}
            index={projects.findIndex((p) => p.slug === active.slug) + 1}
            onClose={() => setActive(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
