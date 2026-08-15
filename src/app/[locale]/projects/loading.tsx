export default function ProjectsLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-14 md:px-6">
          <div className="h-9 w-40 animate-pulse rounded bg-border" />
          <div className="mt-2 h-4 w-72 animate-pulse rounded bg-border" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 md:px-6 space-y-8">
        <div className="flex gap-2 flex-wrap">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-7 w-20 animate-pulse rounded-full bg-border" />
          ))}
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="h-48 animate-pulse bg-surface" />
              <div className="space-y-3 p-5">
                <div className="h-3 w-16 animate-pulse rounded-full bg-border" />
                <div className="h-4 w-3/4 animate-pulse rounded bg-border" />
                <div className="h-3 w-full animate-pulse rounded bg-border" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-border" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
