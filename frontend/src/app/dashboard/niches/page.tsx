"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { MOCK_NICHES, API_ROUTES } from "@/lib/mock-data";
import StatusBadge from "@/components/shared/StatusBadge";
import { Niche, NicheStatus } from "@/types";
import { Search, TrendingUp, RefreshCw, LayoutGrid, Table2 } from "lucide-react";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Live", value: "live" },
  { label: "Building", value: "building" },
  { label: "Pending", value: "pending_approval" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
  { label: "Discovered", value: "discovered" },
];

export default function NichesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [view, setView] = useState<"table" | "comparison">("table");

  const { data: niches, isLoading, refetch } = useQuery({
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

  const displayNiches = niches || MOCK_NICHES;
  const filtered = displayNiches.filter((n) => {
    const matchSearch = n.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || n.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Niche Overview</h1>
          <p className="text-gray-400 mt-0.5 text-sm">
            {displayNiches.length} niches — {displayNiches.filter(n => n.status === "live").length} live
          </p>
        </div>
        {/* Buttons — scrollable row on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex bg-gray-800 border border-gray-700 rounded-lg overflow-hidden shrink-0">
            <button
              onClick={() => setView("table")}
              className={`px-3 py-2 text-xs flex items-center gap-1.5 transition-colors ${view === "table" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
            >
              <Table2 size={14} />
              Table
            </button>
            <button
              onClick={() => setView("comparison")}
              className={`px-3 py-2 text-xs flex items-center gap-1.5 transition-colors ${view === "comparison" ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"}`}
            >
              <LayoutGrid size={14} />
              Compare
            </button>
          </div>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-xs shrink-0"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
          <div className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-600/30 rounded-lg px-3 py-2 shrink-0">
            <TrendingUp size={13} className="text-blue-400" />
            <span className="text-blue-400 text-xs font-medium whitespace-nowrap">Auto 30s</span>
          </div>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search niches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                statusFilter === f.value ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table — horizontally scrollable on mobile */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        {/* Scroll hint on mobile */}
        <div className="sm:hidden px-4 py-2 bg-gray-800/50 border-b border-gray-800 flex items-center gap-2">
          <span className="text-gray-500 text-xs">← Scroll sideways to see all columns →</span>
        </div>
        <div className="overflow-x-auto">
          {view === "table" ? (
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Niche</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Score</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Subdomain</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Traffic</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Revenue</th>
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-20" /></td>
                      ))}
                    </tr>
                  ))
                ) : (
                  filtered.map((niche) => (
                    <tr key={niche.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-white font-medium text-sm">{niche.name}</p>
                          <p className="text-gray-500 text-xs mt-0.5">ID #{niche.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-12 bg-gray-700 rounded-full h-1.5">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${((niche.score || 0) / 10) * 100}%` }} />
                          </div>
                          <span className="text-white text-sm font-medium">{niche.score?.toFixed(1) || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={niche.status as NicheStatus} /></td>
                      <td className="px-4 py-3"><span className="text-gray-400 text-sm">{niche.subdomain || "—"}</span></td>
                      <td className="px-4 py-3"><span className="text-white text-sm">{niche.traffic ? niche.traffic.toLocaleString() : "—"}</span></td>
                      <td className="px-4 py-3"><span className="text-green-400 text-sm font-medium">{niche.estimated_revenue ? "€" + niche.estimated_revenue.toLocaleString() : "—"}</span></td>
                      <td className="px-4 py-3">
                        <button onClick={() => router.push("/dashboard/niches/" + niche.id)} className="text-blue-400 hover:text-blue-300 text-sm font-medium whitespace-nowrap">
                          View →
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Niche</th>
                  <th className="text-center text-xs font-medium text-gray-400 uppercase px-3 py-3">Score</th>
                  <th className="text-center text-xs font-medium text-gray-400 uppercase px-3 py-3">CPC</th>
                  <th className="text-center text-xs font-medium text-gray-400 uppercase px-3 py-3">AOV</th>
                  <th className="text-center text-xs font-medium text-gray-400 uppercase px-3 py-3">Commission</th>
                  <th className="text-center text-xs font-medium text-gray-400 uppercase px-3 py-3">Traffic</th>
                  <th className="text-center text-xs font-medium text-gray-400 uppercase px-3 py-3">Revenue</th>
                  <th className="text-center text-xs font-medium text-gray-400 uppercase px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((niche) => (
                  <tr key={niche.id} className="hover:bg-gray-800/50 transition-colors cursor-pointer" onClick={() => router.push("/dashboard/niches/" + niche.id)}>
                    <td className="px-4 py-3"><p className="text-white font-medium text-sm">{niche.name}</p></td>
                    <td className="px-3 py-3 text-center"><span className="text-blue-400 font-bold text-sm">{niche.score?.toFixed(1) || "—"}</span></td>
                    <td className="px-3 py-3 text-center"><span className="text-white text-sm">{niche.cpc_estimate ? "€" + niche.cpc_estimate.toFixed(2) : "—"}</span></td>
                    <td className="px-3 py-3 text-center"><span className="text-white text-sm">{niche.aov_estimate ? "€" + niche.aov_estimate.toFixed(0) : "—"}</span></td>
                    <td className="px-3 py-3 text-center"><span className="text-white text-sm">{niche.commission_rate ? (niche.commission_rate * 100).toFixed(0) + "%" : "—"}</span></td>
                    <td className="px-3 py-3 text-center"><span className="text-white text-sm">{niche.traffic ? niche.traffic.toLocaleString() : "—"}</span></td>
                    <td className="px-3 py-3 text-center"><span className="text-green-400 text-sm font-medium">{niche.estimated_revenue ? "€" + niche.estimated_revenue.toLocaleString() : "—"}</span></td>
                    <td className="px-3 py-3 text-center"><StatusBadge status={niche.status as NicheStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">No niches found.</div>
          )}
        </div>
      </div>
    </div>
  );
}