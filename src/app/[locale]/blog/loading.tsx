// Used both as Next.js route loading.tsx and as Suspense fallback in blog/page.tsx
export default function BlogListSkeleton() {
  return (
    <div className="space-y-8">
      {/* Search skeleton */}
      <div className="h-10 w-full animate-pulse rounded-lg bg-border" />

      {/* Tag pills skeleton */}
      <div className="flex gap-2">
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={i}
            className="h-7 animate-pulse rounded-full bg-border"
            style={{ width: `${50 + (i % 3) * 20}px` }}
          />
        ))}
      </div>

      {/* Card grid skeleton */}
      <div className="grid gap-6 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="h-48 animate-pulse bg-surface" />
            <div className="space-y-3 p-5">
              <div className="flex gap-2">
                <div className="h-5 w-16 animate-pulse rounded-full bg-border" />
                <div className="h-5 w-12 animate-pulse rounded-full bg-border" />
              </div>
              <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
              <div className="h-3 w-full animate-pulse rounded bg-border" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-border" />
              <div className="h-3 w-2/3 animate-pulse rounded bg-border" />
              <div className="flex justify-between pt-2">
                <div className="h-3 w-24 animate-pulse rounded bg-border" />
                <div className="h-3 w-12 animate-pulse rounded bg-border" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
