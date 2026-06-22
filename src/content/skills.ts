/**
 * SKILLS & TECH — "Tools Collected Along the Way"
 * -----------------------------------------------
 * Each tool renders as an interactive badge. Give it either:
 *   - `Icon`: any icon component (react-icons/si brand logos or lucide), or
 *   - `mono`: a 2-letter badge (used for tools without a brand icon, e.g. Adobe).
 * Add a tool by adding an object; import its icon at the top if you use one.
 */

import type { ComponentType } from "react";
import { PenTool, Search } from "lucide-react";
import {
  SiFigma,
  SiCanva,
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiTailwindcss,
  SiHtml5,
  SiMysql,
  SiPostgresql,
  SiShopify,
  SiGoogleanalytics,
  SiMeta,
  SiSlack,
  SiGoogle,
} from "react-icons/si";

export type Skill = {
  name: string;
  Icon?: ComponentType<{ className?: string }>;
  mono?: string;
};

export type SkillCategory = {
  title: string;
  items: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "Design & Brand",
    items: [
      { name: "Photoshop", mono: "Ps" },
      { name: "Canva", Icon: SiCanva },
      { name: "Figma", Icon: SiFigma },
      { name: "UI / UX Design", Icon: PenTool },
    ],
  },
  {
    title: "Motion & Video",
    items: [
      { name: "Premiere Pro", mono: "Pr" },
      { name: "After Effects", mono: "Ae" },
      { name: "CapCut", mono: "Cc" },
      { name: "Lightroom", mono: "Lr" },
    ],
  },
  {
    title: "Development",
    items: [
      { name: "React", Icon: SiReact },
      { name: "Next.js", Icon: SiNextdotjs },
      { name: "TypeScript", Icon: SiTypescript },
      { name: "Tailwind CSS", Icon: SiTailwindcss },
      { name: "HTML & CSS", Icon: SiHtml5 },
      { name: "MySQL", Icon: SiMysql },
      { name: "PostgreSQL", Icon: SiPostgresql },
    ],
  },
  {
    title: "Ecommerce & Marketing",
    items: [
      { name: "Shopify", Icon: SiShopify },
      { name: "Klaviyo", mono: "Kl" },
      { name: "Google Analytics", Icon: SiGoogleanalytics },
      { name: "Meta Ads", Icon: SiMeta },
      { name: "SEO", Icon: Search },
    ],
  },
  {
    title: "Workflow & Collaboration",
    items: [
      { name: "Slack", Icon: SiSlack },
      { name: "Google Workspace", Icon: SiGoogle },
    ],
  },
];
