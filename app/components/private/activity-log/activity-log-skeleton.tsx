export function ActivityLogSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden backdrop-blur-sm">
      <div className="divide-y divide-border">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary animate-pulse shrink-0" />

              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-6 bg-secondary rounded-lg w-48 animate-pulse" />
                <div className="h-4 bg-secondary rounded-lg w-32 animate-pulse" />
                <div className="h-3 bg-secondary rounded-lg w-40 animate-pulse" />
              </div>
              <div className="shrink-0">
                <div className="h-4 bg-secondary rounded-lg w-24 animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
