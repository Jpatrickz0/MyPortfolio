import { cn } from "@/lib/utils";
import { SmartImage } from "@/components/site/smart-image";

/**
 * A phone frame around a screenshot — for mobile-app projects. The screen area
 * is phone-aspect (matches 390×860 exports), so screenshots fit with no crop.
 */
export function MobileMockup({
  src,
  alt,
  label,
  accent,
  className,
}: {
  src?: string;
  alt: string;
  label?: string;
  accent?: string;
  className?: string;
}) {
  return (
    <figure className={cn("mx-auto w-full", className)}>
      <div className="relative aspect-[390/860] overflow-hidden rounded-[1.8rem] border-[5px] border-[#15151b] bg-[#15151b] shadow-2xl ring-1 ring-white/10">
        {/* notch */}
        <div className="absolute left-1/2 top-2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/70" />
        <SmartImage
          src={src}
          alt={alt}
          accent={accent}
          className="absolute inset-0 h-full w-full"
        />
      </div>
      {label && (
        <figcaption className="mt-3 text-center font-mono text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground">
          {label}
        </figcaption>
      )}
    </figure>
  );
}
