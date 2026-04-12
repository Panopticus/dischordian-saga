// Card grid skeleton - for CardBrowserPage, DemonPackPage
export function CardGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="aspect-[3/4] rounded-xl bg-white/5 animate-pulse" />
      ))}
    </div>
  );
}

// Leaderboard skeleton - for LeaderboardPage
export function LeaderboardSkeleton({ rows = 10 }: { rows?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 animate-pulse">
          <div className="w-8 h-8 rounded-full bg-white/10" />
          <div className="flex-1 h-4 rounded bg-white/10" />
          <div className="w-16 h-4 rounded bg-white/10" />
        </div>
      ))}
    </div>
  );
}

// Generic page skeleton with header
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-black p-4 space-y-4">
      <div className="h-8 w-48 rounded bg-white/5 animate-pulse" />
      <div className="h-4 w-96 rounded bg-white/5 animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse" />
        ))}
      </div>
    </div>
  );
}
