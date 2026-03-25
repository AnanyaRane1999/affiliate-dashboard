"use client";

import { useRouter } from "next/navigation";
import { MOCK_NICHES, MOCK_AGENT_LOGS } from "@/lib/mock-data";
import StatusBadge from "@/components/shared/StatusBadge";
import { NicheStatus } from "@/types";
import {
  TrendingUp, TrendingDown, Globe, Activity,
  Megaphone, AlertTriangle,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const liveNiches = MOCK_NICHES.filter((n) => n.status === "live");
  const totalTraffic = MOCK_NICHES.reduce((a, n) => a + (n.traffic || 0), 0);
  const totalRevenue = MOCK_NICHES.reduce((a, n) => a + (n.estimated_revenue || 0), 0);
  const recentLogs = MOCK_AGENT_LOGS.slice(0, 4);

  const KPI_CARDS = [
    {
      label: "Total Traffic",
      value: totalTraffic.toLocaleString(),
      change: "+12.4%",
      up: true,
      icon: TrendingUp,
      color: "text-blue-400",
    },
    {
      label: "Ad Spend",
      value: "€842",
      change: "-3.2%",
      up: false,
      icon: Megaphone,
      color: "text-purple-400",
    },
    {
      label: "Est. Revenue",
      value: `€${totalRevenue.toLocaleString()}`,
      change: "+18.7%",
      up: true,
      icon: TrendingUp,
      color: "text-green-400",
    },
    {
      label: "Active Niches",
      value: liveNiches.length.toString(),
      change: "+2 this week",
      up: true,
      icon: Globe,
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
              <span className="text-xs text-gray-500">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Niches */}
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
            {MOCK_NICHES.slice(0, 4).map((niche) => (
              <div
                key={niche.id}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-800/30 cursor-pointer transition-colors"
                onClick={() => router.push(`/dashboard/niches/${niche.id}`)}
              >
                <div>
                  <p className="text-white text-sm font-medium">{niche.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">
                    Score: {niche.score?.toFixed(1)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {niche.estimated_revenue ? (
                    <span className="text-green-400 text-sm font-medium">
                      €{niche.estimated_revenue.toLocaleString()}
                    </span>
                  ) : null}
                  <StatusBadge status={niche.status as NicheStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
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
            {recentLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 px-6 py-3">
                <span className="text-base mt-0.5">
                  {log.status === "success" ? "✅" : log.status === "error" ? "❌" : "⚠️"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">
                    {log.action}
                  </p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">
                    {log.result}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Warning banner */}
      <div className="flex items-center gap-3 bg-yellow-900/20 border border-yellow-700/50 rounded-xl px-5 py-4">
        <AlertTriangle size={18} className="text-yellow-400 shrink-0" />
        <p className="text-yellow-400 text-sm">
          <strong>Mock data active</strong> — Waiting for Varun's backend API.
          Screens will auto-update when endpoints are live.
        </p>
      </div>
    </div>
  );
}