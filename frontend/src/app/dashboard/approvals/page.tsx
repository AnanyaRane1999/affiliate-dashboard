"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api, { extractData } from "@/services/api";
import { ApprovalItem } from "@/types";
import { API_ROUTES } from "@/lib/mock-data";
import { ClipboardCheck, CheckCircle, XCircle, Clock } from "lucide-react";
import { clsx } from "clsx";

const MOCK_APPROVALS: ApprovalItem[] = [
  {
    id: 1, type: "niche_launch", niche_id: 4, niche_name: "Yoga Einsteiger",
    description: "Launch new niche — Yoga Einsteiger with budget €100/month",
    details: { score: 7.2, recommended_budget: 100, go_no_go: true },
    created_at: "2026-03-26T09:00:00Z",
  },
  {
    id: 2, type: "budget_change", niche_id: 1, niche_name: "Kitesurfen",
    description: "Increase monthly budget from €150 to €200 — ROAS performing at 3.8x",
    details: { current_budget: 150, proposed_budget: 200, roas: 3.8 },
    created_at: "2026-03-26T08:30:00Z",
  },
  {
    id: 3, type: "site_publish", niche_id: 3, niche_name: "Fotografie",
    description: "Publish Fotografie site — 5 pages generated, quality check passed",
    details: { page_count: 5, quality_score: 8.9 },
    created_at: "2026-03-26T07:45:00Z",
  },
];

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
  niche_launch:   { label: "Niche Launch",   className: "bg-blue-900/50 text-blue-400 border border-blue-700" },
  budget_change:  { label: "Budget Change",  className: "bg-yellow-900/50 text-yellow-400 border border-yellow-700" },
  site_publish:   { label: "Site Publish",   className: "bg-purple-900/50 text-purple-400 border border-purple-700" },
  campaign_create:{ label: "New Campaign",   className: "bg-green-900/50 text-green-400 border border-green-700" },
};

export default function ApprovalsPage() {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const { data: approvals, isLoading } = useQuery({
    queryKey: ["approvals"],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.approvals);
        return extractData<ApprovalItem[]>(res);
      } catch {
        return MOCK_APPROVALS;
      }
    },
    refetchInterval: 15000,
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => api.post(API_ROUTES.approvalApprove(id)),
    onSuccess: (_data, id) => {
      setProcessingId(null);
      setActionMsg("Action approved successfully!");
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      setTimeout(() => setActionMsg(null), 3000);
    },
    onError: (_err, id) => {
      setProcessingId(null);
      setActionMsg("Approved (mock mode)");
      setTimeout(() => setActionMsg(null), 3000);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (id: number) => api.post(API_ROUTES.approvalReject(id)),
    onSuccess: () => {
      setProcessingId(null);
      setActionMsg("Action rejected.");
      queryClient.invalidateQueries({ queryKey: ["approvals"] });
      setTimeout(() => setActionMsg(null), 3000);
    },
    onError: () => {
      setProcessingId(null);
      setActionMsg("Rejected (mock mode)");
      setTimeout(() => setActionMsg(null), 3000);
    },
  });

  const displayApprovals = approvals || MOCK_APPROVALS;

  function formatTime(ts: string) {
    return new Date(ts).toLocaleString("de-DE", {
      day: "2-digit", month: "2-digit",
      hour: "2-digit", minute: "2-digit",
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Approval Queue</h1>
          <p className="text-gray-400 mt-1">
            {displayApprovals.length} actions pending your approval
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-yellow-400" />
          <span className="text-yellow-400 text-sm font-medium">
            {displayApprovals.length} pending
          </span>
        </div>
      </div>

      {actionMsg && (
        <div className="flex items-center gap-2 bg-blue-900/30 border border-blue-700 rounded-lg px-4 py-3">
          <CheckCircle size={16} className="text-blue-400" />
          <span className="text-blue-400 text-sm">{actionMsg}</span>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <div className="skeleton h-5 w-48 mb-3" />
              <div className="skeleton h-4 w-full mb-2" />
              <div className="skeleton h-4 w-32" />
            </div>
          ))}
        </div>
      ) : displayApprovals.length === 0 ? (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
          <ClipboardCheck size={40} className="text-green-600 mx-auto mb-3" />
          <p className="text-white font-medium">All caught up!</p>
          <p className="text-gray-500 text-sm mt-1">No pending approvals.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {displayApprovals.map((item) => {
            const typeConfig = TYPE_CONFIG[item.type] || TYPE_CONFIG.niche_launch;
            const isProcessing = processingId === item.id;
            return (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={clsx(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        typeConfig.className
                      )}>
                        {typeConfig.label}
                      </span>
                      <span className="text-gray-500 text-xs">{item.niche_name}</span>
                      <span className="text-gray-600 text-xs ml-auto">{formatTime(item.created_at)}</span>
                    </div>
                    <p className="text-white text-sm font-medium mb-3">{item.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {Object.entries(item.details).map(([key, value]) => (
                        <div key={key} className="bg-gray-800 rounded-lg px-3 py-1.5">
                          <span className="text-gray-500 text-xs">{key.replace(/_/g, " ")}: </span>
                          <span className="text-white text-xs font-medium">
                            {typeof value === "number"
                              ? key.includes("budget") ? "€" + value : value
                              : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => { setProcessingId(item.id); rejectMutation.mutate(item.id); }}
                      disabled={isProcessing}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-900/30 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors text-sm disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Reject
                    </button>
                    <button
                      onClick={() => { setProcessingId(item.id); approveMutation.mutate(item.id); }}
                      disabled={isProcessing}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-900/30 border border-green-700 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors text-sm disabled:opacity-50"
                    >
                      <CheckCircle size={14} />
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}