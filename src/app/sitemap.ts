import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ozguryashar.site";
const LOCALES = ["tr", "en"] as const;

async function getPublishedSlugs() {
  try {
    const supabase = await createClient();
    const [postsRes, projectsRes] = await Promise.all([
      supabase
        .from("posts")
        .select("slug, published_at")
        .eq("status", "published")
        .order("published_at", { ascending: false }),
      supabase
        .from("projects")
        .select("slug, created_at")
        .eq("is_visible", true)
        .order("created_at", { ascending: false }),
    ]);
    return {
      posts: postsRes.data ?? [],
      projects: projectsRes.data ?? [],
    };
  } catch {
    return { posts: [], projects: [] };
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { posts, projects } = await getPublishedSlugs();
  const now = new Date().toISOString();

  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  const staticPages = ["", "/blog", "/projects", "/about", "/contact"];
  for (const locale of LOCALES) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${page}`,
        lastModified: now,
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}${page}`])
          ),
        },
      });
    }
  }

  // Blog posts
  for (const post of posts) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: post.published_at ?? now,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}/blog/${post.slug}`])
          ),
        },
      });
    }
  }

  // Projects
  for (const project of projects) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}/projects/${project.slug}`,
        lastModified: project.created_at ?? now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            LOCALES.map((l) => [l, `${SITE_URL}/${l}/projects/${project.slug}`])
          ),
        },
      });
    }
  }

  return entries;
}
