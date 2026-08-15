import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { ArrowLeft, BarChart3, Calendar, Tag } from "lucide-react";
import { getProjectBySlug, getRelatedProjects } from "@/lib/supabase/queries";
import { formatDate } from "@/lib/utils/date";
import PowerBIEmbed from "@/components/shared/PowerBIEmbed";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ozguryashar.site";
  return {
    title: project.title,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
      url: `${siteUrl}/projects/${slug}`,
      images: project.cover_image_url
        ? [{ url: project.cover_image_url, alt: project.title }]
        : [],
    },
  };
}

// ─── CTA sidebar card ─────────────────────────────────────────────────────────
function ProjectCTA({
  locale,
  title,
  btnLabel,
}: {
  locale: string;
  title: string;
  btnLabel: string;
}) {
  return (
    <div className="rounded-2xl bg-primary p-5 text-white">
      <p className="mb-3 text-sm font-semibold leading-snug">{title}</p>
      <Link
        href="/contact?subject=proje"
        className="inline-flex w-full items-center justify-center rounded-lg bg-accent px-4 py-2.5 text-xs font-bold text-text-main hover:bg-accent/90 transition-colors"
      >
        {btnLabel}
      </Link>
    </div>
  );
}

// ─── Related project mini-card ────────────────────────────────────────────────
function RelatedCard({
  project,
  locale,
}: {
  project: { slug: string; title: string; industry: string; cover_image_url: string | null };
  locale: string;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group flex items-center gap-3 rounded-xl border border-border bg-white p-3 hover:border-primary transition-colors"
    >
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
        {project.cover_image_url ? (
          <Image src={project.cover_image_url} alt={project.title} fill className="object-cover" sizes="56px" />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BarChart3 size={20} className="text-primary/20" />
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-text-main group-hover:text-primary transition-colors">
          {project.title}
        </p>
        <p className="text-[11px] text-muted-foreground">{project.industry}</p>
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProjectDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  const [project, t] = await Promise.all([
    getProjectBySlug(slug),
    getTranslations({ locale, namespace: "projects_page" }),
  ]);

  if (!project) notFound();

  const related = await getRelatedProjects(slug, project.industry, 2);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-10 md:px-6">

        {/* Back link */}
        <Link
          href="/projects"
          className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
        >
          <ArrowLeft size={14} />
          {t("detail.back")}
        </Link>

        {/* Power BI embed — full width */}
        {project.embed_url ? (
          <div className="mb-10">
            <PowerBIEmbed
              embedUrl={project.embed_url}
              title={project.title}
              coverImageUrl={project.cover_image_url}
              liveReportLabel={t("live_report")}
              fullscreenLabel={t("fullscreen")}
              loadingLabel={t("loading")}
            />
          </div>
        ) : project.cover_image_url ? (
          <div className="relative mb-10 h-72 w-full overflow-hidden rounded-2xl md:h-96">
            <Image
              src={project.cover_image_url}
              alt={project.title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 900px"
            />
          </div>
        ) : (
          <div className="mb-10 flex h-64 w-full items-center justify-center rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-highlight/10 md:h-80">
            <BarChart3 size={72} className="text-primary/20" />
          </div>
        )}

        {/* Content + sidebar */}
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-12">

          {/* ── Main content ─────────────────────────────────────────────── */}
          <div className="min-w-0 flex-1">
            {/* Tags */}
            {project.tags?.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/8 px-3 py-0.5 text-xs font-semibold text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <h1 className="mb-5 text-2xl font-bold text-text-main md:text-3xl">
              {project.title}
            </h1>

            <p className="text-base leading-relaxed text-muted-foreground">
              {project.description}
            </p>

            {/* Related projects */}
            {related.length > 0 && (
              <div className="mt-12">
                <h2 className="mb-5 text-lg font-bold text-text-main">
                  {t("detail.related")}
                </h2>
                <div className="flex flex-col gap-3">
                  {related.map((r) => (
                    <RelatedCard key={r.id} project={r} locale={locale} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ── Sticky sidebar ────────────────────────────────────────────── */}
          <aside className="lg:w-56 xl:w-64 shrink-0">
            <div className="sticky top-24 space-y-6">

              {/* Industry */}
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <Tag size={11} />
                  {t("detail.industry")}
                </p>
                <span className="inline-block rounded-full bg-surface border border-border px-3 py-1 text-sm font-semibold text-text-main">
                  {project.industry}
                </span>
              </div>

              {/* Technologies */}
              {project.tags?.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("detail.tech")}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-semibold text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              <div>
                <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  <Calendar size={11} />
                  {t("detail.date")}
                </p>
                <p className="text-sm text-text-main">
                  {formatDate(project.created_at, locale)}
                </p>
              </div>

              {/* CTA card */}
              <ProjectCTA
                locale={locale}
                title={t("detail.cta_title")}
                btnLabel={t("detail.cta_btn")}
              />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
