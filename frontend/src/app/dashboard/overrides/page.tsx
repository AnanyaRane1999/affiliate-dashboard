"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { API_ROUTES, MOCK_NICHES, MOCK_CAMPAIGNS } from "@/lib/mock-data";
import { Niche, Campaign } from "@/types";
import { ShieldAlert, Pause, Play, AlertTriangle, CheckCircle } from "lucide-react";
import { clsx } from "clsx";

export default function OverridesPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

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
  });

  const { data: campaigns } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.campaigns);
        return extractData<Campaign[]>(res);
      } catch {
        return MOCK_CAMPAIGNS;
      }
    },
  });

  const pauseAllMutation = useMutation({
    mutationFn: () => api.post(API_ROUTES.pauseAll),
    onSuccess: () => {
      setShowConfirm(false);
      setActionMsg("All campaigns paused successfully!");
      setTimeout(() => setActionMsg(null), 4000);
    },
    onError: () => {
      setShowConfirm(false);
      setActionMsg("Pause All triggered (mock mode)");
      setTimeout(() => setActionMsg(null), 4000);
    },
  });

  const pauseCampaignMutation = useMutation({
    mutationFn: (id: number) => api.post(API_ROUTES.campaignPause(id)),
    onSuccess: () => {
      setActionMsg("Campaign paused!");
      setTimeout(() => setActionMsg(null), 3000);
    },
    onError: () => {
      setActionMsg("Pause triggered (mock mode)");
      setTimeout(() => setActionMsg(null), 3000);
    },
  });

  const resumeCampaignMutation = useMutation({
    mutationFn: (id: number) => api.post(API_ROUTES.campaignResume(id)),
    onSuccess: () => {
      setActionMsg("Campaign resumed!");
      setTimeout(() => setActionMsg(null), 3000);
    },
    onError: () => {
      setActionMsg("Resume triggered (mock mode)");
      setTimeout(() => setActionMsg(null), 3000);
    },
  });

  const displayNiches = niches || MOCK_NICHES;
  const displayCampaigns = campaigns || MOCK_CAMPAIGNS;
  const activeCampaigns = displayCampaigns.filter((c) => c.status === "active").length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Manual Override</h1>
        <p className="text-gray-400 mt-1">
          Emergency controls — pause any campaign, niche, or all agents instantly
        </p>
      </div>

      {actionMsg && (
        <div className="flex items-center gap-2 bg-green-900/30 border border-green-700 rounded-lg px-4 py-3">
          <CheckCircle size={16} className="text-green-400" />
          <span className="text-green-400 text-sm">{actionMsg}</span>
        </div>
      )}

      {/* Emergency Stop */}
      <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldAlert size={20} className="text-red-400" />
              <h2 className="text-red-400 font-bold text-lg">Emergency Stop</h2>
            </div>
            <p className="text-gray-400 text-sm">
              Immediately pause ALL active campaigns across all niches.
              Currently {activeCampaigns} active campaigns running.
            </p>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-medium shrink-0"
          >
            <Pause size={16} />
            Pause All
          </button>
        </div>
      </div>

      {/* Campaign Controls */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
          <ShieldAlert size={16} className="text-blue-400" />
          <span className="text-white font-medium">Campaign Controls</span>
          <span className="ml-auto text-gray-500 text-sm">{displayCampaigns.length} campaigns</span>
        </div>
        <div className="divide-y divide-gray-800">
          {displayCampaigns.map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-white text-sm font-medium">{campaign.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">{campaign.niche_name} — €{campaign.daily_budget}/day</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={clsx(
                  "text-xs px-2 py-0.5 rounded-full border",
                  campaign.status === "active"
                    ? "bg-green-900/50 text-green-400 border-green-700"
                    : "bg-yellow-900/50 text-yellow-400 border-yellow-700"
                )}>
                  {campaign.status}
                </span>
                {campaign.status === "active" ? (
                  <button
                    onClick={() => pauseCampaignMutation.mutate(campaign.id)}
                    disabled={pauseCampaignMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-900/30 border border-yellow-700 text-yellow-400 rounded-lg hover:bg-yellow-900/50 transition-colors text-xs"
                  >
                    <Pause size={12} />
                    Pause
                  </button>
                ) : (
                  <button
                    onClick={() => resumeCampaignMutation.mutate(campaign.id)}
                    disabled={resumeCampaignMutation.isPending}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-900/30 border border-green-700 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors text-xs"
                  >
                    <Play size={12} />
                    Resume
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Niche Controls */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
          <ShieldAlert size={16} className="text-blue-400" />
          <span className="text-white font-medium">Niche Controls</span>
          <span className="ml-auto text-gray-500 text-sm">{displayNiches.length} niches</span>
        </div>
        <div className="divide-y divide-gray-800">
          {displayNiches.slice(0, 6).map((niche) => (
            <div key={niche.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-white text-sm font-medium">{niche.name}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Score: {niche.score?.toFixed(1) || "—"} — Budget: €{niche.recommended_budget || 0}/month
                </p>
              </div>
              <span className={clsx(
                "text-xs px-2 py-0.5 rounded-full border",
                niche.status === "live"
                  ? "bg-green-900/50 text-green-400 border-green-700"
                  : niche.status === "paused"
                  ? "bg-yellow-900/50 text-yellow-400 border-yellow-700"
                  : "bg-gray-700/50 text-gray-400 border-gray-600"
              )}>
                {niche.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-red-700 rounded-xl p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-400" />
              <h3 className="text-white font-bold text-lg">Confirm Pause All</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">
              This will immediately pause ALL {activeCampaigns} active campaigns across all niches.
              This action can be reversed by resuming campaigns individually.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => pauseAllMutation.mutate()}
                disabled={pauseAllMutation.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Pause size={14} />
                Yes, Pause All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}