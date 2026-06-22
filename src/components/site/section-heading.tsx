import { cn } from "@/lib/utils";
import { Reveal, FocusReveal } from "@/components/motion/reveal";

/**
 * Archival section heading: a "Memory 0X" index tag above the section title,
 * matching the Memory Architecture concept.
 */
export function SectionHeading({
  index,
  title,
  description,
  align = "left",
  className,
}: {
  index: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className
      )}
    >
      <Reveal>
        <p
          className={cn(
            "eyebrow mb-4",
            align === "center" && "justify-center"
          )}
        >
          <span className="size-1.5 rounded-full bg-brand" />
          {index}
        </p>
      </Reveal>
      <FocusReveal
        as="h2"
        className="font-display text-fluid-h2 font-medium leading-[1.02] tracking-tightest"
      >
        {title}
      </FocusReveal>
      {description && (
        <Reveal delay={0.1}>
          <p
            className={cn(
              "mt-5 text-lg text-muted-foreground",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  );
}
