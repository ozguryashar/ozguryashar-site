"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, ToggleLeft, ToggleRight, Search } from "lucide-react";
import type { Post } from "@/types";

interface Props {
  posts: Post[];
}

function formatDate(str: string) {
  return new Date(str).toLocaleDateString("tr-TR", {
    day: "2-digit", month: "short", year: "numeric",
  });
}

export default function AdminBlogTable({ posts }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleToggle = async (id: string) => {
    const res = await fetch(`/api/admin/posts/${id}/toggle`, { method: "POST" });
    if (res.ok) startTransition(() => router.refresh());
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu yazıyı silmek istediğinizden emin misiniz?")) return;
    setDeletingId(id);
    const res = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) startTransition(() => router.refresh());
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
            placeholder="Yazı ara..."
            className="w-full rounded-lg border border-border bg-[#F0F4F8] pl-9 pr-3.5 py-2 text-sm text-text-main placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <p className="px-6 py-12 text-center text-sm text-muted-foreground">
          {search ? "Sonuç bulunamadı." : "Henüz yazı yok."}
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#F0F4F8]/50">
                <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Başlık
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Durum
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Tarih
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Etiketler
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((post) => (
                <tr key={post.id} className="hover:bg-[#F0F4F8]/40 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium text-text-main">{post.title}</p>
                    <p className="text-xs text-muted-foreground">{post.slug}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        post.status === "published"
                          ? "bg-green-50 text-green-600"
                          : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      {post.status === "published" ? "Yayında" : "Taslak"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-muted-foreground">
                    {formatDate(post.created_at)}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-primary/8 px-2 py-0.5 text-xs text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{post.tags.length - 3}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggle(post.id)}
                        disabled={isPending}
                        title={post.status === "published" ? "Taslağa Al" : "Yayınla"}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-[#F0F4F8] hover:text-text-main transition-colors disabled:opacity-40"
                      >
                        {post.status === "published" ? (
                          <ToggleRight size={16} className="text-green-600" />
                        ) : (
                          <ToggleLeft size={16} />
                        )}
                      </button>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-[#F0F4F8] hover:text-primary transition-colors"
                      >
                        <Pencil size={14} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        disabled={deletingId === post.id}
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
