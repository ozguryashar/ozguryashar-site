import { createClient } from "./server";
import type { Post, Project } from "@/types";

// ─── Posts ────────────────────────────────────────────────────────────────────

export async function getAllPosts(): Promise<Post[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data as Post[]) ?? [];
  } catch {
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();
    if (error) throw error;
    return data as Post;
  } catch {
    return null;
  }
}

export async function getFeaturedPosts(limit = 3): Promise<Post[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image_url, tags, published_at, read_time_minutes, status, content, created_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as Post[]) ?? [];
  } catch {
    return [];
  }
}

export async function getPostsByTag(tag: string): Promise<Post[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("status", "published")
      .contains("tags", [tag])
      .order("published_at", { ascending: false });
    if (error) throw error;
    return (data as Post[]) ?? [];
  } catch {
    return [];
  }
}

export async function getRelatedPosts(
  currentSlug: string,
  tags: string[],
  limit = 3
): Promise<Post[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, excerpt, cover_image_url, tags, published_at, read_time_minutes, status, content, created_at")
      .eq("status", "published")
      .neq("slug", currentSlug)
      .overlaps("tags", tags)
      .order("published_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as Post[]) ?? [];
  } catch {
    return [];
  }
}

export async function getAllTags(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("posts")
      .select("tags")
      .eq("status", "published");
    if (error) throw error;
    if (!data) return [];
    const tagSet = new Set<string>();
    (data as { tags: string[] }[]).forEach((row) =>
      row.tags?.forEach((t) => tagSet.add(t))
    );
    return Array.from(tagSet).sort();
  } catch {
    return [];
  }
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export async function getAllProjects(): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_visible", true)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Project[]) ?? [];
  } catch {
    return [];
  }
}

export async function getFeaturedProjects(limit = 3): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_visible", true)
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data as Project[]) ?? [];
  } catch {
    return [];
  }
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("is_visible", true)
      .single();
    if (error) throw error;
    return data as Project;
  } catch {
    return null;
  }
}

export async function getProjectsByIndustry(industry: string): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_visible", true)
      .eq("industry", industry)
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data as Project[]) ?? [];
  } catch {
    return [];
  }
}

export async function getRelatedProjects(
  currentSlug: string,
  industry: string,
  limit = 2
): Promise<Project[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("is_visible", true)
      .eq("industry", industry)
      .neq("slug", currentSlug)
      .limit(limit);
    if (error) throw error;
    return (data as Project[]) ?? [];
  } catch {
    return [];
  }
}
