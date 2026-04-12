"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { MOCK_CAMPAIGNS, API_ROUTES } from "@/lib/mock-data";
import { Campaign, CampaignStatus } from "@/types";
import { Megaphone, Pause, Play, AlertTriangle, TrendingUp } from "lucide-react";
import { clsx } from "clsx";

const STATUS_CONFIG: Record<CampaignStatus, { label: string; className: string }> = {
  active:  { label: "Active",  className: "bg-green-900/50 text-green-400 border border-green-700" },
  paused:  { label: "Paused",  className: "bg-yellow-900/50 text-yellow-400 border border-yellow-700" },
  draft:   { label: "Draft",   className: "bg-gray-700/50 text-gray-400 border border-gray-600" },
  ended:   { label: "Ended",   className: "bg-red-900/50 text-red-400 border border-red-700" },
};

export default function CampaignsPage() {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.campaigns);
        return extractData<Campaign[]>(res);
      } catch {
        return MOCK_CAMPAIGNS;
      }
    },
    refetchInterval: 30000,
  });

  const pauseMutation = useMutation({
    mutationFn: (id: number) => api.post(API_ROUTES.campaignPause(id)),
    onSuccess: () => {
      setActionMsg("Campaign paused successfully!");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setTimeout(() => setActionMsg(null), 3000);
    },
    onError: () => {
      setActionMsg("Pause triggered (mock mode)");
      setTimeout(() => setActionMsg(null), 3000);
    },
  });

  const resumeMutation = useMutation({
    mutationFn: (id: number) => api.post(API_ROUTES.campaignResume(id)),
    onSuccess: () => {
      setActionMsg("Campaign resumed successfully!");
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      setTimeout(() => setActionMsg(null), 3000);
    },
    onError: () => {
      setActionMsg("Resume triggered (mock mode)");
      setTimeout(() => setActionMsg(null), 3000);
    },
  });

  const displayCampaigns = campaigns || MOCK_CAMPAIGNS;
  const filtered = displayCampaigns.filter((c) =>
    statusFilter === "all" || c.status === statusFilter
  );

  const totalSpend = displayCampaigns.reduce((a, c) => a + c.spend_total, 0);
  const totalClicks = displayCampaigns.reduce((a, c) => a + c.clicks, 0);
  const activeCampaigns = displayCampaigns.filter((c) => c.status === "active").length;

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Campaigns</h1>
          <p className="text-gray-400 mt-0.5 text-sm">
            {activeCampaigns} active — €{totalSpend.toFixed(2)} total spend
          </p>
        </div>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div className="flex items-center gap-2 bg-blue-900/30 border border-blue-700 rounded-lg px-3 py-2">
          <TrendingUp size={14} className="text-blue-400 shrink-0" />
          <span className="text-blue-400 text-xs">{actionMsg}</span>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs">Total</p>
          <p className="text-2xl font-bold text-white mt-0.5">{displayCampaigns.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs">Active</p>
          <p className="text-2xl font-bold text-green-400 mt-0.5">{activeCampaigns}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs">Total Spend</p>
          <p className="text-2xl font-bold text-white mt-0.5">€{totalSpend.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs">Total Clicks</p>
          <p className="text-2xl font-bold text-white mt-0.5">{totalClicks.toLocaleString()}</p>
        </div>
      </div>

      {/* Filter buttons */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {["all", "active", "paused", "draft", "ended"].map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={clsx(
              "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors whitespace-nowrap shrink-0",
              statusFilter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table — scrollable on mobile */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="sm:hidden px-4 py-2 bg-gray-800/50 border-b border-gray-800">
          <span className="text-gray-500 text-xs">← Scroll sideways to see all columns →</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Campaign</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Budget/day</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Spend Today</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">CTR</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">CPC</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">ROAS</th>
                <th className="text-left text-xs font-medium text-gray-400 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {isLoading && (
                [...Array(3)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(8)].map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="skeleton h-4 w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              )}
              {!isLoading && filtered.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-purple-900/30 border border-purple-700/30 rounded-lg flex items-center justify-center shrink-0">
                        <Megaphone size={12} className="text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{campaign.name}</p>
                        <p className="text-gray-500 text-xs">{campaign.niche_name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx(
                      "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
                      STATUS_CONFIG[campaign.status].className
                    )}>
                      {STATUS_CONFIG[campaign.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3"><span className="text-white text-sm">€{campaign.daily_budget.toFixed(2)}</span></td>
                  <td className="px-4 py-3"><span className="text-white text-sm">€{campaign.spend_today.toFixed(2)}</span></td>
                  <td className="px-4 py-3"><span className="text-white text-sm">{(campaign.ctr * 100).toFixed(2)}%</span></td>
                  <td className="px-4 py-3">
                    <span className={clsx("text-sm font-medium", campaign.cpc > 1.5 ? "text-red-400" : "text-green-400")}>
                      €{campaign.cpc.toFixed(2)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={clsx("text-sm font-bold",
                      campaign.roas
                        ? campaign.roas >= 3 ? "text-green-400" : "text-yellow-400"
                        : "text-gray-500"
                    )}>
                      {campaign.roas ? campaign.roas.toFixed(1) + "x" : "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {campaign.status === "active" ? (
                      <button
                        onClick={() => pauseMutation.mutate(campaign.id)}
                        disabled={pauseMutation.isPending}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-yellow-900/30 border border-yellow-700 text-yellow-400 rounded-lg hover:bg-yellow-900/50 transition-colors text-xs disabled:opacity-50 whitespace-nowrap"
                      >
                        <Pause size={11} />
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={() => resumeMutation.mutate(campaign.id)}
                        disabled={resumeMutation.isPending}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-green-900/30 border border-green-700 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors text-xs disabled:opacity-50 whitespace-nowrap"
                      >
                        <Play size={11} />
                        Resume
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {!isLoading && filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-500">
                    <AlertTriangle size={28} className="mx-auto mb-2 text-gray-700" />
                    No campaigns found.
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