"use client";

import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const switchLocale = (next: string) => {
    const segments = pathname.split("/");
    segments[1] = next;
    const newPath = segments.join("/") || `/${next}`;
    window.location.href = newPath;
  };

  return (
    <div className="flex items-center gap-0.5 rounded-full border border-white/20 bg-white/8 p-0.5 backdrop-blur-sm">
      {(["tr", "en"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => switchLocale(lang)}
          disabled={locale === lang}
          className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 ${
            locale === lang
              ? "bg-accent text-text-main shadow-sm"
              : "text-white/60 hover:text-white"
          }`}
          aria-label={`Switch to ${lang.toUpperCase()}`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
