import { Quote } from "lucide-react";

import { testimonials, sections } from "@/content";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";

export function Testimonials() {
  return (
    <section id={sections.testimonials.id} className="section border-t border-border/60">
      <div className="container-x">
        <SectionHeading
          className="mb-14"
          index={sections.testimonials.index}
          title={sections.testimonials.title}
          description="A few words from the people I've built memories with."
        />

        <StaggerGroup className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <figure className="card-surface flex h-full flex-col p-8">
                <Quote className="size-7 text-brand" />
                <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
                  <div>
                    <div className="font-medium text-foreground">{t.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {t.title}
                    </div>
                  </div>
                  <span className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
                    {t.result}
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
