import Image from "next/image";
import Link from "next/link";
import { Clock, BarChart3 } from "lucide-react";
import type { Post } from "@/types";
import { formatDate } from "@/lib/utils/date";

interface Props {
  post: Post;
  locale: string;
  readLabel: string;
  minReadLabel: string;
}

const GRADIENT_FALLBACKS = [
  "from-primary/10 to-highlight/15",
  "from-accent/20 to-primary/10",
  "from-highlight/10 to-surface",
];

export default function BlogCard({ post, locale, readLabel, minReadLabel }: Props) {
  const gradient = GRADIENT_FALLBACKS[
    post.title.charCodeAt(0) % GRADIENT_FALLBACKS.length
  ];

  return (
    <article className="group flex flex-col rounded-2xl border border-border bg-white overflow-hidden shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
      {/* Cover */}
      <Link href={`/${locale}/blog/${post.slug}`} tabIndex={-1} aria-hidden>
        <div className="relative h-48 w-full overflow-hidden">
          {post.cover_image_url ? (
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div
              className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}
            >
              <BarChart3 size={40} className="text-primary/20" />
            </div>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/8 px-2 py-0.5 text-[11px] font-semibold text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <Link href={`/${locale}/blog/${post.slug}`}>
          <h2 className="line-clamp-2 text-sm font-semibold leading-snug text-text-main group-hover:text-primary transition-colors">
            {post.title}
          </h2>
        </Link>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="line-clamp-3 text-xs leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}

        {/* Footer row */}
        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{formatDate(post.published_at, locale)}</span>
            <span className="flex items-center gap-1">
              <Clock size={11} />
              {post.read_time_minutes} {minReadLabel}
            </span>
          </div>
          <Link
            href={`/${locale}/blog/${post.slug}`}
            className="text-xs font-semibold text-highlight hover:text-primary transition-colors"
          >
            {readLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
