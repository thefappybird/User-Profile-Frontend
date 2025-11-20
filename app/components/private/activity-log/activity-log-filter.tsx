import React, { useEffect, useState } from "react";
import { useLogs } from "~/context/logsProvider";

function ActivityLogfilter() {
  const { logs, setFilters } = useLogs();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedActionFilter, setSelectedActionFilter] =
    useState<string>("all");
  const actions = ["Register User", "User Login", "Update User", "Delete User"];
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const newFilters: Record<string, any> = {};
    if (selectedActionFilter !== "all") {
      newFilters.action = selectedActionFilter;
    }
    if (value) {
      newFilters.userName = value;
    }
    setFilters(newFilters);
  };

  const handleActionFilterChange = (value: string) => {
    setSelectedActionFilter(value);
    const newFilters: Record<string, any> = {};
    if (value !== "all") {
      newFilters.action = value;
    }
    if (searchQuery) {
      newFilters.search = searchQuery;
    }
    setFilters(newFilters);
  };
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex-1">
        <input
          type="text"
          placeholder="Search activities by User Name..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>
      <select
        value={selectedActionFilter}
        onChange={(e) => handleActionFilterChange(e.target.value)}
        className="px-4 py-2.5 bg-secondary border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      >
        <option value="all">All Actions</option>
        {actions.map((action) => (
          <option key={action} value={action}>
            {action}
          </option>
        ))}
      </select>
    </div>
  );
}

export default ActivityLogfilter;
