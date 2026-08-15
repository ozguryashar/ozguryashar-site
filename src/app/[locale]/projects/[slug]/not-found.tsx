import Link from "next/link";
import { BarChart3 } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface">
        <BarChart3 size={36} className="text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-text-main">Proje bulunamadı</h1>
        <p className="text-sm text-muted-foreground">
          Aradığınız proje mevcut değil veya kaldırılmış olabilir.
        </p>
      </div>
      <Link
        href="/tr/projects"
        className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
      >
        ← Projelere Dön
      </Link>
    </div>
  );
}
