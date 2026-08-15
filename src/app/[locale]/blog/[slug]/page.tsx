import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { Clock, ArrowLeft, BarChart3 } from "lucide-react";
import { getPostBySlug, getRelatedPosts } from "@/lib/supabase/queries";
import { formatDate, processContent } from "@/lib/utils/date";
import TableOfContents from "@/components/blog/TableOfContents";
import ShareButtons from "@/components/blog/ShareButtons";
import BlogCard from "@/components/blog/BlogCard";
import JsonLd, { blogPostingSchema } from "@/components/shared/JsonLd";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ozguryashar.site";
  const url = `${siteUrl}/${locale}/blog/${slug}`;

  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      authors: ["Özgür Yaşar"],
      images: post.cover_image_url
        ? [{ url: post.cover_image_url, alt: post.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

// ─── Author Card ──────────────────────────────────────────────────────────────
function LinkedInIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function AuthorCard({ bio, linkedinLabel }: { bio: string; linkedinLabel: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-border bg-surface p-6">
      {/* Avatar placeholder */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary select-none">
        ÖY
      </div>
      <div className="space-y-1.5">
        <p className="font-semibold text-text-main">Özgür Yaşar</p>
        <p className="text-sm text-muted-foreground">{bio}</p>
        <a
          href="https://linkedin.com/in/ozguryasar1"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-highlight hover:text-primary transition-colors"
        >
          <LinkedInIcon size={12} />
          {linkedinLabel}
        </a>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;

  const [post, t] = await Promise.all([
    getPostBySlug(slug),
    getTranslations({ locale, namespace: "blog" }),
  ]);

  if (!post) notFound();

  const relatedPosts = await getRelatedPosts(slug, post.tags ?? [], 3);
  const { processedHtml, headings } = processContent(post.content ?? "");

  const shareLabels = {
    shareTitle: t("share_title"),
    shareCopy: t("share_copy"),
    shareCopied: t("share_copied"),
    shareLinkedin: t("share_linkedin"),
  };

  return (
    <>
      <JsonLd data={blogPostingSchema({ title: post.title, slug: post.slug, excerpt: post.excerpt, coverImageUrl: post.cover_image_url, publishedAt: post.published_at, locale })} />

      <div className="bg-background min-h-screen">
        <div className="container mx-auto max-w-6xl px-4 py-10 md:px-6">

          {/* Back link */}
          <Link
            href={`/${locale}/blog`}
            className="mb-8 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft size={14} />
            {t("back")}
          </Link>

          <div className="flex gap-12 lg:gap-16">
            {/* ── Main content ─────────────────────────────────────────────── */}
            <article className="min-w-0 flex-1">

              {/* Tags */}
              {post.tags?.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-primary/8 px-3 py-0.5 text-xs font-semibold text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <h1 className="mb-5 text-2xl font-bold leading-tight text-text-main md:text-4xl">
                {post.title}
              </h1>

              {/* Author row */}
              <div className="mb-7 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary select-none">
                  ÖY
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-main">Özgür Yaşar</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{formatDate(post.published_at, locale)}</span>
                    <span>·</span>
                    <Clock size={11} />
                    <span>
                      {post.read_time_minutes} {t("min_read")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Cover image */}
              <div className="relative mb-10 h-72 w-full overflow-hidden rounded-2xl md:h-96">
                {post.cover_image_url ? (
                  <Image
                    src={post.cover_image_url}
                    alt={post.title}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 800px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-highlight/10">
                    <BarChart3 size={64} className="text-primary/20" />
                  </div>
                )}
              </div>

              {/* Prose content */}
              <div
                className="prose prose-slate max-w-none
                  prose-headings:text-primary prose-headings:font-bold
                  prose-a:text-highlight prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-l-accent prose-blockquote:text-muted-foreground
                  prose-code:text-primary prose-code:bg-surface prose-code:rounded prose-code:px-1 prose-code:py-0.5 prose-code:text-[0.85em]
                  prose-pre:bg-[#1A1A2E] prose-pre:text-[#F0F4F8]
                  prose-img:rounded-xl prose-img:mx-auto
                  prose-strong:text-text-main
                  prose-li:text-text-main
                "
                dangerouslySetInnerHTML={{ __html: processedHtml }}
              />

              {/* Author card */}
              <div className="mt-14 border-t border-border pt-10">
                <AuthorCard bio={t("author_bio")} linkedinLabel={t("share_linkedin")} />
              </div>

              {/* Related posts */}
              {relatedPosts.length > 0 && (
                <div className="mt-12">
                  <h2 className="mb-6 text-xl font-bold text-text-main">
                    {t("related_title")}
                  </h2>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {relatedPosts.map((related) => (
                      <BlogCard
                        key={related.id}
                        post={related}
                        locale={locale}
                        readLabel={t("read")}
                        minReadLabel={t("min_read")}
                      />
                    ))}
                  </div>
                </div>
              )}
            </article>

            {/* ── Sticky sidebar (desktop) ──────────────────────────────────── */}
            <aside className="hidden lg:block w-56 xl:w-64 shrink-0">
              <div className="sticky top-24 space-y-8">
                <TableOfContents
                  headings={headings}
                  title={t("toc_title")}
                />
                <div className="border-t border-border pt-6">
                  <ShareButtons title={post.title} labels={shareLabels} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
