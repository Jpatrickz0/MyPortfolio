"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { nav, profile } from "@/content";
import { Button } from "@/components/ui/button";
import { useUi } from "@/store/ui";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { menuOpen, setMenuOpen, toggleMenu } = useUi();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "mx-auto flex max-w-8xl items-center justify-between px-5 transition-all duration-500 sm:px-8 lg:px-12",
          scrolled ? "py-3" : "py-5"
        )}
      >
        <div
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 transition-all duration-500",
            scrolled
              ? "border-b border-border/70 bg-background/70 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          )}
        />
        <Link
          href="/"
          aria-label={profile.name}
          className="font-display text-lg font-semibold tracking-tightest text-foreground"
        >
          {profile.shortName}
          <span className="text-brand">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="link-underline text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="hidden sm:inline-flex">
            <Link href="#contact">
              Book a call
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
          <button
            type="button"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            className="grid size-11 place-items-center rounded-full border border-border bg-card/50 text-foreground md:hidden"
          >
            {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 top-0 z-40 flex flex-col bg-background/95 backdrop-blur-xl md:hidden"
          >
            <nav className="flex flex-1 flex-col justify-center gap-2 px-8">
              {nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.1 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-3 font-display text-4xl tracking-tightest text-foreground"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <Button asChild size="lg" className="mt-8 w-full">
                <Link href="#contact" onClick={() => setMenuOpen(false)}>
                  Book a free consultation
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
              <p className="mt-6 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {profile.email}
              </p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
