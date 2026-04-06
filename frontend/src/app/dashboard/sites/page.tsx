"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { MOCK_SITES, API_ROUTES } from "@/lib/mock-data";
import SiteStatusBadge from "@/components/shared/SiteStatusBadge";
import { Site } from "@/types";
import { Search, Globe, RefreshCw, ExternalLink } from "lucide-react";

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Live", value: "live" },
  { label: "Building", value: "building" },
  { label: "Draft", value: "draft" },
  { label: "Failed", value: "failed" },
];

export default function SitesPage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { data: sites, isLoading, refetch, isError } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.sites);
        const data = extractData<Site[]>(res);
	return data.map((n: any) => ({
	  id: n.id,
	  niche_id: n.id,
          niche_name: n.name,
          name: n.name,
          subdomain: n.subdomain,
          status: n.status,
          page_count: n.page_count || 0,
          traffic_30d: n.traffic || 0,
          last_published: n.updated_at,
          created_at: n.created_at,
	}));
      } catch {
        return [];
      }
    },
    refetchInterval: 60000,
  });

  const displaySites = sites || [];

  const filtered = displaySites.filter((s) => {
    const matchSearch = (s.niche_name || s.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (s.subdomain || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const liveSites = displaySites.filter((s) => s.status === "live").length;
  const totalTraffic = displaySites.reduce((a, s) => a + (s.traffic_30d || 0), 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Sites</h1>
          <p className="text-gray-400 mt-1">
            {liveSites} live sites — {totalTraffic.toLocaleString()} total traffic (30d)
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Sites", value: displaySites.length },
          { label: "Live", value: displaySites.filter(s => s.status === "live").length },
          { label: "Building", value: displaySites.filter(s => s.status === "building").length },
          { label: "Draft", value: displaySites.filter(s => s.status === "draft").length },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search sites..."
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

      {/* Sites Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="skeleton h-5 w-32 mb-3" />
              <div className="skeleton h-4 w-48 mb-2" />
              <div className="skeleton h-4 w-24" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <Globe size={40} className="text-gray-600 mx-auto mb-3" />
          <p className="text-gray-500">No sites found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((site) => (
            <div
              key={site.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors cursor-pointer"
              onClick={() => router.push(`/dashboard/sites/${site.id}`)}
            >
              {/* Site Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold">{site.niche_name}</h3>
                    <SiteStatusBadge status={site.status} />
                  </div>
                  <div className="flex items-center gap-1 text-blue-400 text-sm">
                    <ExternalLink size={12} />
                    <span>{site.subdomain}</span>
                  </div>
                </div>
                <div className="w-10 h-10 bg-blue-600/20 border border-blue-600/30 rounded-lg flex items-center justify-center">
                  <Globe size={18} className="text-blue-400" />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Pages</p>
                  <p className="text-white font-bold mt-0.5">{site.page_count}</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Traffic (30d)</p>
                  <p className="text-white font-bold mt-0.5">
                    {site.traffic_30d > 0 ? site.traffic_30d.toLocaleString() : "—"}
                  </p>
                </div>
                <div className="bg-gray-800 rounded-lg p-3">
                  <p className="text-gray-400 text-xs">Published</p>
                  <p className="text-white font-bold mt-0.5 text-xs">
                    {site.last_published
                      ? new Date(site.last_published).toLocaleDateString("de-DE")
                      : "—"}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                <span className="text-gray-500 text-xs">
                  Created {new Date(site.created_at).toLocaleDateString("de-DE")}
                </span>
                <span className="text-blue-400 text-sm font-medium">
                  View details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
