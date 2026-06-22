import { CalendarCheck, MessageSquare, ShieldCheck } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { LeadForm } from "@/components/site/lead-form";
import { SectionHeading } from "@/components/site/section-heading";
import { profile, sections } from "@/content";

const assurances = [
  {
    icon: CalendarCheck,
    title: "Free consultation",
    desc: "We'll talk through your goals and see if we're a good fit.",
  },
  {
    icon: MessageSquare,
    title: "A reply within a day",
    desc: "I read every message personally and reply within a business day.",
  },
  {
    icon: ShieldCheck,
    title: "A clear proposal",
    desc: "You'll get a clear scope and price before any work begins.",
  },
];

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
            <ul className="mt-10 space-y-6">
              {assurances.map((a) => {
                const Icon = a.icon;
                return (
                  <li key={a.title} className="flex gap-4">
                    <span className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border border-border bg-card text-brand">
                      <Icon className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-medium text-foreground">{a.title}</h3>
                      <p className="text-sm text-muted-foreground">{a.desc}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <Reveal delay={0.22}>
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
