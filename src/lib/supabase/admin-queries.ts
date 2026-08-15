import { createClient } from "@/lib/supabase/server";
import type { Post, Project, ContactSubmission } from "@/types";

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────
export async function getDashboardStats() {
  const supabase = await createClient();

  const [postsRes, projectsRes, unreadRes, lastPostRes] = await Promise.all([
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .eq("is_read", false),
    supabase
      .from("posts")
      .select("title, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(1)
      .single(),
  ]);

  return {
    totalPosts: postsRes.count ?? 0,
    totalProjects: projectsRes.count ?? 0,
    unreadMessages: unreadRes.count ?? 0,
    lastPost: lastPostRes.data ?? null,
  };
}

// ─── RECENT ACTIVITY ─────────────────────────────────────────────────────────
export async function getRecentActivity() {
  const supabase = await createClient();

  const [posts, messages] = await Promise.all([
    supabase
      .from("posts")
      .select("id, title, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("contact_submissions")
      .select("id, name, email, created_at, is_read")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    recentPosts: posts.data ?? [],
    recentMessages: messages.data ?? [],
  };
}

// ─── POSTS ────────────────────────────────────────────────────────────────────
export async function adminGetAllPosts(): Promise<Post[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error(error); return []; }
  return data as Post[];
}

export async function adminGetPostById(id: string): Promise<Post | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) { console.error(error); return null; }
  return data as Post;
}

export async function adminCreatePost(post: Omit<Post, "id" | "created_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert(post)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdatePost(id: string, post: Partial<Omit<Post, "id" | "created_at">>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .update(post)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeletePost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw error;
}

export async function adminTogglePostStatus(id: string, currentStatus: string) {
  const newStatus = currentStatus === "published" ? "draft" : "published";
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({
      status: newStatus,
      published_at: newStatus === "published" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw error;
  return newStatus;
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────
export async function adminGetAllProjects(): Promise<Project[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error(error); return []; }
  return data as Project[];
}

export async function adminGetProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) { console.error(error); return null; }
  return data as Project;
}

export async function adminCreateProject(project: Omit<Project, "id" | "created_at">) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminUpdateProject(id: string, project: Partial<Omit<Project, "id" | "created_at">>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update(project)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function adminDeleteProject(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

// ─── MESSAGES ────────────────────────────────────────────────────────────────
export async function adminGetAllMessages(): Promise<ContactSubmission[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) { console.error(error); return []; }
  return data as ContactSubmission[];
}

export async function adminMarkMessageRead(id: string, isRead: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .update({ is_read: isRead })
    .eq("id", id);
  if (error) throw error;
}

export async function adminDeleteMessage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_submissions")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
