"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

const links = [
  { key: "home" as const, href: "/tr" },
  { key: "blog" as const, href: "/tr/blog" },
  { key: "projects" as const, href: "/tr/projects" },
  { key: "about" as const, href: "/tr/about" },
  { key: "contact" as const, href: "/tr/contact" },
];

export default function Header() {
  const t = useTranslations("nav");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 bg-white ${
        scrolled
          ? "border-b border-border shadow-sm"
          : "border-b border-border/50"
      }`}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">

        {/* Logo */}
        <Link href="/tr" className="flex items-center gap-2.5 shrink-0 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-highlight text-white text-sm font-extrabold select-none shadow-sm transition-transform group-hover:scale-105">
            ÖY
          </div>
          <span className="text-base font-bold text-text-main">Özgür Yaşar</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-text-main hover:bg-surface transition-all duration-200"
            >
              {t(key)}
            </Link>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center">
          <Link
            href="/tr/contact"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white hover:bg-primary/90 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
          >
            {t("cta")}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-text-main transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border bg-white px-4 pb-5">
          <nav className="flex flex-col gap-1 pt-3">
            {links.map(({ key, href }) => (
              <Link
                key={key}
                href={href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-surface hover:text-text-main transition-all"
              >
                {t(key)}
              </Link>
            ))}
          </nav>
          <div className="mt-4 px-1">
            <Link
              href="/tr/contact"
              onClick={() => setOpen(false)}
              className="block w-full rounded-xl bg-primary px-5 py-2.5 text-center text-sm font-bold text-white hover:bg-primary/90 transition-colors"
            >
              {t("cta")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
