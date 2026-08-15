"use client";

import { useState, useRef } from "react";
import { Play, Maximize2, Loader2, BarChart3 } from "lucide-react";

interface Props {
  embedUrl: string;
  title: string;
  coverImageUrl?: string | null;
  aspectRatio?: "16/9" | "4/3";
  liveReportLabel: string;
  fullscreenLabel: string;
  loadingLabel: string;
}

export default function PowerBIEmbed({
  embedUrl,
  title,
  coverImageUrl,
  aspectRatio = "16/9",
  liveReportLabel,
  fullscreenLabel,
  loadingLabel,
}: Props) {
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Padding-bottom trick to maintain aspect ratio
  const paddingBottom = aspectRatio === "4/3" ? "75%" : "56.25%";

  const gradients = [
    "from-primary/10 to-highlight/15",
    "from-accent/20 to-primary/10",
  ];
  const gradient = gradients[title.charCodeAt(0) % gradients.length];

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      {/* Aspect-ratio wrapper */}
      <div className="relative w-full" style={{ paddingBottom }}>
        <div className="absolute inset-0">

          {/* Cover / placeholder — shown before activation */}
          {!active && (
            <div
              className={`relative flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} cursor-pointer group`}
              onClick={() => setActive(true)}
              role="button"
              tabIndex={0}
              aria-label={liveReportLabel}
              onKeyDown={(e) => e.key === "Enter" && setActive(true)}
            >
              {coverImageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImageUrl}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <BarChart3 size={64} className="text-primary/20" />
              )}

              {/* Overlay gradient for readability */}
              <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40" />

              {/* Play button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm border border-white/30 transition-transform group-hover:scale-110">
                  <Play size={28} className="text-white translate-x-0.5" fill="white" />
                </div>
                <span className="rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-4 py-1.5 text-sm font-semibold text-white">
                  {liveReportLabel}
                </span>
              </div>
            </div>
          )}

          {/* Spinner — shown while iframe loads */}
          {active && !loaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface">
              <Loader2 size={32} className="animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{loadingLabel}</p>
            </div>
          )}

          {/* iframe — mounted when active, visible once loaded */}
          {active && (
            <iframe
              ref={iframeRef}
              src={embedUrl}
              title={title}
              allowFullScreen
              className={`h-full w-full border-0 transition-opacity duration-300 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={() => setLoaded(true)}
            />
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5">
        <span className="text-xs font-medium text-muted-foreground truncate pr-4">
          {title}
        </span>
        <a
          href={embedUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          title={fullscreenLabel}
        >
          <Maximize2 size={12} />
          {fullscreenLabel}
        </a>
      </div>
    </div>
  );
}
