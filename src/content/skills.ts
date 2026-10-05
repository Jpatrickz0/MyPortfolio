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
  SiSlack,
  SiGoogle,
  SiClaude,
  SiOpenai,
} from "react-icons/si";
import { FaCss3Alt } from "react-icons/fa";
import { CursorIcon } from "@/components/icons/brand-icons";

export type Skill = {
  name: string;
  Icon?: ComponentType<{ className?: string }>;
  mono?: string;
  /** Single-color logo silhouette in /public, tinted like the icons. */
  mask?: string;
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
      { name: "CapCut", mask: "/images/logos/capcut-mono.png" },
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
      { name: "HTML5", Icon: SiHtml5 },
      { name: "CSS3", Icon: FaCss3Alt },
      { name: "MySQL", Icon: SiMysql },
      { name: "PostgreSQL", Icon: SiPostgresql },
    ],
  },
  {
    title: "Ecommerce & Marketing",
    items: [
      { name: "Shopify", Icon: SiShopify },
      { name: "Klaviyo", mask: "/images/logos/klaviyo-mono.png" },
      { name: "Google Analytics", Icon: SiGoogleanalytics },
      { name: "SEO", Icon: Search },
    ],
  },
  {
    title: "AI Tools",
    items: [
      { name: "HeyGen", mask: "/images/logos/heygen-mono.png" },
      { name: "Higgsfield", mask: "/images/logos/higgsfield-mono.png" },
      { name: "Claude", Icon: SiClaude },
      { name: "ChatGPT", Icon: SiOpenai },
      { name: "Cursor", Icon: CursorIcon },
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
