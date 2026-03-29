"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { MOCK_AGENT_LOGS, API_ROUTES } from "@/lib/mock-data";
import { AgentLog, AgentName } from "@/types";
import { Activity, RefreshCw } from "lucide-react";
import { clsx } from "clsx";
import Pagination from "@/components/shared/Pagination";
import ErrorState from "@/components/shared/ErrorState";

const AGENT_COLORS: Record<AgentName, string> = {
  research:      "bg-blue-900/50 text-blue-400 border border-blue-700",
  business_case: "bg-purple-900/50 text-purple-400 border border-purple-700",
  site_builder:  "bg-yellow-900/50 text-yellow-400 border border-yellow-700",
  link_builder:  "bg-orange-900/50 text-orange-400 border border-orange-700",
  ads_manager:   "bg-pink-900/50 text-pink-400 border border-pink-700",
  controller:    "bg-cyan-900/50 text-cyan-400 border border-cyan-700",
};

const AGENT_LABELS: Record<AgentName, string> = {
  research:      "Research",
  business_case: "Business Case",
  site_builder:  "Site Builder",
  link_builder:  "Link Builder",
  ads_manager:   "Ads Manager",
  controller:    "Controller",
};

const PER_PAGE = 10;

export default function ActivityPage() {
  const [filter, setFilter] = useState<AgentName | "all">("all");
  const [page, setPage] = useState(1);

  const { data: logs, isLoading, isError, refetch } = useQuery({
    queryKey: ["agent-logs"],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.agentLogs);
        return extractData<AgentLog[]>(res);
      } catch {
        return MOCK_AGENT_LOGS;
      }
    },
    refetchInterval: 10000,
  });

  const displayLogs = logs || MOCK_AGENT_LOGS;
  const filtered = displayLogs.filter(
    (log) => filter === "all" || log.agent_name === filter
  );

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  function handleFilterChange(f: AgentName | "all") {
    setFilter(f);
    setPage(1);
  }

  function formatTime(timestamp: string) {
    return new Date(timestamp).toLocaleString("de-DE", {
      day: "2-digit", month: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Activity Log</h1>
          <p className="text-gray-400 mt-1">
            {filtered.length} entries — live feed of all agent actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-pulse" />
            Auto-refresh 10s
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => handleFilterChange("all")}
          className={clsx(
            "px-3 py-2 rounded-lg text-xs font-medium transition-colors",
            filter === "all" ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          )}
        >
          All Agents ({displayLogs.length})
        </button>
        {(Object.keys(AGENT_LABELS) as AgentName[]).map((agent) => (
          <button
            key={agent}
            onClick={() => handleFilterChange(agent)}
            className={clsx(
              "px-3 py-2 rounded-lg text-xs font-medium transition-colors",
              filter === agent ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            {AGENT_LABELS[agent]} ({displayLogs.filter(l => l.agent_name === agent).length})
          </button>
        ))}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
          <Activity size={16} className="text-blue-400" />
          <span className="text-white font-medium">Live Agent Feed</span>
          <span className="ml-auto text-gray-500 text-sm">Page {page} of {totalPages || 1}</span>
        </div>

        {isError ? (
          <ErrorState onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="divide-y divide-gray-800">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start gap-4 px-6 py-4">
                <div className="skeleton h-6 w-6 rounded-full" />
                <div className="flex-1">
                  <div className="skeleton h-4 w-48 mb-2" />
                  <div className="skeleton h-3 w-64" />
                </div>
                <div className="skeleton h-4 w-20" />
              </div>
            ))}
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center py-12 text-gray-500">No logs found.</div>
        ) : (
          <>
            <div className="divide-y divide-gray-800">
              {paginated.map((log) => (
                <div key={log.id} className="flex items-start gap-4 px-6 py-4 hover:bg-gray-800/30 transition-colors">
                  <span className="text-lg mt-0.5 shrink-0">
                    {log.status === "success" ? "✅" : log.status === "error" ? "❌" : "⚠️"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={clsx(
                        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                        AGENT_COLORS[log.agent_name]
                      )}>
                        {AGENT_LABELS[log.agent_name]}
                      </span>
                      <span className="text-white text-sm font-medium">{log.action}</span>
                    </div>
                    <p className={clsx(
                      "text-sm",
                      log.status === "success" ? "text-green-400" :
                      log.status === "error" ? "text-red-400" : "text-yellow-400"
                    )}>
                      {log.result}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-gray-400 text-xs">{formatTime(log.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              totalItems={filtered.length}
              perPage={PER_PAGE}
            />
          </>
        )}
      </div>
    </div>
  );
}