import { notFound } from "next/navigation";
import { adminGetProjectById } from "@/lib/supabase/admin-queries";
import ProjectEditor from "@/components/admin/ProjectEditor";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await adminGetProjectById(id);
  return { title: project ? `Düzenle: ${project.title}` : "Proje Bulunamadı" };
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const project = await adminGetProjectById(id);

  if (!project) notFound();

  return <ProjectEditor mode="edit" initialData={project} />;
}
