import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, BarChart3, ExternalLink } from "lucide-react";
import { getFeaturedProjects } from "@/lib/supabase/queries";
import type { Project } from "@/types";

const CARD_GRADIENTS = [
  "from-primary to-highlight",
  "from-highlight to-[#0A2647]",
  "from-[#0A2647] to-primary",
];

function FeaturedProjectCard({ project, viewLabel, index }: {
  project: Project;
  viewLabel: string;
  index: number;
}) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl card-shine gradient-border"
    >
      {/* Top accent */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${gradient}`} />

      {/* Cover */}
      <div className="relative h-44 w-full overflow-hidden shrink-0">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient} opacity-10`}>
            <BarChart3 size={48} className="text-primary/40" />
          </div>
        )}
        {/* Cover overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {/* External link icon */}
        <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-xl bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
          <ExternalLink size={14} className="text-primary" />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        {/* Industry badge */}
        <span className="mb-2.5 inline-block self-start rounded-full bg-surface border border-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
          {project.industry}
        </span>

        {/* Title */}
        <h3 className="mb-2 text-sm font-bold text-text-main group-hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug">
          {project.title}
        </h3>

        {/* Tags */}
        {project.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-primary/7 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="mt-auto flex items-center gap-1 text-xs font-bold text-highlight opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {viewLabel} <ArrowRight size={12} />
        </div>
      </div>

      {/* Bottom accent line */}
      <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${gradient}`} />
    </Link>
  );
}

function PlaceholderCard({ index, viewLabel }: { index: number; viewLabel: string }) {
  const placeholders = [
    { title: "Satış Performans Panosu", industry: "Perakende" },
    { title: "Finans KPI Raporu", industry: "Finans" },
    { title: "Müşteri Analitik Modeli", industry: "E-ticaret" },
  ];
  const p = placeholders[index % placeholders.length];
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];

  return (
    <div className="group relative flex flex-col rounded-2xl border border-border bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl card-shine">
      <div className={`absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${gradient}`} />
      <div className={`h-44 bg-gradient-to-br ${gradient} opacity-[0.12] flex items-center justify-center`}>
        <BarChart3 size={48} className="text-primary/30" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="mb-2.5 inline-block self-start rounded-full bg-surface border border-border px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">{p.industry}</span>
        <h3 className="mb-2 text-sm font-bold text-text-main group-hover:text-primary transition-colors">{p.title}</h3>
        <div className="mt-auto flex items-center gap-1 text-xs font-bold text-highlight opacity-0 group-hover:opacity-100 transition-opacity">
          {viewLabel} <ArrowRight size={12} />
        </div>
      </div>
      <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${gradient}`} />
    </div>
  );
}

export default async function HomeFeaturedProjects({ locale }: { locale: string }) {
  const [projects, t] = await Promise.all([
    getFeaturedProjects(3),
    getTranslations({ locale, namespace: "featured_projects" }),
  ]);

  const cards = projects.length > 0
    ? projects.map((p, i) => (
        <FeaturedProjectCard key={p.id} project={p} viewLabel={t("view")} index={i} />
      ))
    : [0, 1, 2].map((i) => (
        <PlaceholderCard key={i} index={i} viewLabel={t("view")} />
      ));

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{cards}</div>
      <div className="mt-10 text-center">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-accent hover:text-text-main transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          {t("all")}
          <ArrowRight size={15} />
        </Link>
      </div>
    </>
  );
}
