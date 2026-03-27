"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { AgentStatusInfo, AgentName } from "@/types";
import { API_ROUTES } from "@/lib/mock-data";
import { Bot, RefreshCw, Clock, Activity, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";

const MOCK_AGENT_STATUS: AgentStatusInfo[] = [
  { agent_name: "research",       status: "idle",    last_run: "2026-03-27T08:00:00Z", last_action: "Scored 15 German hobby niches",            run_count_today: 3, error_message: null },
  { agent_name: "business_case",  status: "idle",    last_run: "2026-03-27T08:15:00Z", last_action: "Generated financial model for Kitesurfen", run_count_today: 3, error_message: null },
  { agent_name: "site_builder",   status: "running", last_run: "2026-03-27T09:30:00Z", last_action: "Generating pages for Fotografie niche",     run_count_today: 2, error_message: null },
  { agent_name: "link_builder",   status: "idle",    last_run: "2026-03-27T09:00:00Z", last_action: "Refreshed 102 Amazon.de affiliate links",   run_count_today: 4, error_message: null },
  { agent_name: "ads_manager",    status: "error",   last_run: "2026-03-27T07:00:00Z", last_action: "Failed — Google Ads credentials missing",   run_count_today: 1, error_message: "Google Ads API credentials not configured" },
  { agent_name: "controller",     status: "idle",    last_run: "2026-03-27T09:45:00Z", last_action: "Budget reallocation check completed",        run_count_today: 6, error_message: null },
];

const AGENT_LABELS: Record<AgentName, string> = {
  research:      "Research Agent",
  business_case: "Business Case Agent",
  site_builder:  "Site Builder Agent",
  link_builder:  "Link Builder Agent",
  ads_manager:   "Ads Manager Agent",
  controller:    "Controller Agent",
};

const AGENT_DESCRIPTIONS: Record<AgentName, string> = {
  research:      "Discovers profitable German hobby niches using SerpAPI",
  business_case: "Models CAC, LTV, margin and payback period per niche",
  site_builder:  "Generates German SEO pages and publishes subdomains",
  link_builder:  "Finds Amazon.de products and builds affiliate bundles",
  ads_manager:   "Creates and manages Google Ads campaigns",
  controller:    "Orchestrates all agents and manages budget allocation",
};

const AGENT_COLORS: Record<AgentName, string> = {
  research:      "from-blue-600/20 to-blue-900/10 border-blue-700/50",
  business_case: "from-purple-600/20 to-purple-900/10 border-purple-700/50",
  site_builder:  "from-yellow-600/20 to-yellow-900/10 border-yellow-700/50",
  link_builder:  "from-orange-600/20 to-orange-900/10 border-orange-700/50",
  ads_manager:   "from-pink-600/20 to-pink-900/10 border-pink-700/50",
  controller:    "from-cyan-600/20 to-cyan-900/10 border-cyan-700/50",
};

const ICON_COLORS: Record<AgentName, string> = {
  research:      "text-blue-400",
  business_case: "text-purple-400",
  site_builder:  "text-yellow-400",
  link_builder:  "text-orange-400",
  ads_manager:   "text-pink-400",
  controller:    "text-cyan-400",
};

export default function AgentsPage() {
  const { data: agents, isLoading, refetch } = useQuery({
    queryKey: ["agent-status"],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.agentStatus);
        return extractData<AgentStatusInfo[]>(res);
      } catch {
        return MOCK_AGENT_STATUS;
      }
    },
    refetchInterval: 10000,
  });

  const controllerMutation = useMutation({
    mutationFn: () => api.post(API_ROUTES.runController),
    onSuccess: () => refetch(),
    onError: () => refetch(),
  });

  const displayAgents = agents || MOCK_AGENT_STATUS;
  const runningCount = displayAgents.filter((a) => a.status === "running").length;
  const errorCount = displayAgents.filter((a) => a.status === "error").length;
  const idleCount = displayAgents.filter((a) => a.status === "idle").length;

  function formatTime(ts: string | null) {
    if (!ts) return "Never";
    return new Date(ts).toLocaleTimeString("de-DE", {
      hour: "2-digit", minute: "2-digit", second: "2-digit"
    });
  }

  function StatusDot({ status }: { status: string }) {
    return (
      <div className="flex items-center gap-2">
        <span className={clsx(
          "w-2.5 h-2.5 rounded-full",
          status === "running" ? "bg-green-500 status-pulse" :
          status === "error"   ? "bg-red-500" : "bg-gray-500"
        )} />
        <span className={clsx(
          "text-sm font-medium capitalize",
          status === "running" ? "text-green-400" :
          status === "error"   ? "text-red-400" : "text-gray-400"
        )}>
          {status}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Agent Status</h1>
          <p className="text-gray-400 mt-1">
            {runningCount} running — {idleCount} idle — {errorCount} errors
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-pulse" />
            Auto-refresh 10s
          </div>
          <button
            onClick={() => controllerMutation.mutate()}
            disabled={controllerMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-900/30 border border-cyan-700 text-cyan-400 rounded-lg hover:bg-cyan-900/50 transition-colors text-sm disabled:opacity-50"
          >
            <RefreshCw size={14} className={clsx(controllerMutation.isPending && "animate-spin")} />
            Run Controller
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-green-900/20 border border-green-700/50 rounded-xl p-4">
          <p className="text-green-400 text-sm">Running</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{runningCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Idle</p>
          <p className="text-2xl font-bold text-white mt-1">{idleCount}</p>
        </div>
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
          <p className="text-red-400 text-sm">Errors</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{errorCount}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="skeleton h-5 w-40 mb-3" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-32" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayAgents.map((agent) => (
            <div
              key={agent.agent_name}
              className={clsx(
                "bg-gradient-to-br border rounded-xl p-6",
                AGENT_COLORS[agent.agent_name]
              )}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900/50 rounded-lg flex items-center justify-center">
                    <Bot size={20} className={ICON_COLORS[agent.agent_name]} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">
                      {AGENT_LABELS[agent.agent_name]}
                    </h3>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {AGENT_DESCRIPTIONS[agent.agent_name]}
                    </p>
                  </div>
                </div>
                <StatusDot status={agent.status} />
              </div>

              {agent.error_message && (
                <div className="flex items-center gap-2 bg-red-900/30 border border-red-700/50 rounded-lg px-3 py-2 mb-3">
                  <AlertTriangle size={14} className="text-red-400 shrink-0" />
                  <p className="text-red-400 text-xs">{agent.error_message}</p>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Activity size={12} className="text-gray-500" />
                  <span className="text-gray-500">Last action:</span>
                  <span className="text-gray-300 truncate">{agent.last_action || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Clock size={12} className="text-gray-500" />
                  <span className="text-gray-500">Last run:</span>
                  <span className="text-gray-300">{formatTime(agent.last_run)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <RefreshCw size={12} className="text-gray-500" />
                  <span className="text-gray-500">Runs today:</span>
                  <span className="text-gray-300">{agent.run_count_today}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}