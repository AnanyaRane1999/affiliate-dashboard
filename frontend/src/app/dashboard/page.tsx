"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { API_ROUTES } from "@/lib/mock-data";
import StatusBadge from "@/components/shared/StatusBadge";
import { Niche, AgentLog, NicheStatus } from "@/types";
import {
  TrendingUp, TrendingDown, Globe, Activity,
  Megaphone, AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  // Fetch real niches from backend
  const { data: niches } = useQuery({
    queryKey: ["niches"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.niches);
      return extractData<Niche[]>(res);
    },
    refetchInterval: 30000,
  });

  // Fetch real agent logs from backend
  const { data: agentLogs } = useQuery({
    queryKey: ["agent-logs"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.agentLogs);
      return extractData<AgentLog[]>(res);
    },
    refetchInterval: 30000,
  });

  // Fetch real alerts count
  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.alerts);
      return extractData<any[]>(res);
    },
    refetchInterval: 30000,
  });

  // Fetch budget allocations
  const { data: budgets } = useQuery({
    queryKey: ["budget-allocations"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.budgetAllocations);
      return extractData<any[]>(res);
    },
    refetchInterval: 30000,
  });

  const displayNiches = niches || [];
  const displayLogs = agentLogs || [];

  const liveNiches = displayNiches.filter((n) => n.status === "live" || n.status === "approved");
  const totalBudget = budgets?.reduce((a: number, b: any) => a + (b.allocated || 0), 0) || 0;
  const totalSpent = budgets?.reduce((a: number, b: any) => a + (b.spent || 0), 0) || 0;
  const unresolvedAlerts = alerts?.length || 0;

  const KPI_CARDS = [
    {
      label: "Total Niches",
      value: displayNiches.length.toString(),
      change: `${liveNiches.length} approved`,
      up: true,
      icon: Globe,
      color: "text-blue-400",
    },
    {
      label: "Ad Spend",
      value: `€${totalSpent.toFixed(0)}`,
      change: `of €${totalBudget.toFixed(0)} allocated`,
      up: true,
      icon: Megaphone,
      color: "text-purple-400",
    },
    {
      label: "Active Alerts",
      value: unresolvedAlerts.toString(),
      change: unresolvedAlerts > 0 ? "needs attention" : "all clear",
      up: unresolvedAlerts === 0,
      icon: AlertTriangle,
      color: unresolvedAlerts > 0 ? "text-red-400" : "text-green-400",
    },
    {
      label: "Active Niches",
      value: liveNiches.length.toString(),
      change: `${displayNiches.length} total discovered`,
      up: true,
      icon: TrendingUp,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          Affiliate Growth Platform
        </h1>
        <p className="text-gray-400 mt-1">
          Germany Market — Automated Dashboard
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">{kpi.label}</p>
              <kpi.icon size={18} className={kpi.color} />
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {kpi.up
                ? <TrendingUp size={12} className="text-green-400" />
                : <TrendingDown size={12} className="text-red-400" />
              }
              <span className={`text-xs ${kpi.up ? "text-green-400" : "text-red-400"}`}>
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Niches */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-blue-400" />
              <span className="text-white font-medium">Top Niches</span>
            </div>
            <button
              onClick={() => router.push("/dashboard/niches")}
              className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-gray-800">
            {displayNiches.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                Loading niches from backend...
              </div>
            ) : (
              displayNiches
                .sort((a, b) => (b.score || 0) - (a.score || 0))
                .slice(0, 5)
                .map((niche) => (
                  <div
                    key={niche.id}
                    className="flex items-center justify-between px-6 py-3 hover:bg-gray-800/30 cursor-pointer transition-colors"
                    onClick={() => router.push(`/dashboard/niches/${niche.id}`)}
                  >
                    <div>
                      <p className="text-white text-sm font-medium">{niche.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        Score: {niche.score?.toFixed(2)} | Budget: €{niche.recommended_budget}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={niche.status as NicheStatus} />
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        {/* Recent Agent Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-blue-400" />
              <span className="text-white font-medium">Recent Activity</span>
            </div>
            <button
              onClick={() => router.push("/dashboard/activity")}
              className="text-blue-400 text-sm hover:text-blue-300 transition-colors"
            >
              View all →
            </button>
          </div>
          <div className="divide-y divide-gray-800">
            {displayLogs.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 text-sm">
                Loading agent logs from backend...
              </div>
            ) : (
              displayLogs.slice(0, 5).map((log: any) => (
                <div key={log.id} className="flex items-start gap-3 px-6 py-3">
                  <span className="text-base mt-0.5">✅</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {log.agent_name} — {log.action}
                    </p>
                    <p className="text-gray-500 text-xs mt-0.5 truncate">
                      {log.result_summary || log.input_summary || "—"}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* Live data indicator */}
      <div className="flex items-center gap-3 bg-green-900/20 border border-green-700/50 rounded-xl px-5 py-4">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <p className="text-green-400 text-sm">
          <strong>Live data active</strong> — Connected to backend API. Data refreshes every 30 seconds.
        </p>
      </div>
    </div>
  );
}