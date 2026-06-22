/**
 * TESTIMONIALS — "Shared Experiences"
 * -----------------------------------
 * To HIDE this section entirely, see the comment around <Testimonials /> in
 * src/app/page.tsx (just delete/comment one line). Edit quotes here.
 */

export type Testimonial = {
  quote: string;
  name: string;
  title: string;
  result: string;
};

export const testimonials: Testimonial[] = [
  {
    quote:
      "Jan rebuilt our marketing site and our demo requests doubled in the first month. He thinks like a growth partner, not just a designer.",
    name: "Sarah Chen",
    title: "CEO, Lumen SaaS",
    result: "+118% demos",
  },
  {
    quote:
      "From the storefront to the email flows, Jan handled it all. Revenue per visitor is up across the board — best creative hire we've made.",
    name: "Marcus Reyes",
    title: "Founder, Vela Commerce",
    result: "+34% revenue / visitor",
  },
  {
    quote:
      "Design, video, landing page — one person, one cohesive campaign, delivered fast. It sold out in a week.",
    name: "Priya Nair",
    title: "Brand Lead, Cascade",
    result: "Sold out in 7 days",
  },
];
