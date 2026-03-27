"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { MOCK_NICHES, MOCK_AGENT_LOGS, API_ROUTES } from "@/lib/mock-data";
import StatusBadge from "@/components/shared/StatusBadge";
import { Niche, AgentLog, Alert, NicheStatus } from "@/types";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import {
  TrendingUp, TrendingDown, Globe,
  Activity, Megaphone, Bell,
} from "lucide-react";

const TRAFFIC_DATA = [
  { date: "Mar 20", organic: 1200, paid: 800 },
  { date: "Mar 21", organic: 1800, paid: 1200 },
  { date: "Mar 22", organic: 2200, paid: 1400 },
  { date: "Mar 23", organic: 2800, paid: 1600 },
  { date: "Mar 24", organic: 3200, paid: 1800 },
  { date: "Mar 25", organic: 3800, paid: 2000 },
  { date: "Mar 26", organic: 4200, paid: 2200 },
];

const SPEND_REVENUE_DATA = [
  { niche: "Kitesurfen",  spend: 48,  revenue: 184 },
  { niche: "Camping",     spend: 38,  revenue: 160 },
  { niche: "Fotografie",  spend: 12,  revenue: 0 },
  { niche: "Yoga",        spend: 0,   revenue: 0 },
];

export default function DashboardPage() {
  const router = useRouter();

  const { data: niches } = useQuery({
    queryKey: ["niches"],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.niches);
        return extractData<Niche[]>(res);
      } catch {
        return MOCK_NICHES;
      }
    },
    refetchInterval: 30000,
  });

  const { data: logs } = useQuery({
    queryKey: ["agent-logs"],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.agentLogs);
        return extractData<AgentLog[]>(res);
      } catch {
        return MOCK_AGENT_LOGS;
      }
    },
  });

  const { data: alerts } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.alerts);
        return extractData<Alert[]>(res);
      } catch {
        return [];
      }
    },
  });

  const displayNiches = niches || MOCK_NICHES;
  const displayLogs = logs || MOCK_AGENT_LOGS;
  const displayAlerts = alerts || [];

  const liveNiches = displayNiches.filter((n) => n.status === "live");
  const totalTraffic = displayNiches.reduce((a, n) => a + (n.traffic || 0), 0);
  const totalRevenue = displayNiches.reduce((a, n) => a + (n.estimated_revenue || 0), 0);
  const unresolvedAlerts = displayAlerts.filter((a) => !a.resolved).length;

  const KPI_CARDS = [
    { label: "Total Traffic",   value: totalTraffic ? totalTraffic.toLocaleString() : displayNiches.length.toString(), change: "+12.4%", up: true,  icon: TrendingUp,  color: "text-blue-400" },
    { label: "Ad Spend",        value: "€99.20",                                                                        change: "-3.2%",  up: false, icon: Megaphone,   color: "text-purple-400" },
    { label: "Est. Revenue",    value: totalRevenue ? "€" + totalRevenue.toLocaleString() : "€344",                    change: "+18.7%", up: true,  icon: TrendingUp,  color: "text-green-400" },
    { label: "Active Niches",   value: liveNiches.length.toString(),                                                    change: "+2 this week", up: true, icon: Globe, color: "text-orange-400" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Affiliate Growth Platform</h1>
        <p className="text-gray-400 mt-1">Germany Market — Automated Dashboard</p>
      </div>

      {unresolvedAlerts > 0 && (
        <div
          className="flex items-center justify-between bg-red-900/20 border border-red-700/50 rounded-xl px-5 py-3 cursor-pointer hover:bg-red-900/30 transition-colors"
          onClick={() => router.push("/dashboard/alerts")}
        >
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-red-400" />
            <p className="text-red-400 text-sm font-medium">
              {unresolvedAlerts} unresolved alerts need attention
            </p>
          </div>
          <span className="text-red-400 text-sm">View alerts →</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {KPI_CARDS.map((kpi) => (
          <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-gray-400 text-sm">{kpi.label}</p>
              <kpi.icon size={18} className={kpi.color} />
            </div>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
            <div className="flex items-center gap-1 mt-2">
              {kpi.up
                ? <TrendingUp size={12} className="text-green-400" />
                : <TrendingDown size={12} className="text-red-400" />}
              <span className={`text-xs ${kpi.up ? "text-green-400" : "text-red-400"}`}>{kpi.change}</span>
              <span className="text-xs text-gray-500">vs last week</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Traffic Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={TRAFFIC_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="date" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px" }} />
              <Legend />
              <Line type="monotone" dataKey="organic" stroke="#3b82f6" strokeWidth={2} dot={false} name="Organic" />
              <Line type="monotone" dataKey="paid" stroke="#8b5cf6" strokeWidth={2} dot={false} name="Paid" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Spend vs Revenue by Niche</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SPEND_REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="niche" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #374151", borderRadius: "8px" }} />
              <Legend />
              <Bar dataKey="spend" fill="#8b5cf6" name="Spend (€)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue (€)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Globe size={16} className="text-blue-400" />
              <span className="text-white font-medium">Top Niches</span>
            </div>
            <button onClick={() => router.push("/dashboard/niches")} className="text-blue-400 text-sm hover:text-blue-300">View all →</button>
          </div>
          <div className="divide-y divide-gray-800">
            {displayNiches.slice(0, 5).map((niche) => (
              <div
                key={niche.id}
                className="flex items-center justify-between px-6 py-3 hover:bg-gray-800/30 cursor-pointer"
                onClick={() => router.push("/dashboard/niches/" + niche.id)}
              >
                <div>
                  <p className="text-white text-sm font-medium">{niche.name}</p>
                  <p className="text-gray-500 text-xs mt-0.5">Score: {niche.score?.toFixed(1) || "—"}</p>
                </div>
                <div className="flex items-center gap-3">
                  {niche.estimated_revenue ? (
                    <span className="text-green-400 text-sm font-medium">€{niche.estimated_revenue.toLocaleString()}</span>
                  ) : null}
                  <StatusBadge status={niche.status as NicheStatus} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-blue-400" />
              <span className="text-white font-medium">Recent Activity</span>
            </div>
            <button onClick={() => router.push("/dashboard/activity")} className="text-blue-400 text-sm hover:text-blue-300">View all →</button>
          </div>
          <div className="divide-y divide-gray-800">
            {displayLogs.slice(0, 5).map((log) => (
              <div key={log.id} className="flex items-start gap-3 px-6 py-3">
                <span className="text-base mt-0.5">
                  {log.status === "success" ? "✅" : log.status === "error" ? "❌" : "⚠️"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">{log.action}</p>
                  <p className="text-gray-500 text-xs mt-0.5 truncate">{log.result}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}