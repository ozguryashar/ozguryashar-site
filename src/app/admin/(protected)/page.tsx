import Link from "next/link";
import { getDashboardStats, getRecentActivity } from "@/lib/supabase/admin-queries";
import { FileText, FolderKanban, MessageSquare, Plus, Clock } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

function StatCard({
  label,
  value,
  icon: Icon,
  href,
  color,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  href: string;
  color: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-5 rounded-2xl border border-border bg-white p-6 hover:border-primary transition-colors group"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color} transition-colors group-hover:opacity-90`}
      >
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-text-main">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </Link>
  );
}

function formatRelative(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} sa önce`;
  const days = Math.floor(hours / 24);
  return `${days} gün önce`;
}

export default async function AdminDashboard() {
  const [stats, activity] = await Promise.all([
    getDashboardStats(),
    getRecentActivity(),
  ]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-main">Dashboard</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">Hoş geldin, Özgür!</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/blog/new"
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
          >
            <Plus size={15} />
            Yeni Yazı
          </Link>
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-text-main hover:border-primary hover:text-primary transition-colors"
          >
            <Plus size={15} />
            Yeni Proje
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Toplam Yazı"
          value={stats.totalPosts}
          icon={FileText}
          href="/admin/blog"
          color="bg-primary"
        />
        <StatCard
          label="Toplam Proje"
          value={stats.totalProjects}
          icon={FolderKanban}
          href="/admin/projects"
          color="bg-highlight"
        />
        <StatCard
          label="Okunmamış Mesaj"
          value={stats.unreadMessages}
          icon={MessageSquare}
          href="/admin/messages"
          color="bg-accent"
        />
      </div>

      {/* Last published */}
      {stats.lastPost && (
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-5 py-4">
          <Clock size={16} className="text-muted-foreground shrink-0" />
          <p className="text-sm text-muted-foreground">
            Son yayınlanan:{" "}
            <span className="font-semibold text-text-main">{stats.lastPost.title}</span>
            {stats.lastPost.published_at && (
              <span className="ml-2">— {formatRelative(stats.lastPost.published_at)}</span>
            )}
          </p>
        </div>
      )}

      {/* Recent activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent posts */}
        <div className="rounded-2xl border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-sm font-bold text-text-main">Son Yazılar</h2>
            <Link href="/admin/blog" className="text-xs font-medium text-primary hover:underline">
              Tümü
            </Link>
          </div>
          <div className="divide-y divide-border">
            {activity.recentPosts.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">Henüz yazı yok.</p>
            ) : (
              activity.recentPosts.map((p) => (
                <div key={p.id} className="flex items-center justify-between px-6 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-text-main">{p.title}</p>
                    <p className="text-xs text-muted-foreground">{formatRelative(p.created_at)}</p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      p.status === "published"
                        ? "bg-green-50 text-green-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {p.status === "published" ? "Yayında" : "Taslak"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent messages */}
        <div className="rounded-2xl border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <h2 className="text-sm font-bold text-text-main">Son Mesajlar</h2>
            <Link href="/admin/messages" className="text-xs font-medium text-primary hover:underline">
              Tümü
            </Link>
          </div>
          <div className="divide-y divide-border">
            {activity.recentMessages.length === 0 ? (
              <p className="px-6 py-8 text-center text-sm text-muted-foreground">Henüz mesaj yok.</p>
            ) : (
              activity.recentMessages.map((m) => (
                <div key={m.id} className="flex items-center justify-between px-6 py-3.5">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 text-sm font-medium text-text-main">
                      {!m.is_read && (
                        <span className="inline-block h-2 w-2 shrink-0 rounded-full bg-primary" />
                      )}
                      {m.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <p className="ml-3 shrink-0 text-xs text-muted-foreground">
                    {formatRelative(m.created_at)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
