import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { Mail } from "lucide-react";

function LinkedInIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();

  const links = [
    { key: "home", href: "/" },
    { key: "blog", href: "/blog" },
    { key: "projects", href: "/projects" },
    { key: "about", href: "/about" },
    { key: "contact", href: "/contact" },
  ] as const;

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#060E1E] via-[#0F3460] to-[#0A2647] text-white">
      {/* Grid overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Glow spots */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-64 w-64 rounded-full bg-highlight/8 blur-3xl" />
        <div className="absolute right-1/4 bottom-0 h-48 w-48 rounded-full bg-accent/6 blur-3xl" />
      </div>

      {/* Top border accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />

      <div className="container relative mx-auto px-4 md:px-6 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* Logo + tagline */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2.5">
              <span className="text-base font-bold text-white">Özgür Yaşar</span>
            </div>
            <p className="text-sm text-white/55 leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
            {/* Social links */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href={`mailto:${t("email")}`}
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-accent hover:border-accent/30 hover:bg-white/10 transition-all duration-200"
                aria-label="Email"
              >
                <Mail size={15} />
              </a>
              <a
                href="https://linkedin.com/in/ozguryasar1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/60 hover:text-accent hover:border-accent/30 hover:bg-white/10 transition-all duration-200"
                aria-label="LinkedIn"
              >
                <LinkedInIcon size={15} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="mb-5 text-xs font-bold uppercase tracking-widest text-white/35">
              {t("nav_title")}
            </p>
            <nav className="flex flex-col gap-2">
              {links.map(({ key, href }) => (
                <Link
                  key={key}
                  href={href}
                  className="text-sm text-white/55 hover:text-accent transition-colors duration-200 hover:translate-x-0.5 inline-block"
                >
                  {nav(key)}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <p className="text-xs font-bold uppercase tracking-widest text-white/35">
              İletişim
            </p>
            <a
              href={`mailto:${t("email")}`}
              className="flex items-center gap-2.5 text-sm text-white/55 hover:text-accent transition-colors duration-200 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-accent/30 transition-colors">
                <Mail size={14} />
              </div>
              {t("email")}
            </a>
            <a
              href="https://linkedin.com/in/ozguryasar1"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 text-sm text-white/55 hover:text-accent transition-colors duration-200 group"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-accent/30 transition-colors">
                <LinkedInIcon size={14} />
              </div>
              LinkedIn — ozguryasar1
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-white/8 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/30">
          <span>{t("rights")}</span>
          <span className="hidden md:block">Data & Business Intelligence</span>
        </div>
      </div>
    </footer>
  );
}
