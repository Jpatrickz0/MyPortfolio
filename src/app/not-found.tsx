import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-x flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-brand">
        404
      </p>
      <h1 className="mt-6 font-display text-5xl tracking-tightest sm:text-7xl">
        Page not found.
      </h1>
      <p className="mt-5 max-w-md text-muted-foreground">
        The page you&apos;re looking for moved or never existed. Let&apos;s get
        you back on track.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/">
          <ArrowLeft className="size-4" />
          Back home
        </Link>
      </Button>
    </div>
  );
}
