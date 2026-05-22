export default function ArticleLoading() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8 h-5 w-36 animate-pulse rounded bg-surface-3" />
      <div className="rounded-2xl border border-border bg-card p-8 sm:p-10">
        <div className="mb-4 h-4 w-32 animate-pulse rounded bg-surface-3" />
        <div className="mb-2 h-8 w-full animate-pulse rounded bg-surface-3" />
        <div className="mb-5 h-8 w-3/4 animate-pulse rounded bg-surface-3" />
        <div className="mb-5 flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-7 w-32 animate-pulse rounded-full bg-surface-3" />
          ))}
        </div>
        <div className="mb-6 flex gap-5 border-y border-border py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-24 animate-pulse rounded bg-surface-3" />
          ))}
        </div>
        <div className="mb-8 space-y-2">
          <div className="h-3 w-20 animate-pulse rounded bg-surface-3" />
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-4 animate-pulse rounded bg-surface-3" style={{ width: `${85 + (i % 3) * 5}%` }} />
          ))}
        </div>
        <div className="h-24 animate-pulse rounded-xl bg-surface-2" />
      </div>
    </div>
  )
}
