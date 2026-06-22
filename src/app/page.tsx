import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
// import { Testimonials } from "@/components/sections/testimonials"; // hidden — no clients yet
import { Contact } from "@/components/sections/contact";
import { profile } from "@/content";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  description: profile.description,
  url: profile.url,
  email: profile.email,
  sameAs: profile.socials.map((s) => s.href),
  knowsAbout: profile.disciplines,
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />

      {/* Shared Experiences (testimonials) — HIDDEN for now (no clients yet).
          To show it again, uncomment the next line. */}
      {/* <Testimonials /> */}

      <Contact />
    </>
  );
}
