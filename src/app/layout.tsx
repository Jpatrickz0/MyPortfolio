import type { Metadata, Viewport } from "next";
import "./globals.css";

import { cn } from "@/lib/utils";
import { fontSans, fontDisplay, fontMono } from "@/lib/fonts";
import { profile } from "@/content";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { Loader } from "@/components/site/loader";
import { AmbientBackdrop } from "@/components/site/ambient-backdrop";
import { MagneticButtons } from "@/components/site/magnetic";
import { MemoryRail } from "@/components/site/memory-rail";
import { Enter } from "@/components/site/enter";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  metadataBase: new URL(profile.url),
  title: {
    default: `${profile.name} — ${profile.roleLine}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.description,
  keywords: [
    "digital creator",
    "web designer",
    "web developer",
    "Shopify",
    "Klaviyo",
    "ecommerce",
    "digital marketing",
    "brand design",
    "video editing",
  ],
  authors: [{ name: profile.name, url: profile.url }],
  creator: profile.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: profile.url,
    title: `${profile.name} — ${profile.roleLine}`,
    description: profile.description,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.roleLine}`,
    description: profile.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0c0c10",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        fontSans.variable,
        fontDisplay.variable,
        fontMono.variable
      )}
      suppressHydrationWarning
    >
      <body className="grain min-h-dvh bg-background text-foreground">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-md focus:bg-brand focus:px-4 focus:py-2 focus:text-brand-foreground"
        >
          Skip to content
        </a>
        <Loader />
        <AmbientBackdrop />
        <ScrollProgress />
        <MemoryRail />
        <MagneticButtons />
        <SmoothScroll>
          <Enter>
            <Navbar />
            <main id="main">{children}</main>
            <Footer />
          </Enter>
        </SmoothScroll>
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
