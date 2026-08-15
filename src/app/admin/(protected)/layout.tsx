import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import type { Metadata } from "next";
import "../../globals.css";

export const metadata: Metadata = {
  title: { default: "Admin – ozguryashar.site", template: "%s | Admin" },
  robots: "noindex,nofollow",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/login");

  return (
    <html lang="tr">
      <body className="bg-[#F0F4F8] font-sans antialiased">
        <div className="flex min-h-screen">
          <AdminSidebar userEmail={user.email ?? ""} />
          <main className="flex-1 min-w-0 overflow-auto">
            <div className="pt-14 lg:pt-0 p-6 md:p-8">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
