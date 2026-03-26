"use client";

import { useQuery } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { API_ROUTES } from "@/lib/mock-data";
import { Activity, RefreshCw } from "lucide-react";
import { clsx } from "clsx";

const AGENT_COLORS: Record<string, string> = {
  ResearchAgent:     "bg-blue-900/50 text-blue-400 border border-blue-700",
  BusinessCaseAgent: "bg-purple-900/50 text-purple-400 border border-purple-700",
  SiteBuilderAgent:  "bg-yellow-900/50 text-yellow-400 border border-yellow-700",
  LinkBuilderAgent:  "bg-orange-900/50 text-orange-400 border border-orange-700",
  AdsManagerAgent:   "bg-pink-900/50 text-pink-400 border border-pink-700",
  ControllerAgent:   "bg-cyan-900/50 text-cyan-400 border border-cyan-700",
};

export default function ActivityPage() {
  const { data: logs, isLoading, refetch } = useQuery({
    queryKey: ["agent-logs"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.agentLogs);
      return extractData<any[]>(res);
    },
    refetchInterval: 15000,
  });

  const displayLogs = logs || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Activity Log</h1>
          <p className="text-gray-400 mt-1">
            {displayLogs.length} log entries — live from backend
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Log Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Agent</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Action</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Result</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(4)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-800 rounded animate-pulse w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : displayLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-12 text-gray-500">
                    No agent logs yet. Trigger an agent to see activity.
                  </td>
                </tr>
              ) : (
                displayLogs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className={clsx(
                        "text-xs font-medium px-2 py-1 rounded-md",
                        AGENT_COLORS[log.agent_name] || "bg-gray-700 text-gray-300"
                      )}>
                        {log.agent_name?.replace("Agent", "") || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-white text-sm">{log.action}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-400 text-sm max-w-xs truncate">
                        {log.result_summary || log.input_summary || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 text-xs">
                        {new Date(log.timestamp).toLocaleString("de-DE")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}