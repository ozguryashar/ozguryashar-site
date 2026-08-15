import ProjectEditor from "@/components/admin/ProjectEditor";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Yeni Proje" };

export default function NewProjectPage() {
  return <ProjectEditor mode="new" />;
}
