"use client";

import { useQuery } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { API_ROUTES } from "@/lib/mock-data";
import { Bot, RefreshCw, Clock, CheckCircle, AlertCircle, Circle } from "lucide-react";
import { clsx } from "clsx";

const AGENT_CONFIG: Record<string, { label: string; color: string; description: string }> = {
  ResearchAgent:     { label: "Research Agent",      color: "blue",   description: "Discovers profitable German hobby niches via SerpAPI" },
  BusinessCaseAgent: { label: "Business Case Agent", color: "purple", description: "Builds financial models and go/no-go decisions per niche" },
  SiteBuilderAgent:  { label: "Site Builder Agent",  color: "yellow", description: "Generates German SEO content for affiliate sites" },
  LinkBuilderAgent:  { label: "Link Builder Agent",  color: "orange", description: "Finds Amazon.de products and generates affiliate links" },
  AdsManagerAgent:   { label: "Ads Manager Agent",   color: "pink",   description: "Creates and optimises Google Ads campaigns" },
  ControllerAgent:   { label: "Controller Agent",    color: "cyan",   description: "Orchestrates all agents every 6 hours automatically" },
};

const COLOR_MAP: Record<string, string> = {
  blue:   "bg-blue-900/30 border-blue-700/50 text-blue-400",
  purple: "bg-purple-900/30 border-purple-700/50 text-purple-400",
  yellow: "bg-yellow-900/30 border-yellow-700/50 text-yellow-400",
  orange: "bg-orange-900/30 border-orange-700/50 text-orange-400",
  pink:   "bg-pink-900/30 border-pink-700/50 text-pink-400",
  cyan:   "bg-cyan-900/30 border-cyan-700/50 text-cyan-400",
};

export default function AgentsPage() {
  const { data: statuses, isLoading, refetch } = useQuery({
    queryKey: ["agent-status"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.agentStatus);
      return extractData<any[]>(res);
    },
    refetchInterval: 10000,
  });

  const displayStatuses = statuses || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Status</h1>
          <p className="text-gray-400 mt-1">
            {displayStatuses.length} agents — auto-refresh every 10s
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

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {isLoading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="h-4 bg-gray-800 rounded animate-pulse w-32 mb-3" />
              <div className="h-3 bg-gray-800 rounded animate-pulse w-48" />
            </div>
          ))
        ) : displayStatuses.length === 0 ? (
          <div className="col-span-3 text-center py-12 text-gray-500">
            No agent data yet. Trigger an agent to see status.
          </div>
        ) : (
          displayStatuses.map((agent: any) => {
            const config = AGENT_CONFIG[agent.agent_name] || {
              label: agent.agent_name,
              color: "blue",
              description: "AI agent",
            };
            const colorClass = COLOR_MAP[config.color] || COLOR_MAP.blue;
            const hasRun = agent.status === "ran";
            const lastRun = agent.last_run
              ? new Date(agent.last_run).toLocaleString("de-DE")
              : "Never";

            return (
              <div
                key={agent.agent_name}
                className={clsx(
                  "bg-gray-900 border rounded-xl p-5 flex flex-col gap-3",
                  hasRun ? "border-gray-700" : "border-gray-800"
                )}
              >
                {/* Agent header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={clsx("p-2 rounded-lg border", colorClass)}>
                      <Bot size={16} />
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{config.label}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{config.description}</p>
                    </div>
                  </div>
                  {/* Status dot */}
                  {hasRun ? (
                    <CheckCircle size={16} className="text-green-400 shrink-0 mt-1" />
                  ) : (
                    <Circle size={16} className="text-gray-600 shrink-0 mt-1" />
                  )}
                </div>

                {/* Last action */}
                <div className="bg-gray-800/50 rounded-lg px-3 py-2">
                  <p className="text-gray-500 text-xs mb-1">Last Action</p>
                  <p className="text-gray-300 text-xs">
                    {agent.last_action || "No action recorded"}
                  </p>
                </div>

                {/* Last run time */}
                <div className="flex items-center gap-2 text-gray-500 text-xs">
                  <Clock size={12} />
                  <span>Last run: {lastRun}</span>
                </div>

                {/* Status badge */}
                <div className="flex items-center gap-2">
                  <span className={clsx(
                    "text-xs px-2 py-0.5 rounded-full border font-medium",
                    hasRun
                      ? "bg-green-900/30 border-green-700/50 text-green-400"
                      : "bg-gray-800 border-gray-700 text-gray-500"
                  )}>
                    {hasRun ? "● Active" : "○ Idle"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Controller info */}
      <div className="bg-blue-900/20 border border-blue-700/50 rounded-xl px-5 py-4">
        <div className="flex items-center gap-2 mb-1">
          <Bot size={16} className="text-blue-400" />
          <p className="text-blue-400 text-sm font-medium">Controller Agent runs every 6 hours</p>
        </div>
        <p className="text-blue-300/70 text-xs">
          The Controller Agent automatically assesses system health and dispatches all other agents as needed.
          No manual intervention required.
        </p>
      </div>
    </div>
  );
}