import { useLogs } from "~/context/logsProvider";
import { ActivityLog } from "./activity-log";
import { ActivityLogSkeleton } from "./activity-log-skeleton";

import ActivityLogfilter from "./activity-log-filter";

export function ActivityLogSection() {
  const { logs, loading, error, pagination, fetchLogs } = useLogs();

  return (
    <div className="grid gap-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Activity Log
        </h2>
        <p className="text-muted-foreground">
          Track all account activities and actions
        </p>
      </div>
      <div className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm">
        <ActivityLogfilter />

        <p className="text-sm text-muted-foreground mt-4">
          {logs.length} of {pagination.totalLogs} activities
          {pagination.totalPages > 1 &&
            ` • Page ${pagination.currentPage} of ${pagination.totalPages}`}
        </p>
      </div>
      {loading && <ActivityLogSkeleton />}
      {error && !loading && (
        <div className="bg-card border border-red-500/50 rounded-xl p-6 backdrop-blur-sm text-center">
          <p className="text-red-500">Failed to load activities: {error}</p>
          <button
            onClick={() => fetchLogs(pagination.currentPage)}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Retry
          </button>
        </div>
      )}
      {!loading && logs.length > 0 && <ActivityLog activities={logs} />}

      {!loading && logs.length === 0 && !error && (
        <div className="bg-card border border-border rounded-xl p-12 backdrop-blur-sm text-center">
          <p className="text-muted-foreground">No activities found</p>
        </div>
      )}

      {!loading && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={() => fetchLogs(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
            className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: pagination.totalPages }).map((_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => fetchLogs(pageNum)}
                  className={`flex justify-center items-center w-10 h-10 rounded-lg transition-colors ${
                    pageNum === pagination.currentPage
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/20 text-primary hover:bg-primary/30"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => fetchLogs(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
