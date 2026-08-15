"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Search, Star, Eye, EyeOff } from "lucide-react";
import type { Project } from "@/types";

interface Props {
  projects: Project[];
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("tr-TR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function AdminProjectTable({ projects }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.industry.toLowerCase().includes(search.toLowerCase())
  );

  const toggleField = async (id: string, field: "is_featured" | "is_visible", current: boolean) => {
    await fetch(`/api/admin/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: !current }),
    });
    startTransition(() => router.refresh());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu projeyi silmek istediğinizden emin misiniz?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setDeletingId(null);
    startTransition(() => router.refresh());
  };

  return (
    <div>
      {/* Search */}
      <div className="border-b border-border px-6 py-4">
        <div className="relative max-w-sm">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Proje ara..."
            className="w-full rounded-lg border border-border bg-[#F0F4F8] pl-9 pr-3.5 py-2 text-sm text-text-main placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
          {search ? "Sonuç bulunamadı." : "Henüz proje yok."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#F0F4F8]/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Başlık</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Sektör</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">Tarih</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Öne Çıkan</th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Görünür</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((project) => (
                <tr key={project.id} className="hover:bg-[#F0F4F8]/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-text-main">{project.title}</p>
                    <p className="text-xs text-muted-foreground">{project.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-primary/8 px-2.5 py-0.5 text-xs font-medium text-primary">
                      {project.industry}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {formatDate(project.created_at)}
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => toggleField(project.id, "is_featured", project.is_featured)}
                      disabled={isPending}
                      title="Öne çıkan"
                      className={`rounded-lg p-1.5 transition-colors disabled:opacity-40 ${
                        project.is_featured
                          ? "text-accent hover:bg-amber-50"
                          : "text-muted-foreground hover:bg-[#F0F4F8]"
                      }`}
                    >
                      <Star size={15} fill={project.is_featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <button
                      onClick={() => toggleField(project.id, "is_visible", project.is_visible)}
                      disabled={isPending}
                      title="Görünürlük"
                      className={`rounded-lg p-1.5 transition-colors disabled:opacity-40 ${
                        project.is_visible
                          ? "text-green-600 hover:bg-green-50"
                          : "text-muted-foreground hover:bg-[#F0F4F8]"
                      }`}
                    >
                      {project.is_visible ? <Eye size={15} /> : <EyeOff size={15} />}
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-[#F0F4F8] hover:text-primary transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        disabled={deletingId === project.id}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
