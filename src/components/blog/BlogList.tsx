"use client";

import { useState, useMemo } from "react";
import { Search, BookOpen } from "lucide-react";
import type { Post } from "@/types";
import BlogCard from "./BlogCard";

const POSTS_PER_PAGE = 6;

const STATIC_TAGS = [
  "Power BI", "DAX", "SQL", "Python", "Veri Stratejisi", "ETL",
];

interface Props {
  posts: Post[];
  locale: string;
  labels: {
    searchPlaceholder: string;
    tagAll: string;
    read: string;
    minRead: string;
    noPosts: string;
    noPostsDesc: string;
    prev: string;
    next: string;
  };
}

export default function BlogList({ posts, locale, labels }: Props) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Derive available tags from real posts, fall back to static list
  const availableTags = useMemo(() => {
    if (posts.length === 0) return STATIC_TAGS;
    const set = new Set<string>();
    posts.forEach((p) => p.tags?.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [posts]);

  const filtered = useMemo(() => {
    let result = posts;
    if (activeTag) {
      result = result.filter((p) => p.tags?.includes(activeTag));
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [posts, activeTag, query]);

  const totalPages = Math.ceil(filtered.length / POSTS_PER_PAGE);
  const paginated = filtered.slice(
    (page - 1) * POSTS_PER_PAGE,
    page * POSTS_PER_PAGE
  );

  const handleTagClick = (tag: string | null) => {
    setActiveTag(tag);
    setPage(1);
  };

  const handleSearch = (value: string) => {
    setQuery(value);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={labels.searchPlaceholder}
          className="w-full rounded-lg border border-border bg-white py-2.5 pl-10 pr-4 text-sm text-text-main placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
        />
      </div>

      {/* Tag pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleTagClick(null)}
          className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
            activeTag === null
              ? "bg-primary text-white"
              : "border border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"
          }`}
        >
          {labels.tagAll}
        </button>
        {availableTags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-colors ${
              activeTag === tag
                ? "bg-primary text-white"
                : "border border-border bg-white text-muted-foreground hover:border-primary hover:text-primary"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      {paginated.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2">
            {paginated.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                locale={locale}
                readLabel={labels.read}
                minReadLabel={labels.minRead}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {labels.prev}
              </button>
              <span className="text-sm text-muted-foreground">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {labels.next}
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center gap-4 py-20 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface">
            <BookOpen size={28} className="text-muted-foreground" />
          </div>
          <p className="text-base font-semibold text-text-main">{labels.noPosts}</p>
          <p className="text-sm text-muted-foreground">{labels.noPostsDesc}</p>
        </div>
      )}
    </div>
  );
}
