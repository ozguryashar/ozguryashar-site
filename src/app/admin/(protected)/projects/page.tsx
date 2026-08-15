import Link from "next/link";
import { adminGetAllProjects } from "@/lib/supabase/admin-queries";
import AdminProjectTable from "@/components/admin/AdminProjectTable";
import { Plus } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projeler" };

export default async function AdminProjectsPage() {
  const projects = await adminGetAllProjects();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-main">Projeler</h1>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          <Plus size={15} />
          Yeni Proje
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-white">
        <AdminProjectTable projects={projects} />
      </div>
    </div>
  );
}
