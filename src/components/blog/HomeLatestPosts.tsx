import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Clock, ArrowRight, LineChart } from "lucide-react";
import { getFeaturedPosts } from "@/lib/supabase/queries";
import type { Post } from "@/types";

const CARD_GRADIENTS = [
  "from-primary to-highlight",
  "from-highlight to-[#0A2647]",
  "from-[#0A2647] to-primary",
];

function PostCard({ post, readLabel, index }: {
  post: Post;
  readLabel: string;
  index: number;
}) {
  const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
  const date = post.published_at
    ? new Date(post.published_at).toLocaleDateString("tr-TR", {
        day: "numeric", month: "short", year: "numeric",
      })
    : "";

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative flex flex-col rounded-2xl border border-border bg-white overflow-hidden shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl card-shine gradient-border"
    >
      {/* Top accent */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r ${gradient}`} />

      {/* Cover */}
      <div className="relative h-44 overflow-hidden shrink-0">
        {post.cover_image_url ? (
          <>
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/6 via-highlight/8 to-accent/10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "linear-gradient(rgba(15,52,96,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(15,52,96,0.08) 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute top-3 right-3 h-1.5 w-1.5 rounded-full bg-accent pulse-glow" />
            <LineChart size={36} className="text-primary/20 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/7 px-2 py-0.5 text-[10px] font-semibold text-primary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-bold leading-snug text-text-main group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-xs leading-relaxed text-muted-foreground line-clamp-2">
            {post.excerpt}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between pt-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {date && <span>{date}</span>}
            {date && post.read_time_minutes && <span className="h-0.5 w-0.5 rounded-full bg-border" />}
            {post.read_time_minutes && (
              <>
                <Clock size={11} />
                <span>{post.read_time_minutes} dk</span>
              </>
            )}
          </div>
          <span className="flex items-center gap-1 text-xs font-bold text-highlight opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {readLabel} <ArrowRight size={11} />
          </span>
        </div>
      </div>

      {/* Bottom accent sweep */}
      <div className={`h-0.5 w-0 group-hover:w-full transition-all duration-500 bg-gradient-to-r ${gradient}`} />
    </Link>
  );
}

interface Props {
  locale: string;
}

export default async function HomeLatestPosts({ locale }: Props) {
  const [posts, t, tBlog] = await Promise.all([
    getFeaturedPosts(3),
    getTranslations({ locale, namespace: "latest_posts" }),
    getTranslations({ locale, namespace: "blog" }),
  ]);

  if (posts.length === 0) return null;

  return (
    <>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, i) => (
          <PostCard
            key={post.id}
            post={post}
            readLabel={tBlog("read")}
            index={i}
          />
        ))}
      </div>
      <div className="mt-10 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-bold text-white shadow-sm hover:bg-accent hover:text-text-main transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
        >
          {t("all")}
          <ArrowRight size={15} />

        </Link>
      </div>
    </>
  );
}
