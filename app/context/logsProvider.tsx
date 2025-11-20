import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { dashService } from "~/utils/dashService";
import type { Filters, LogEntry, Pagination } from "~/utils/types/dash";

interface LogsContextType {
  logs: LogEntry[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  filters: Record<string, any>;
  setFilters: (filters: Record<string, any>) => void;
  fetchLogs: (page?: number) => Promise<void>;
}

const LogsContext = createContext<LogsContextType | undefined>(undefined);

export function LogsProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    pageSize: 5,
    totalLogs: 0,
  });
  const [filters, setFilters] = useState<Filters>({});

  const fetchLogs = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = { ...filters, page, limit: pagination.pageSize };
      const res = await dashService.getLogs(params);

      if (res) {
        setLogs(res.logs || []);
        setPagination({
          currentPage: res.pagination?.currentPage || 1,
          totalPages: res.pagination?.totalPages || 1,
          pageSize: res.pagination?.pageSize || 5,
          totalLogs: res.pagination?.totalLogs || 0,
        });
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs whenever filters change
  useEffect(() => {
    fetchLogs(1);
  }, [filters]);

  return (
    <LogsContext.Provider
      value={{
        logs,
        loading,
        error,
        pagination,
        filters,
        setFilters,
        fetchLogs,
      }}
    >
      {children}
    </LogsContext.Provider>
  );
}
export function useLogs() {
  const context = useContext(LogsContext);
  if (!context) throw new Error("useLogs must be used within a LogsProvider");
  return context;
}
