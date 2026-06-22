import { Reveal } from "@/components/motion/reveal";
import { SectionHeading } from "@/components/site/section-heading";
import { about, profile, sections } from "@/content";

export function About() {
  return (
    <section id={sections.about.id} className="section border-t border-border/60">
      <div className="container-x">
        <SectionHeading index={sections.about.index} title={sections.about.title} />

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-20">
          {/* Story */}
          <div className="space-y-5 text-lg leading-relaxed text-muted-foreground">
            {about.paragraphs.map((p, i) => (
              <Reveal as="p" key={i} delay={i * 0.06}>
                {i === about.paragraphs.length - 1 ? (
                  <span className="text-foreground">{p}</span>
                ) : (
                  p
                )}
              </Reveal>
            ))}

            <Reveal delay={0.2}>
              <ul className="!mt-8 flex flex-wrap gap-2">
                {about.values.map((v) => (
                  <li
                    key={v}
                    className="rounded-full border border-border bg-card/50 px-4 py-2 text-sm text-foreground"
                  >
                    {v}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* Archival side panel: quick facts + disciplines index */}
          <div className="space-y-8">
            <Reveal>
              <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border">
                {about.quickFacts.map((f) => (
                  <div key={f.label} className="bg-card px-3 py-5 text-center">
                    <div className="font-display text-2xl font-medium tracking-tightest text-foreground sm:text-3xl">
                      {f.value}
                    </div>
                    <div className="mt-1 text-xs leading-tight text-muted-foreground">
                      {f.label}
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-border bg-card/40 p-6">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Disciplines on file
                </p>
                <ul className="mt-4 space-y-3">
                  {profile.disciplines.map((d, i) => (
                    <li
                      key={d}
                      className="flex items-center justify-between border-b border-border/60 pb-3 text-foreground last:border-0 last:pb-0"
                    >
                      <span>{d}</span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
