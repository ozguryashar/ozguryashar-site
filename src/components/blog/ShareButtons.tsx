"use client";

import { useState } from "react";
import { Link2, Check } from "lucide-react";

function LinkedInIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

interface Props {
  title?: string;
  labels: {
    shareTitle: string;
    shareCopy: string;
    shareCopied: string;
    shareLinkedin: string;
  };
}

export default function ShareButtons({ labels }: Props) {
  const [copied, setCopied] = useState(false);

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: nothing to do
    }
  };

  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`;

  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {labels.shareTitle}
      </p>
      <div className="flex flex-col gap-2">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          {copied ? (
            <Check size={14} className="text-green-500" />
          ) : (
            <Link2 size={14} />
          )}
          {copied ? labels.shareCopied : labels.shareCopy}
        </button>
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          <LinkedInIcon size={14} />
          {labels.shareLinkedin}
        </a>
      </div>
    </div>
  );
}
