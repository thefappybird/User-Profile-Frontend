export interface Filters {
  [key: string]: any;
}

export interface LogEntry {
  id: string;
  user_id: string;
  action: string;
  timestamp: string;
  User: {
    name: string;
  };
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalLogs: number;
}

export interface LogsResponse {
  message: string;
  logs: LogEntry[];
  pagination: Pagination;
}
