"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, Trash2, CheckCircle2, Loader2, User } from "lucide-react";

interface Props {
  currentPhotoUrl: string | null;
}

export default function ProfilePhotoEditor({ currentPhotoUrl }: Props) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(currentPhotoUrl);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "blog-images");

      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const json = await res.json();

      if (!res.ok) throw new Error(json.error || "Yükleme başarısız");

      setPhotoUrl(json.url);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_url: photoUrl }),
      });

      if (!res.ok) throw new Error("Kaydetme başarısız");

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu");
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    setPhotoUrl(null);
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-8 max-w-lg space-y-6">
      {/* Preview */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-border shadow-md bg-surface flex items-center justify-center">
          {photoUrl ? (
            <Image
              src={photoUrl}
              alt="Profil fotoğrafı"
              fill
              className="object-cover"
            />
          ) : (
            <User size={56} className="text-muted-foreground/40" />
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          {photoUrl ? "Mevcut profil fotoğrafı" : "Henüz fotoğraf yüklenmedi"}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <button
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-surface px-5 py-3.5 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-50"
        >
          {uploading ? (
            <><Loader2 size={16} className="animate-spin" /> Yükleniyor...</>
          ) : (
            <><Upload size={16} /> Fotoğraf Yükle</>
          )}
        </button>

        {photoUrl && (
          <button
            onClick={handleRemove}
            className="flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-100 transition-colors"
          >
            <Trash2 size={15} /> Fotoğrafı Kaldır
          </button>
        )}
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={saving || uploading}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {saving ? (
          <><Loader2 size={15} className="animate-spin" /> Kaydediliyor...</>
        ) : saved ? (
          <><CheckCircle2 size={15} /> Kaydedildi!</>
        ) : (
          "Kaydet"
        )}
      </button>
    </div>
  );
}
