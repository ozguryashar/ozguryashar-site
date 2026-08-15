export default function ContactLoading() {
  return (
    <div className="bg-background min-h-screen">
      <div className="border-b border-border bg-white">
        <div className="container mx-auto px-4 py-14 md:px-6">
          <div className="h-9 w-32 animate-pulse rounded bg-border" />
          <div className="mt-2 h-4 w-64 animate-pulse rounded bg-border" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="flex flex-col gap-10 lg:flex-row lg:gap-14">
          <div className="flex-[3]">
            <div className="h-[500px] animate-pulse rounded-2xl border border-border bg-white" />
          </div>
          <div className="lg:w-72 space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl border border-border bg-white" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
