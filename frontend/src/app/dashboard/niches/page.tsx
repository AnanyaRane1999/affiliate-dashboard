"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { MOCK_NICHES, API_ROUTES } from "@/lib/mock-data";
import StatusBadge from "@/components/shared/StatusBadge";
import { Niche, NicheStatus } from "@/types";
import { Search, TrendingUp, RefreshCw } from "lucide-react";

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
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Niche Overview</h1>
          <p className="text-gray-400 mt-1">
            {displayNiches.length} niches — {displayNiches.filter(n => n.status === "live").length} live
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
          <div className="flex items-center gap-2 bg-blue-600/20 border border-blue-600/30 rounded-lg px-3 py-2">
            <TrendingUp size={16} className="text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Auto-refresh 30s</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search niches..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Niche</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Score</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Subdomain</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Traffic</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Est. Revenue</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="skeleton h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.map((niche) => (
                <tr key={niche.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-white font-medium">{niche.name}</p>
                      <p className="text-gray-500 text-xs mt-0.5">ID #{niche.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-700 rounded-full h-1.5">
                        <div
                          className="bg-blue-500 h-1.5 rounded-full"
                          style={{ width: `${((niche.score || 0) / 10) * 100}%` }}
                        />
                      </div>
                      <span className="text-white text-sm font-medium">
                        {niche.score?.toFixed(1) || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={niche.status as NicheStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm">
                      {niche.subdomain || "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white text-sm">
                      {niche.traffic ? niche.traffic.toLocaleString() : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-green-400 text-sm font-medium">
                      {niche.estimated_revenue
                        ? `€${niche.estimated_revenue.toLocaleString()}`
                        : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => router.push(`/dashboard/niches/${niche.id}`)}
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && filtered.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No niches found matching your filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}