"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { API_ROUTES } from "@/lib/mock-data";
import { ShieldAlert, Pause, Play, AlertTriangle, CheckCircle } from "lucide-react";
import { clsx } from "clsx";

export default function OverridePage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const { data: campaigns } = useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.campaigns);
      return extractData<any[]>(res);
    },
  });

  const { data: niches } = useQuery({
    queryKey: ["niches"],
    queryFn: async () => {
      const res = await api.get(API_ROUTES.niches);
      return extractData<any[]>(res);
    },
  });

  const pauseAllMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(API_ROUTES.pauseAll);
      return res.data;
    },
    onSuccess: (data) => {
      setShowConfirm(false);
      setSuccessMsg(`Successfully paused ${data.data?.campaigns_paused || 0} campaign(s).`);
      setTimeout(() => setSuccessMsg(null), 5000);
    },
  });

  const runControllerMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(API_ROUTES.runController);
      return res.data;
    },
    onSuccess: () => {
      setSuccessMsg("Controller Agent triggered — checking system health now.");
      setTimeout(() => setSuccessMsg(null), 5000);
    },
  });

  const activeCampaigns = campaigns?.filter((c: any) => c.status === "active") || [];
  const liveNiches = niches?.filter((n: any) => n.status === "live") || [];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Manual Override</h1>
        <p className="text-gray-400 mt-1">
          Emergency controls — pause campaigns and trigger agents manually
        </p>
      </div>

      {/* Success message */}
      {successMsg && (
        <div className="flex items-center gap-3 bg-green-900/20 border border-green-700/50 rounded-xl px-5 py-4">
          <CheckCircle size={16} className="text-green-400" />
          <p className="text-green-400 text-sm">{successMsg}</p>
        </div>
      )}

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-2">Active Campaigns</p>
          <p className="text-2xl font-bold text-white">{activeCampaigns.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-2">Live Niches</p>
          <p className="text-2xl font-bold text-white">{liveNiches.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <p className="text-gray-400 text-sm mb-2">Platform Status</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <p className="text-green-400 font-medium">Running</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Pause All */}
        <div className="bg-gray-900 border border-red-900/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-900/30 border border-red-700/50 rounded-lg">
              <Pause size={18} className="text-red-400" />
            </div>
            <div>
              <p className="text-white font-medium">Pause All Campaigns</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Immediately pause all {activeCampaigns.length} active Google Ads campaigns
              </p>
            </div>
          </div>
          {!showConfirm ? (
            <button
              onClick={() => setShowConfirm(true)}
              disabled={activeCampaigns.length === 0}
              className={clsx(
                "w-full mt-4 py-2.5 rounded-lg font-medium text-sm transition-colors",
                activeCampaigns.length > 0
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-gray-700 text-gray-500 cursor-not-allowed"
              )}
            >
              {activeCampaigns.length === 0 ? "No active campaigns" : "Pause All Campaigns"}
            </button>
          ) : (
            <div className="mt-4 space-y-2">
              <p className="text-yellow-400 text-xs flex items-center gap-2">
                <AlertTriangle size={12} />
                Are you sure? This will pause all active campaigns immediately.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => pauseAllMutation.mutate()}
                  disabled={pauseAllMutation.isPending}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  {pauseAllMutation.isPending ? "Pausing..." : "Yes, Pause All"}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Run Controller */}
        <div className="bg-gray-900 border border-blue-900/50 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-900/30 border border-blue-700/50 rounded-lg">
              <Play size={18} className="text-blue-400" />
            </div>
            <div>
              <p className="text-white font-medium">Run Controller Now</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Manually trigger the Controller Agent to assess system health
              </p>
            </div>
          </div>
          <button
            onClick={() => runControllerMutation.mutate()}
            disabled={runControllerMutation.isPending}
            className="w-full mt-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            {runControllerMutation.isPending ? "Running..." : "Run Controller Agent"}
          </button>
        </div>

      </div>

      {/* Warning */}
      <div className="flex items-start gap-3 bg-yellow-900/20 border border-yellow-700/50 rounded-xl px-5 py-4">
        <AlertTriangle size={16} className="text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-yellow-400 text-sm">
          Manual overrides affect live campaigns immediately. Use with caution.
          The Controller Agent will automatically resume normal operations on its next scheduled run.
        </p>
      </div>
    </div>
  );
}