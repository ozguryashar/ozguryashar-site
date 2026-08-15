import { adminGetAllMessages } from "@/lib/supabase/admin-queries";
import AdminMessagesClient from "@/components/admin/AdminMessagesClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Mesajlar" };

export default async function AdminMessagesPage() {
  const messages = await adminGetAllMessages();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-text-main">Mesajlar</h1>
      <AdminMessagesClient messages={messages} />
    </div>
  );
}
