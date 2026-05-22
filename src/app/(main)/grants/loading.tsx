// Skeleton shown while the server component fetches data

function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border border-border bg-card p-5">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="h-3 w-28 animate-pulse rounded bg-surface-3" />
          <div className="h-4 w-16 animate-pulse rounded bg-surface-3" />
        </div>
        <div className="size-8 animate-pulse rounded-md bg-surface-3" />
      </div>
      <div className="mb-1 h-4 w-full animate-pulse rounded bg-surface-3" />
      <div className="mb-3 h-4 w-3/4 animate-pulse rounded bg-surface-3" />
      <div className="mb-4 h-7 w-24 animate-pulse rounded bg-surface-3" />
      <div className="mb-4 space-y-1.5">
        <div className="h-3 w-full animate-pulse rounded bg-surface-3" />
        <div className="h-3 w-5/6 animate-pulse rounded bg-surface-3" />
      </div>
      <div className="mt-auto flex gap-1.5 border-t border-border pt-3">
        <div className="h-5 w-20 animate-pulse rounded-full bg-surface-3" />
      </div>
    </div>
  )
}

export default function GrantsLoading() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <div className="h-8 w-48 animate-pulse rounded bg-surface-3" />
        <div className="mt-2 h-4 w-36 animate-pulse rounded bg-surface-3" />
      </div>
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <aside>
          <div className="space-y-4">
            <div className="h-10 animate-pulse rounded-lg bg-surface-2" />
            <div className="h-24 animate-pulse rounded-lg bg-surface-2" />
            <div className="h-16 animate-pulse rounded-lg bg-surface-2" />
          </div>
        </aside>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
