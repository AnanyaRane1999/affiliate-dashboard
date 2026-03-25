"use client";

import { useState } from "react";
import { MOCK_AGENT_LOGS } from "@/lib/mock-data";
import { AgentName } from "@/types";
import { Activity, RefreshCw } from "lucide-react";
import { clsx } from "clsx";

const AGENT_COLORS: Record<AgentName, string> = {
  research:       "bg-blue-900/50 text-blue-400 border border-blue-700",
  business_case:  "bg-purple-900/50 text-purple-400 border border-purple-700",
  site_builder:   "bg-yellow-900/50 text-yellow-400 border border-yellow-700",
  link_builder:   "bg-orange-900/50 text-orange-400 border border-orange-700",
  ads_manager:    "bg-pink-900/50 text-pink-400 border border-pink-700",
  controller:     "bg-cyan-900/50 text-cyan-400 border border-cyan-700",
};

const AGENT_LABELS: Record<AgentName, string> = {
  research:       "Research",
  business_case:  "Business Case",
  site_builder:   "Site Builder",
  link_builder:   "Link Builder",
  ads_manager:    "Ads Manager",
  controller:     "Controller",
};

const STATUS_COLORS = {
  success: "text-green-400",
  error:   "text-red-400",
  warning: "text-yellow-400",
};

const STATUS_ICONS = {
  success: "✅",
  error:   "❌",
  warning: "⚠️",
};

export default function ActivityPage() {
  const [filter, setFilter] = useState<AgentName | "all">("all");
  const [refreshing, setRefreshing] = useState(false);

  const filtered = MOCK_AGENT_LOGS.filter(
    (log) => filter === "all" || log.agent_name === filter
  );

  function handleRefresh() {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }

  function formatTime(timestamp: string) {
    return new Date(timestamp).toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  function formatDate(timestamp: string) {
    return new Date(timestamp).toLocaleDateString("de-DE");
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Activity Log</h1>
          <p className="text-gray-400 mt-1">
            Live feed of all agent actions — {filtered.length} entries
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw
            size={16}
            className={clsx(refreshing && "animate-spin")}
          />
          Refresh
        </button>
      </div>

      {/* Agent Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={clsx(
            "px-3 py-2 rounded-lg text-xs font-medium transition-colors",
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          )}
        >
          All Agents
        </button>
        {(Object.keys(AGENT_LABELS) as AgentName[]).map((agent) => (
          <button
            key={agent}
            onClick={() => setFilter(agent)}
            className={clsx(
              "px-3 py-2 rounded-lg text-xs font-medium transition-colors",
              filter === agent
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            {AGENT_LABELS[agent]}
          </button>
        ))}
      </div>

      {/* Activity Log Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
          <Activity size={16} className="text-blue-400" />
          <span className="text-white font-medium">Live Agent Feed</span>
          <span className="ml-auto flex items-center gap-1.5 text-xs text-green-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 status-pulse" />
            Auto-refresh every 10s
          </span>
        </div>

        <div className="divide-y divide-gray-800">
          {filtered.map((log) => (
            <div
              key={log.id}
              className="flex items-start gap-4 px-6 py-4 hover:bg-gray-800/30 transition-colors"
            >
              {/* Status icon */}
              <span className="text-lg mt-0.5 shrink-0">
                {STATUS_ICONS[log.status]}
              </span>

              {/* Main content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {/* Agent badge */}
                  <span className={clsx(
                    "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                    AGENT_COLORS[log.agent_name]
                  )}>
                    {AGENT_LABELS[log.agent_name]}
                  </span>
                  {/* Action */}
                  <span className="text-white text-sm font-medium">
                    {log.action}
                  </span>
                </div>
                {/* Result */}
                <p className={clsx(
                  "text-sm mt-1",
                  STATUS_COLORS[log.status]
                )}>
                  {log.result}
                </p>
              </div>

              {/* Timestamp */}
              <div className="text-right shrink-0">
                <p className="text-white text-sm">{formatTime(log.timestamp)}</p>
                <p className="text-gray-500 text-xs">{formatDate(log.timestamp)}</p>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No activity logs found for this agent.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}