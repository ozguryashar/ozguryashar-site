import { notFound } from "next/navigation";
import { adminGetPostById } from "@/lib/supabase/admin-queries";
import BlogEditor from "@/components/admin/BlogEditor";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await adminGetPostById(id);
  return { title: post ? `Düzenle: ${post.title}` : "Yazı Bulunamadı" };
}

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  const post = await adminGetPostById(id);

  if (!post) notFound();

  return <BlogEditor mode="edit" initialData={post} />;
}
