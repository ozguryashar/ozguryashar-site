export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string | null;
  tags: string[];
  status: "draft" | "published";
  published_at: string | null;
  read_time_minutes: number;
  created_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  cover_image_url: string | null;
  embed_url: string | null;
  tags: string[];
  industry: string;
  is_featured: boolean;
  is_visible: boolean;
  created_at: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  company: string | null;
  email: string;
  message: string;
  created_at: string;
  is_read: boolean;
}
