"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, MailOpen, Mail, ChevronDown, ChevronUp } from "lucide-react";
import type { ContactSubmission } from "@/types";

interface Props {
  messages: ContactSubmission[];
}

function formatDate(str: string) {
  return new Date(str).toLocaleString("tr-TR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminMessagesClient({ messages }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = filter === "unread" ? messages.filter((m) => !m.is_read) : messages;
  const unreadCount = messages.filter((m) => !m.is_read).length;

  const toggleExpand = async (msg: ContactSubmission) => {
    const newId = expandedId === msg.id ? null : msg.id;
    setExpandedId(newId);

    // Auto-mark as read when opened
    if (newId && !msg.is_read) {
      await fetch(`/api/admin/messages/${msg.id}/read`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      });
      startTransition(() => router.refresh());
    }
  };

  const handleToggleRead = async (e: React.MouseEvent, msg: ContactSubmission) => {
    e.stopPropagation();
    await fetch(`/api/admin/messages/${msg.id}/read`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_read: !msg.is_read }),
    });
    startTransition(() => router.refresh());
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!confirm("Bu mesajı silmek istediğinizden emin misiniz?")) return;
    setDeletingId(id);
    await fetch(`/api/admin/messages/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (expandedId === id) setExpandedId(null);
    startTransition(() => router.refresh());
  };

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilter("all")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            filter === "all"
              ? "bg-primary text-white"
              : "bg-white border border-border text-text-main hover:border-primary hover:text-primary"
          }`}
        >
          Tümü ({messages.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
            filter === "unread"
              ? "bg-primary text-white"
              : "bg-white border border-border text-text-main hover:border-primary hover:text-primary"
          }`}
        >
          Okunmamış ({unreadCount})
        </button>
      </div>

      {/* Messages list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-border bg-white px-6 py-16 text-center">
          <p className="text-muted-foreground text-sm">
            {filter === "unread" ? "Okunmamış mesaj yok." : "Henüz mesaj yok."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-white divide-y divide-border overflow-hidden">
          {filtered.map((msg) => (
            <div key={msg.id} className={!msg.is_read ? "bg-primary/[0.02]" : ""}>
              {/* Header row */}
              <button
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-[#F0F4F8]/50 transition-colors"
                onClick={() => toggleExpand(msg)}
              >
                {/* Unread dot */}
                <div className="shrink-0">
                  {!msg.is_read ? (
                    <span className="block h-2.5 w-2.5 rounded-full bg-primary" />
                  ) : (
                    <span className="block h-2.5 w-2.5 rounded-full bg-transparent" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <p className={`text-sm ${!msg.is_read ? "font-bold text-text-main" : "font-medium text-text-main"}`}>
                      {msg.name}
                    </p>
                    {msg.company && (
                      <span className="text-xs text-muted-foreground">· {msg.company}</span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{msg.email}</p>
                  {expandedId !== msg.id && (
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {msg.message.slice(0, 100)}
                    </p>
                  )}
                </div>

                {/* Date + actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <p className="text-xs text-muted-foreground">{formatDate(msg.created_at)}</p>
                  <button
                    onClick={(e) => handleToggleRead(e, msg)}
                    disabled={isPending}
                    title={msg.is_read ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-[#F0F4F8] hover:text-primary transition-colors disabled:opacity-40"
                  >
                    {msg.is_read ? <Mail size={14} /> : <MailOpen size={14} />}
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, msg.id)}
                    disabled={deletingId === msg.id}
                    className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-40"
                  >
                    <Trash2 size={14} />
                  </button>
                  {expandedId === msg.id ? (
                    <ChevronUp size={15} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={15} className="text-muted-foreground" />
                  )}
                </div>
              </button>

              {/* Expanded content */}
              {expandedId === msg.id && (
                <div className="border-t border-border bg-[#F0F4F8]/40 px-6 py-5">
                  <div className="mb-3 flex items-center gap-4 text-xs text-muted-foreground">
                    <span>
                      <strong>Gönderen:</strong> {msg.name}
                      {msg.company && ` (${msg.company})`}
                    </span>
                    <span>
                      <strong>E-posta:</strong>{" "}
                      <a href={`mailto:${msg.email}`} className="text-primary hover:underline">
                        {msg.email}
                      </a>
                    </span>
                  </div>
                  <p className="whitespace-pre-wrap text-sm text-text-main leading-relaxed">
                    {msg.message}
                  </p>
                  <div className="mt-4">
                    <a
                      href={`mailto:${msg.email}?subject=Re: Mesajınız`}
                      className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                    >
                      <Mail size={14} />
                      Yanıtla
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
