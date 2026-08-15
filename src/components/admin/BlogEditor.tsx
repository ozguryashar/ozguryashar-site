"use client";

import dynamic from "next/dynamic";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import type { Post } from "@/types";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type PostForm = Omit<Post, "id" | "created_at">;

interface Props {
  initialData?: Post;
  mode: "new" | "edit";
}

function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function estimateReadTime(content: string) {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-text-main placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

const labelClass = "mb-1.5 block text-sm font-semibold text-text-main";

export default function BlogEditor({ initialData, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [seoOpen, setSeoOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [form, setForm] = useState<PostForm>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    content: initialData?.content ?? "",
    excerpt: initialData?.excerpt ?? "",
    cover_image_url: initialData?.cover_image_url ?? null,
    tags: initialData?.tags ?? [],
    status: initialData?.status ?? "draft",
    published_at: initialData?.published_at ?? null,
    read_time_minutes: initialData?.read_time_minutes ?? 1,
  });

  const [tagInput, setTagInput] = useState(form.tags.join(", "));

  const set = (key: keyof PostForm, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (val: string) => {
    set("title", val);
    if (mode === "new") set("slug", slugify(val));
  };

  const handleContentChange = (val: string | undefined) => {
    const content = val ?? "";
    set("content", content);
    set("read_time_minutes", estimateReadTime(content));
  };

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "blog-images");

        const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error);
        set("cover_image_url", json.url);
      } catch {
        setError("Görsel yüklenemedi.");
      } finally {
        setUploadingImage(false);
        e.target.value = "";
      }
    },
    []
  );

  const handleSave = async (status: "draft" | "published") => {
    setError("");
    setSaving(true);
    try {
      const payload: PostForm = {
        ...form,
        status,
        tags: tagInput
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        published_at:
          status === "published"
            ? form.published_at ?? new Date().toISOString()
            : null,
        read_time_minutes: estimateReadTime(form.content),
      };

      const url =
        mode === "new"
          ? "/api/admin/posts"
          : `/api/admin/posts/${initialData!.id}`;
      const method = mode === "new" ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error ?? "Bir hata oluştu.");
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-main">
          {mode === "new" ? "Yeni Yazı" : "Yazıyı Düzenle"}
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg border border-border bg-white px-4 py-2 text-sm font-semibold text-text-main hover:border-primary hover:text-primary disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Taslak Kaydet
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Yayınla
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left: content */}
        <div className="space-y-5">
          {/* Title */}
          <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
            <div>
              <label className={labelClass}>Başlık <span className="text-red-400">*</span></label>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Yazı başlığı"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="yazi-slug"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Özet</label>
              <textarea
                value={form.excerpt}
                onChange={(e) => set("excerpt", e.target.value)}
                rows={2}
                placeholder="Kısa açıklama (liste görünümünde gösterilir)"
                className={inputClass}
              />
            </div>
          </div>

          {/* Content */}
          <div className="rounded-2xl border border-border bg-white p-6">
            <label className={labelClass}>İçerik (Markdown)</label>
            <div data-color-mode="light" className="mt-2">
              <MDEditor
                value={form.content}
                onChange={handleContentChange}
                height={500}
                preview="live"
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Tahmini okuma süresi: {form.read_time_minutes} dk
            </p>
          </div>

          {/* SEO (collapsible) */}
          <div className="rounded-2xl border border-border bg-white">
            <button
              type="button"
              onClick={() => setSeoOpen(!seoOpen)}
              className="flex w-full items-center justify-between px-6 py-4 text-sm font-semibold text-text-main"
            >
              SEO Ayarları
              {seoOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {seoOpen && (
              <div className="border-t border-border px-6 py-5 space-y-4">
                <p className="text-xs text-muted-foreground">
                  Meta başlık ve açıklama otomatik olarak yazı başlığı ve özeti kullanılarak oluşturulur.
                  Özelleştirmek için aşağıdaki alanları doldurun.
                </p>
                <div>
                  <label className={labelClass}>Meta Başlık (opsiyonel)</label>
                  <input
                    placeholder={form.title}
                    className={inputClass}
                    disabled
                  />
                </div>
                <div>
                  <label className={labelClass}>Meta Açıklama (opsiyonel)</label>
                  <textarea
                    rows={2}
                    placeholder={form.excerpt}
                    className={inputClass}
                    disabled
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: meta */}
        <div className="space-y-5">
          {/* Cover Image */}
          <div className="rounded-2xl border border-border bg-white p-5 space-y-3">
            <h3 className="text-sm font-bold text-text-main">Kapak Görseli</h3>
            {form.cover_image_url ? (
              <div className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.cover_image_url}
                  alt="cover"
                  className="w-full rounded-lg object-cover h-36"
                />
                <button
                  onClick={() => set("cover_image_url", null)}
                  className="text-xs text-red-500 hover:underline"
                >
                  Kaldır
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-[#F0F4F8] py-8 cursor-pointer hover:border-primary transition-colors">
                {uploadingImage ? (
                  <Loader2 size={20} className="animate-spin text-primary" />
                ) : (
                  <>
                    <ImageIcon size={20} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {uploadingImage ? "Yükleniyor..." : "Görsel yükle"}
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </label>
            )}
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                veya URL gir
              </label>
              <input
                value={form.cover_image_url ?? ""}
                onChange={(e) => set("cover_image_url", e.target.value || null)}
                placeholder="https://..."
                className="w-full rounded-lg border border-border bg-white px-3 py-2 text-xs text-text-main placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="rounded-2xl border border-border bg-white p-5 space-y-3">
            <h3 className="text-sm font-bold text-text-main">Etiketler</h3>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Power BI, SQL, Python"
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground">Virgülle ayırın</p>
            {tagInput && (
              <div className="flex flex-wrap gap-1.5">
                {tagInput
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {t}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Status info */}
          <div className="rounded-2xl border border-border bg-white p-5 space-y-2">
            <h3 className="text-sm font-bold text-text-main">Durum</h3>
            <p className="text-sm">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  form.status === "published"
                    ? "bg-green-50 text-green-600"
                    : "bg-amber-50 text-amber-600"
                }`}
              >
                {form.status === "published" ? "Yayında" : "Taslak"}
              </span>
            </p>
            {form.published_at && (
              <p className="text-xs text-muted-foreground">
                Yayınlanma: {new Date(form.published_at).toLocaleDateString("tr-TR")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
