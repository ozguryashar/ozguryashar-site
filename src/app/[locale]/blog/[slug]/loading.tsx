export default function BlogPostSkeleton() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-12 md:px-6">
        {/* Back link */}
        <div className="mb-8 h-4 w-28 animate-pulse rounded bg-border" />

        <div className="flex gap-10">
          {/* Main content */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* Tags */}
            <div className="flex gap-2">
              <div className="h-6 w-20 animate-pulse rounded-full bg-border" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-border" />
            </div>
            {/* Title */}
            <div className="space-y-2">
              <div className="h-8 w-full animate-pulse rounded bg-border" />
              <div className="h-8 w-3/4 animate-pulse rounded bg-border" />
            </div>
            {/* Author row */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-border" />
              <div className="space-y-1">
                <div className="h-3 w-24 animate-pulse rounded bg-border" />
                <div className="h-3 w-32 animate-pulse rounded bg-border" />
              </div>
            </div>
            {/* Cover image */}
            <div className="h-72 w-full animate-pulse rounded-2xl bg-surface" />
            {/* Content lines */}
            <div className="space-y-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded bg-border"
                  style={{
                    height: "14px",
                    width: `${70 + (i % 4) * 8}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0 space-y-6">
            <div className="h-4 w-28 animate-pulse rounded bg-border" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-3 animate-pulse rounded bg-border"
                  style={{ width: `${60 + (i % 3) * 15}%` }}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
