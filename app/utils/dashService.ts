import type { Filters, LogsResponse } from "./types/dash";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const dashService = {
  async getLogs(filter: Filters = {}): Promise<LogsResponse | null> {
    try {
      // Optional: append filters as query params
      const query = new URLSearchParams(filter).toString();
      const response = await fetch(`${API_BASE_URL}/auth/logs?${query}`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to fetch logs");
      return response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
