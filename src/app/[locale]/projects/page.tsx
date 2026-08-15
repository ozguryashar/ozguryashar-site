import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getAllProjects } from "@/lib/supabase/queries";
import ProjectList from "@/components/projects/ProjectList";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects_page" });
  return { title: t("title"), description: t("subtitle") };
}

async function ProjectsLoader({ locale }: { locale: string }) {
  const [projects, t] = await Promise.all([
    getAllProjects(),
    getTranslations({ locale, namespace: "projects_page" }),
  ]);

  const industries = t.raw("industries") as string[];

  return (
    <ProjectList
      projects={projects}
      locale={locale}
      labels={{
        filterAll: t("filter_all"),
        viewReport: t("view_report"),
        hideReport: t("hide_report"),
        fullscreen: t("fullscreen"),
        liveReport: t("live_report"),
        loading: t("loading"),
        similarCta: t("similar_cta"),
        noProjects: t("no_projects"),
        industries,
      }}
    />
  );
}

function ProjectsListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Pills */}
      <div className="flex gap-2 flex-wrap">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-7 w-20 animate-pulse rounded-full bg-border" />
        ))}
      </div>
      {/* Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="h-48 animate-pulse bg-surface" />
            <div className="space-y-3 p-5">
              <div className="h-3 w-16 animate-pulse rounded-full bg-border" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
              <div className="h-3 w-full animate-pulse rounded bg-border" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-border" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ProjectsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "projects_page" });

  return (
    <div className="bg-background min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-[#060E1E] via-[#0F3460] to-[#0A2647]">
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="pointer-events-none absolute right-1/4 top-0 h-48 w-48 rounded-full bg-accent/8 blur-3xl" />
        <div className="container relative mx-auto px-4 py-16 md:px-6 md:py-20">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">Portföy</p>
          <h1 className="text-3xl font-extrabold text-white md:text-5xl">{t("title")}</h1>
          <div className="mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-accent to-highlight" />
          <p className="mt-4 text-base text-white/60">{t("subtitle")}</p>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 30L1440 30L1440 10C1200 30 960 0 720 10C480 20 240 0 0 10L0 30Z" fill="#FAFAFA" />
          </svg>
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 md:px-6">
        <Suspense fallback={<ProjectsListSkeleton />}>
          <ProjectsLoader locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
