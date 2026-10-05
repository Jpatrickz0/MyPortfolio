/**
 * WORK EXPERIENCE — "Professional Timeline"
 * -----------------------------------------
 * Clean, minimal structure: a duration, a simple role name, and a few short
 * responsibility bullets. Entries render top-to-bottom in array order
 * (most recent first).
 */

export type Experience = {
  period: string;
  role: string;
  /** Optional, kept subtle. Remove the line if you'd rather omit it. */
  company?: string;
  /** Optional one-line overview shown above the bullets. */
  summary?: string;
  responsibilities: string[];
};

export const experience: Experience[] = [
  {
    period: "Jun 2026 — Jul 2026",
    role: "AI Automation",
    company: "IVL Company",
    summary:
      "Developed and deployed AI-powered voice automation for order-taking calls using ElevenLabs, Twilio, and Shopify, streamlining the customer ordering workflow for the company.",
    responsibilities: [
      "Integrated conversational AI voice agents with Shopify to automate order capture, reducing manual processing and improving order accuracy.",
      "Configured and maintained Twilio call flows to support scalable, AI-driven customer communication.",
      "Created AI-generated video content to support company marketing and product promotion initiatives.",
    ],
  },
  {
    period: "Sep 2025 — May 2026",
    role: "Customer Service Representative",
    company: "Alorica",
    responsibilities: [
      "Supported DoorDash Dashers during live deliveries via phone and chat",
      "Helped with on-the-road issues — merchant closed, unable to locate the customer, and orders already picked up",
      "Guided Dashers through the right next steps and escalated complex cases to keep deliveries moving",
      "Handled medical-account inquiries — billing, claims, and coverage — with care and accuracy",
      "Followed HIPAA-compliant procedures while keeping support clear and empathetic",
      "Maintained high customer-satisfaction and quality scores",
    ],
  },
  {
    period: "Aug 2023 — Oct 2024",
    role: "Web Developer",
    company: "Smart IT Premiere Software Company",
    responsibilities: [
      "Built and optimized WordPress sites for better functionality, speed, and UX",
      "Redesigned sites to improve usability, performance, and SEO rankings",
      "Set up Google Analytics & Tag Manager to track traffic, conversions, and engagement",
      "Configured web hosting, domains, and SSL for secure, reliable sites",
      "Built and automated Klaviyo email-marketing campaigns",
      "Ran A/B tests on design, content, and CTAs, and partnered with clients on requirements",
    ],
  },
];
