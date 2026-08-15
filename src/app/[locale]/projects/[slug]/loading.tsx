export default function ProjectDetailLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto max-w-6xl px-4 py-10 md:px-6">
        <div className="mb-6 h-4 w-32 animate-pulse rounded bg-border" />
        {/* Embed skeleton */}
        <div className="mb-10 overflow-hidden rounded-2xl border border-border" style={{ paddingBottom: "56.25%", position: "relative" }}>
          <div className="absolute inset-0 animate-pulse bg-surface" />
        </div>
        <div className="flex gap-10">
          <div className="flex-1 space-y-4">
            <div className="h-8 w-2/3 animate-pulse rounded bg-border" />
            <div className="h-4 w-full animate-pulse rounded bg-border" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-border" />
            <div className="h-4 w-4/5 animate-pulse rounded bg-border" />
          </div>
          <aside className="hidden lg:block w-56 shrink-0 space-y-4">
            <div className="h-4 w-20 animate-pulse rounded bg-border" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-border" />
            <div className="h-4 w-28 animate-pulse rounded bg-border" />
            <div className="flex flex-wrap gap-1.5">
              {[60, 80, 50].map((w, i) => (
                <div key={i} className="h-5 animate-pulse rounded-full bg-border" style={{ width: `${w}px` }} />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
