function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex gap-3">
        <div className="h-3 w-24 animate-pulse rounded bg-surface-3" />
        <div className="h-3 w-16 animate-pulse rounded bg-surface-3" />
      </div>
      <div className="mb-1.5 h-4 w-full animate-pulse rounded bg-surface-3" />
      <div className="mb-1.5 h-4 w-4/5 animate-pulse rounded bg-surface-3" />
      <div className="mb-3 h-3 w-32 animate-pulse rounded bg-surface-3" />
      <div className="mb-1 h-3 w-full animate-pulse rounded bg-surface-3" />
      <div className="mb-1 h-3 w-5/6 animate-pulse rounded bg-surface-3" />
      <div className="mb-4 h-3 w-3/4 animate-pulse rounded bg-surface-3" />
      <div className="mt-auto flex justify-between border-t border-border pt-3">
        <div className="h-3 w-16 animate-pulse rounded bg-surface-3" />
        <div className="h-6 w-14 animate-pulse rounded bg-surface-3" />
      </div>
    </div>
  )
}

export default function ArticlesLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex justify-between">
        <div className="space-y-2">
          <div className="h-8 w-40 animate-pulse rounded bg-surface-3" />
          <div className="h-4 w-48 animate-pulse rounded bg-surface-3" />
        </div>
        <div className="h-10 w-36 animate-pulse rounded-lg bg-surface-3" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <div className="space-y-3">
            <div className="h-10 animate-pulse rounded-lg bg-surface-2" />
            <div className="h-20 animate-pulse rounded-lg bg-surface-2" />
          </div>
        </aside>
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    </div>
  )
}
