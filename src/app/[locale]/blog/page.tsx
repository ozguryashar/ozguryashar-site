import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { getAllPosts } from "@/lib/supabase/queries";
import BlogList from "@/components/blog/BlogList";
import BlogListSkeleton from "./loading";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

async function PostsLoader({ locale }: { locale: string }) {
  const [posts, t] = await Promise.all([
    getAllPosts(),
    getTranslations({ locale, namespace: "blog" }),
  ]);

  return (
    <BlogList
      posts={posts}
      locale={locale}
      labels={{
        searchPlaceholder: t("search_placeholder"),
        tagAll: t("tag_all"),
        read: t("read"),
        minRead: t("min_read"),
        noPosts: t("no_posts"),
        noPostsDesc: t("no_posts_desc"),
        prev: t("prev"),
        next: t("next"),
      }}
    />
  );
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <div className="bg-background min-h-screen">
      {/* Page header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#060E1E] via-[#0F3460] to-[#0A2647]">
        <div className="pointer-events-none absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
        <div className="pointer-events-none absolute right-1/4 top-0 h-48 w-48 rounded-full bg-highlight/10 blur-3xl" />
        <div className="container relative mx-auto px-4 py-16 md:px-6 md:py-20">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-white/40">Blog</p>
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

      {/* Content */}
      <div className="container mx-auto px-4 py-12 md:px-6">
        <Suspense fallback={<BlogListSkeleton />}>
          <PostsLoader locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
