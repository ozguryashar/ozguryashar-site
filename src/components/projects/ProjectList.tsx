"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  BarChart3,
  LayoutDashboard,
} from "lucide-react";
import type { Project } from "@/types";
import PowerBIEmbed from "@/components/shared/PowerBIEmbed";

const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  default: <BarChart3 size={40} className="text-primary/20" />,
};

const GRADIENTS = [
  "from-primary/10 to-highlight/15",
  "from-accent/20 to-primary/10",
  "from-highlight/10 to-surface",
  "from-primary/8 to-accent/15",
];

interface Labels {
  filterAll: string;
  viewReport: string;
  hideReport: string;
  fullscreen: string;
  liveReport: string;
  loading: string;
  similarCta: string;
  noProjects: string;
  industries: string[];
}

interface Props {
  projects: Project[];
  locale: string;
  labels: Labels;
}

function ProjectCard({
  project,
  locale,
  labels,
  expanded,
  onToggle,
}: {
  project: Project;
  locale: string;
  labels: Labels;
  expanded: boolean;
  onToggle: () => void;
}) {
  const gradient = GRADIENTS[project.title.charCodeAt(0) % GRADIENTS.length];
  const hasEmbed = Boolean(project.embed_url);

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-white overflow-hidden shadow-sm transition-shadow hover:shadow-md">
      {/* Cover */}
      <Link href={`/${locale}/projects/${project.slug}`} className="relative block h-48 w-full overflow-hidden group">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
            {INDUSTRY_ICONS[project.industry] ?? INDUSTRY_ICONS.default}
          </div>
        )}
        {/* Industry badge */}
        <span className="absolute right-3 top-3 rounded-full bg-white/90 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-text-main shadow-sm">
          {project.industry}
        </span>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Link href={`/${locale}/projects/${project.slug}`}>
          <h3 className="font-semibold text-text-main hover:text-primary transition-colors line-clamp-2">
            {project.title}
          </h3>
        </Link>
        <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
          {project.description}
        </p>

        {/* Tech tags */}
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-semibold text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action row */}
        <div className="mt-auto flex items-center justify-between pt-2">
          {hasEmbed ? (
            <button
              onClick={onToggle}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:bg-primary/90 transition-colors"
            >
              {expanded ? (
                <>
                  <ChevronUp size={13} />
                  {labels.hideReport}
                </>
              ) : (
                <>
                  <ChevronDown size={13} />
                  {labels.viewReport}
                </>
              )}
            </button>
          ) : (
            <Link
              href={`/${locale}/projects/${project.slug}`}
              className="flex items-center gap-1.5 rounded-lg border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <LayoutDashboard size={13} />
              {labels.viewReport}
            </Link>
          )}
          <Link
            href={`/${locale}/contact?subject=proje`}
            className="text-xs font-medium text-highlight hover:text-primary transition-colors"
          >
            {labels.similarCta}
          </Link>
        </div>
      </div>

      {/* Accordion embed */}
      {hasEmbed && expanded && (
        <div className="border-t border-border p-4">
          <PowerBIEmbed
            embedUrl={project.embed_url!}
            title={project.title}
            coverImageUrl={project.cover_image_url}
            liveReportLabel={labels.liveReport}
            fullscreenLabel={labels.fullscreen}
            loadingLabel={labels.loading}
          />
        </div>
      )}
    </div>
  );
}

export default function ProjectList({ projects, locale, labels }: Props) {
  const [activeIndustry, setActiveIndustry] = useState<string | null>(null);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  // Derive real industries from data; fall back to static list
  const availableIndustries = useMemo(() => {
    if (projects.length === 0) return labels.industries;
    const set = new Set(projects.map((p) => p.industry).filter(Boolean));
    return Array.from(set).sort();
  }, [projects, labels.industries]);

  const filtered = useMemo(
    () =>
      activeIndustry
        ? projects.filter((p) => p.industry === activeIndustry)
        : projects,
    [projects, activeIndustry]
  );

  const handleFilterClick = (industry: string | null) => {
    setActiveIndustry(industry);
    setExpandedSlug(null);
  };

  const handleToggle = (slug: string) => {
    setExpandedSlug((prev) => (prev === slug ? null : slug));
  };

  return (
    <div className="space-y-8">
      {/* Industry filter pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleFilterClick(null)}
          className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
            activeIndustry === null
              ? "bg-primary text-white"
              : "border border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {labels.filterAll}
        </button>
        {availableIndustries.map((ind) => (
          <button
            key={ind}
            onClick={() => handleFilterClick(ind)}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
              activeIndustry === ind
                ? "bg-primary text-white"
                : "border border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {ind}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          {filtered.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              locale={locale}
              labels={labels}
              expanded={expandedSlug === project.slug}
              onToggle={() => handleToggle(project.slug)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <BarChart3 size={28} className="text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-muted-foreground">{labels.noProjects}</p>
        </div>
      )}
    </div>
  );
}
