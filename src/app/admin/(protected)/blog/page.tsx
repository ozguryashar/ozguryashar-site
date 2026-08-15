import Link from "next/link";
import { adminGetAllPosts } from "@/lib/supabase/admin-queries";
import AdminBlogTable from "@/components/admin/AdminBlogTable";
import { Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Blog Yazıları" };

export default async function AdminBlogPage() {
  const posts = await adminGetAllPosts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-main">Blog Yazıları</h1>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          <Plus size={15} />
          Yeni Yazı
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-white">
        <AdminBlogTable posts={posts} />
      </div>
    </div>
  );
}
