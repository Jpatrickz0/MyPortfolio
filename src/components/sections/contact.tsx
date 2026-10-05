import { Reveal } from "@/components/motion/reveal";
import { LeadForm } from "@/components/site/lead-form";
import { SectionHeading } from "@/components/site/section-heading";
import { profile, sections } from "@/content";

export function Contact() {
  return (
    <section id={sections.contact.id} className="section border-t border-border/60">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            index={sections.contact.index}
            title={sections.contact.title}
            description="Have something you want to build? Tell me about it — if it's a fit, we'll start the next memory together."
          />

          <Reveal delay={0.16}>
            <a
              href={`mailto:${profile.email}`}
              className="link-underline mt-10 inline-block text-muted-foreground hover:text-foreground"
            >
              or email me directly — {profile.email}
            </a>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <LeadForm />
        </Reveal>
      </div>
    </section>
  );
}
