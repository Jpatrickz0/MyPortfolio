import { skillCategories, sections } from "@/content";
import { StaggerGroup, StaggerItem } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";

export function Skills() {
  return (
    <section id={sections.skills.id} className="section border-t border-border/60">
      <div className="container-x">
        <SectionHeading
          className="mb-14"
          index={sections.skills.index}
          title={sections.skills.title}
          description="The tools I've picked up across design, development, ecommerce, and marketing."
        />

        <div className="grid gap-10 sm:grid-cols-2">
          {skillCategories.map((category) => (
            <div key={category.title}>
              <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.2em] text-brand">
                {category.title}
              </h3>
              <StaggerGroup className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {category.items.map((item) => (
                  <StaggerItem key={item.name}>
                    <div
                      data-cursor="hover"
                      className="group flex h-full flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card/50 px-3 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:bg-card"
                    >
                      <span className="grid size-12 place-items-center rounded-xl border border-border bg-background text-foreground transition-colors duration-300 group-hover:border-brand/40 group-hover:text-brand">
                        {item.Icon ? (
                          <item.Icon className="size-6" />
                        ) : (
                          <span className="font-display text-lg font-semibold tracking-tight">
                            {item.mono}
                          </span>
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                        {item.name}
                      </span>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
