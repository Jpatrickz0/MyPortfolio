"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Image that fades in once loaded and shows a styled placeholder if the file
 * is missing — so the layout always looks finished while assets are gathered.
 */
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  label,
  accent = "#F2A33C",
}: {
  src?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  label?: string;
  accent?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // A cached image can finish loading before React attaches onLoad/onError
  // (hydration race), which would otherwise leave the placeholder stuck.
  // Detect an already-complete image on mount.
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    if (el.complete) {
      if (el.naturalWidth === 0) setFailed(true);
      else setLoaded(true);
    }
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-card", className)}>
      {/* Placeholder */}
      {(!loaded || failed) && (
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(120% 90% at 70% 15%, ${accent}22, transparent 55%), linear-gradient(160deg, hsl(240 13% 11%), hsl(240 16% 6%))`,
            }}
          />
          <div className="absolute inset-0 bg-grid-faint [background-size:30px_30px] opacity-25" />
          {label && (
            <div className="absolute inset-0 flex items-center justify-center px-4 text-center">
              <span className="font-display text-2xl tracking-tightest text-foreground/80">
                {label}
              </span>
            </div>
          )}
        </div>
      )}

      {src && !failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className={cn(
            "relative h-full w-full object-cover transition-opacity duration-700",
            loaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
        />
      )}
    </div>
  );
}
