"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { MOCK_AFFILIATE_LINKS, API_ROUTES } from "@/lib/mock-data";
import { AffiliateLink, LinkStatus } from "@/types";
import { Link2, RefreshCw, Star, AlertTriangle, Search } from "lucide-react";
import { clsx } from "clsx";

const STATUS_CONFIG: Record<LinkStatus, { label: string; className: string }> = {
  active:       { label: "Active",       className: "bg-green-900/50 text-green-400 border border-green-700" },
  out_of_stock: { label: "Out of Stock", className: "bg-orange-900/50 text-orange-400 border border-orange-700" },
  broken:       { label: "Broken",       className: "bg-red-900/50 text-red-400 border border-red-700" },
  stale:        { label: "Stale",        className: "bg-gray-700/50 text-gray-400 border border-gray-600" },
};

export default function LinksPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [nicheFilter, setNicheFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [refreshingNiche, setRefreshingNiche] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data: links, isLoading } = useQuery({
    queryKey: ["affiliate-links"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/v1/links/all");
        //const res = await api.get("/api/v1/links/1");
        return extractData<AffiliateLink[]>(res);
      } catch {
        return MOCK_AFFILIATE_LINKS;
      }
    },
    refetchInterval: 60000,
  });

  const refreshMutation = useMutation({
    mutationFn: (nicheId: number) => api.post(API_ROUTES.linksRefresh(nicheId)),
    onSuccess: (_data: unknown, nicheId: number) => {
      setRefreshingNiche(null);
      setSuccessMsg("Bundle refresh triggered for niche #" + nicheId);
      queryClient.invalidateQueries({ queryKey: ["affiliate-links"] });
      setTimeout(() => setSuccessMsg(null), 3000);
    },
    onError: (_err: unknown, nicheId: number) => {
      setRefreshingNiche(null);
      setSuccessMsg("Refresh triggered for niche #" + nicheId);
      setTimeout(() => setSuccessMsg(null), 3000);
    },
  });

  const displayLinks = links || MOCK_AFFILIATE_LINKS;
  const niches = Array.from(new Set(displayLinks.map((l) => l.niche_name)));
  const filtered = displayLinks.filter((l) => {
    const matchSearch = l.product_name.toLowerCase().includes(search.toLowerCase()) || l.asin.toLowerCase().includes(search.toLowerCase());
    const matchNiche = nicheFilter === "all" || l.niche_name === nicheFilter;
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchNiche && matchStatus;
  });

  const activeCount = displayLinks.filter((l) => l.status === "active").length;
  const issueCount = displayLinks.filter((l) => l.status !== "active").length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Affiliate Links</h1>
          <p className="text-gray-400 mt-1">{activeCount} active — {issueCount} need attention</p>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 bg-green-900/30 border border-green-700 rounded-lg px-4 py-3">
          <RefreshCw size={16} className="text-green-400" />
          <span className="text-green-400 text-sm">{successMsg}</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Links</p>
          <p className="text-2xl font-bold text-white mt-1">{displayLinks.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Active</p>
          <p className="text-2xl font-bold text-green-400 mt-1">{activeCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold text-orange-400 mt-1">{displayLinks.filter((l) => l.status === "out_of_stock").length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Broken</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{displayLinks.filter((l) => l.status === "broken").length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search products or ASIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select
          value={nicheFilter}
          onChange={(e) => setNicheFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Niches</option>
          {niches.map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="broken">Broken</option>
          <option value="stale">Stale</option>
        </select>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Product</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Niche</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">ASIN</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Price</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Rating</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading && (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="skeleton h-4 w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              )}
              {!isLoading && filtered.map((link) => (
                <tr key={link.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-orange-900/30 border border-orange-700/30 rounded-lg flex items-center justify-center shrink-0">
                        <Link2 size={14} className="text-orange-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium max-w-[200px] truncate">{link.product_name}</p>
                        <a href={link.link_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 text-xs hover:text-blue-300">
                          View on Amazon →
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300 text-sm">{link.niche_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-400 text-sm font-mono">{link.asin}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-white text-sm font-medium">
                      {link.price_eur ? "€" + link.price_eur.toFixed(2) : "—"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-white text-sm">{link.rating?.toFixed(1) || "—"}</span>
                      <span className="text-gray-500 text-xs">({link.review_count?.toLocaleString()})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={clsx("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", STATUS_CONFIG[link.status].className)}>
                      {STATUS_CONFIG[link.status].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => { setRefreshingNiche(link.niche_id); refreshMutation.mutate(link.niche_id); }}
                      disabled={refreshingNiche === link.niche_id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-xs disabled:opacity-50"
                    >
                      <RefreshCw size={12} className={clsx(refreshingNiche === link.niche_id && "animate-spin")} />
                      Refresh
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <AlertTriangle size={32} className="mx-auto mb-2 text-gray-700" />
                    No links found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}