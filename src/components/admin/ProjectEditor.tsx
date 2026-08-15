"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Image as ImageIcon } from "lucide-react";
import type { Project } from "@/types";

type ProjectForm = Omit<Project, "id" | "created_at">;

interface Props {
  initialData?: Project;
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

const inputClass =
  "w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm text-text-main placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors";

const labelClass = "mb-1.5 block text-sm font-semibold text-text-main";

const INDUSTRIES = [
  "Finans", "Perakende", "Üretim", "Lojistik", "Sağlık",
  "Teknoloji", "İnsan Kaynakları", "Pazarlama", "Eğitim", "Diğer"
];

export default function ProjectEditor({ initialData, mode }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewEmbed, setPreviewEmbed] = useState(false);

  const [form, setForm] = useState<ProjectForm>({
    title: initialData?.title ?? "",
    slug: initialData?.slug ?? "",
    description: initialData?.description ?? "",
    cover_image_url: initialData?.cover_image_url ?? null,
    embed_url: initialData?.embed_url ?? null,
    tags: initialData?.tags ?? [],
    industry: initialData?.industry ?? "",
    is_featured: initialData?.is_featured ?? false,
    is_visible: initialData?.is_visible ?? true,
  });

  const [tagInput, setTagInput] = useState(form.tags.join(", "));

  const set = (key: keyof ProjectForm, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleTitleChange = (val: string) => {
    set("title", val);
    if (mode === "new") set("slug", slugify(val));
  };

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("bucket", "project-images");

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

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const payload: ProjectForm = {
        ...form,
        tags: tagInput.split(",").map((t) => t.trim()).filter(Boolean),
      };

      const url =
        mode === "new"
          ? "/api/admin/projects"
          : `/api/admin/projects/${initialData!.id}`;
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

      router.push("/admin/projects");
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
          {mode === "new" ? "Yeni Proje" : "Projeyi Düzenle"}
        </h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-white hover:bg-primary/90 disabled:opacity-60 transition-colors"
        >
          {saving && <Loader2 size={14} className="animate-spin" />}
          Kaydet
        </button>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Left */}
        <div className="space-y-5">
          {/* Basic info */}
          <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
            <div>
              <label className={labelClass}>Başlık <span className="text-red-400">*</span></label>
              <input
                value={form.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Proje başlığı"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Slug</label>
              <input
                value={form.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="proje-slug"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Açıklama <span className="text-red-400">*</span></label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={4}
                placeholder="Projeyi kısaca açıklayın..."
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Sektör</label>
              <select
                value={form.industry}
                onChange={(e) => set("industry", e.target.value)}
                className={`${inputClass} cursor-pointer`}
              >
                <option value="">Seçin...</option>
                {INDUSTRIES.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Power BI Embed */}
          <div className="rounded-2xl border border-border bg-white p-6 space-y-4">
            <h3 className="text-sm font-bold text-text-main">Power BI Embed URL</h3>
            <input
              value={form.embed_url ?? ""}
              onChange={(e) => set("embed_url", e.target.value || null)}
              placeholder="https://app.powerbi.com/reportEmbed?..."
              className={inputClass}
            />
            {form.embed_url && (
              <div>
                <button
                  type="button"
                  onClick={() => setPreviewEmbed(!previewEmbed)}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  {previewEmbed ? "Önizlemeyi Kapat" : "Önizle"}
                </button>
                {previewEmbed && (
                  <div className="mt-3 overflow-hidden rounded-xl border border-border" style={{ paddingBottom: "56.25%", position: "relative" }}>
                    <iframe
                      src={form.embed_url}
                      className="absolute inset-0 h-full w-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right */}
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
                    <span className="text-xs text-muted-foreground">Görsel yükle</span>
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
              <label className="mb-1 block text-xs font-medium text-muted-foreground">veya URL gir</label>
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
            <h3 className="text-sm font-bold text-text-main">Teknolojiler / Etiketler</h3>
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Power BI, DAX, SQL"
              className={inputClass}
            />
            <p className="text-xs text-muted-foreground">Virgülle ayırın</p>
            {tagInput && (
              <div className="flex flex-wrap gap-1.5">
                {tagInput.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                  <span key={t} className="rounded-full bg-primary/8 px-2.5 py-1 text-xs font-medium text-primary">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="rounded-2xl border border-border bg-white p-5 space-y-4">
            <h3 className="text-sm font-bold text-text-main">Ayarlar</h3>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-main">Görünür</span>
              <button
                type="button"
                onClick={() => set("is_visible", !form.is_visible)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.is_visible ? "bg-primary" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.is_visible ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-sm text-text-main">Öne Çıkan</span>
              <button
                type="button"
                onClick={() => set("is_featured", !form.is_featured)}
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.is_featured ? "bg-accent" : "bg-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    form.is_featured ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
