"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/blog", label: "Blog Yazıları", icon: FileText, exact: false },
  { href: "/admin/projects", label: "Projeler", icon: FolderKanban, exact: false },
  { href: "/admin/messages", label: "Mesajlar", icon: MessageSquare, exact: false },
];

interface Props {
  userEmail: string;
}

export default function AdminSidebar({ userEmail }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 border-b border-white/10 px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 text-sm font-bold text-white">
          ÖY
        </div>
        <div>
          <p className="text-sm font-bold text-white">Admin Panel</p>
          <p className="text-xs text-white/50 truncate max-w-[120px]">{userEmail}</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map(({ href, label, icon: Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? "bg-white/15 text-white"
                : "text-white/60 hover:bg-white/8 hover:text-white"
            }`}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Bottom */}
      <div className="border-t border-white/10 px-3 py-4 space-y-1">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-colors"
        >
          <ExternalLink size={16} />
          Siteyi Görüntüle
        </a>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-colors"
        >
          <LogOut size={16} />
          Çıkış Yap
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col bg-[#0F3460] min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center gap-3 bg-[#0F3460] px-4 py-3 lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
        >
          <Menu size={20} />
        </button>
        <span className="text-sm font-bold text-white">Admin Panel</span>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-[#0F3460] lg:hidden">
            <div className="absolute right-3 top-3">
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <SidebarContent />
          </aside>
        </>
      )}

    </>
  );
}
