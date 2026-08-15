export default function AboutLoading() {
  return (
    <div className="bg-background">
      {/* Hero */}
      <section className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24">
          <div className="flex flex-col items-center gap-12 md:flex-row md:items-start md:gap-16">
            <div className="h-52 w-52 animate-pulse rounded-3xl bg-border md:h-64 md:w-64" />
            <div className="flex-1 space-y-5">
              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded-full bg-border" />
                <div className="h-9 w-56 animate-pulse rounded bg-border" />
              </div>
              <div className="space-y-2">
                <div className="h-3 w-full animate-pulse rounded bg-border" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-border" />
                <div className="h-3 w-4/5 animate-pulse rounded bg-border" />
              </div>
              <div className="flex gap-3">
                <div className="h-10 w-28 animate-pulse rounded-lg bg-border" />
                <div className="h-10 w-32 animate-pulse rounded-lg bg-border" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-surface py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10 h-8 w-56 animate-pulse rounded bg-border" />
          <div className="grid gap-5 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 animate-pulse rounded-2xl border border-border bg-white" />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
