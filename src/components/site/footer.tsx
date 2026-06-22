import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { profile, nav } from "@/content";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-card/30">
      <div className="container-x py-20">
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div>
            <p className="eyebrow mb-4">Available for new projects</p>
            <Link
              href="#contact"
              className="group inline-flex items-end gap-3 font-display text-4xl tracking-tightest text-foreground sm:text-6xl"
            >
              Let&apos;s talk
              <ArrowUpRight className="mb-2 size-8 text-brand transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:size-12" />
            </Link>
            <a
              href={`mailto:${profile.email}`}
              className="link-underline mt-6 block w-fit text-lg text-muted-foreground hover:text-foreground"
            >
              {profile.email}
            </a>
          </div>

          <div>
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Navigate
            </h3>
            <ul className="space-y-2">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-sm text-muted-foreground sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {profile.name}. A digital archive,
            built with care.
          </p>
          <p className="font-mono text-xs uppercase tracking-widest">
            {profile.location}
          </p>
        </div>
      </div>
    </footer>
  );
}
