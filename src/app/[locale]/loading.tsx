// Homepage loading skeleton
export default function HomeLoading() {
  return (
    <div className="bg-white">
      {/* Hero skeleton */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="flex-1 space-y-5">
              <div className="h-5 w-48 animate-pulse rounded-full bg-border" />
              <div className="space-y-2">
                <div className="h-10 w-full animate-pulse rounded bg-border" />
                <div className="h-10 w-4/5 animate-pulse rounded bg-border" />
              </div>
              <div className="h-4 w-2/3 animate-pulse rounded bg-border" />
              <div className="flex gap-3">
                <div className="h-11 w-36 animate-pulse rounded-lg bg-border" />
                <div className="h-11 w-28 animate-pulse rounded-lg bg-border" />
              </div>
            </div>
            <div className="h-64 w-full max-w-md animate-pulse rounded-2xl bg-border md:h-80" />
          </div>
        </div>
      </section>

      {/* Services skeleton */}
      <section className="bg-surface py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 h-8 w-56 animate-pulse rounded bg-border" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-40 animate-pulse rounded-2xl bg-white border border-border" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
