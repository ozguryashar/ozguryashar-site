import BlogEditor from "@/components/admin/BlogEditor";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Yeni Yazı" };

export default function NewBlogPage() {
  return <BlogEditor mode="new" />;
}
