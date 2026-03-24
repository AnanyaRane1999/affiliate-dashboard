"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MOCK_BUSINESS_CASE, MOCK_NICHES } from "@/lib/mock-data";
import StatusBadge from "@/components/shared/StatusBadge";
import { NicheStatus } from "@/types";
import { ArrowLeft, CheckCircle, XCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function BusinessCasePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<"approve" | "reject" | null>(null);
  const [actionDone, setActionDone] = useState<"approved" | "rejected" | null>(null);

  const niche = MOCK_NICHES.find((n) => n.id === parseInt(params.id)) || MOCK_NICHES[0];
  const bc = MOCK_BUSINESS_CASE;

  function handleAction(action: "approve" | "reject") {
    setModalAction(action);
    setShowModal(true);
  }

  function confirmAction() {
    // When Varun's API is ready, replace this with:
    // await api.post(`/niches/${niche.id}/${modalAction === "approve" ? "approve" : "reject"}`)
    setActionDone(modalAction === "approve" ? "approved" : "rejected");
    setShowModal(false);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{niche.name}</h1>
            <StatusBadge status={niche.status as NicheStatus} />
          </div>
          <p className="text-gray-400 mt-1">Business Case Analysis</p>
        </div>

        {/* Approve / Reject buttons */}
        {!actionDone && (
          <div className="flex gap-3">
            <button
              onClick={() => handleAction("reject")}
              className="flex items-center gap-2 px-4 py-2 bg-red-900/30 border border-red-700 text-red-400 rounded-lg hover:bg-red-900/50 transition-colors"
            >
              <XCircle size={16} />
              Reject
            </button>
            <button
              onClick={() => handleAction("approve")}
              className="flex items-center gap-2 px-4 py-2 bg-green-900/30 border border-green-700 text-green-400 rounded-lg hover:bg-green-900/50 transition-colors"
            >
              <CheckCircle size={16} />
              Approve
            </button>
          </div>
        )}

        {/* Action done message */}
        {actionDone && (
          <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
            actionDone === "approved"
              ? "bg-green-900/30 border border-green-700 text-green-400"
              : "bg-red-900/30 border border-red-700 text-red-400"
          }`}>
            {actionDone === "approved" ? "✅ Niche Approved!" : "❌ Niche Rejected"}
          </div>
        )}
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "CAC", value: `€${bc.cac}`, sub: "Cost to acquire customer" },
          { label: "LTV", value: `€${bc.ltv}`, sub: "Lifetime value" },
          { label: "Margin", value: `${(bc.contribution_margin * 100).toFixed(0)}%`, sub: "Contribution margin" },
          { label: "Payback", value: `${bc.payback_period_days}d`, sub: "Break even period" },
        ].map((m) => (
          <div key={m.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">{m.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{m.value}</p>
            <p className="text-gray-500 text-xs mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Scenarios */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Best Case */}
        <div className="bg-gray-900 border border-green-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-green-400" />
            <h3 className="text-green-400 font-semibold">Best Case</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Monthly Revenue</span>
              <span className="text-white font-medium">€{bc.scenarios.best.monthly_revenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Monthly Spend</span>
              <span className="text-white font-medium">€{bc.scenarios.best.monthly_spend}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">ROI</span>
              <span className="text-green-400 font-bold">{bc.scenarios.best.roi}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Break Even</span>
              <span className="text-white font-medium">{bc.scenarios.best.break_even_days} days</span>
            </div>
          </div>
        </div>

        {/* Base Case */}
        <div className="bg-gray-900 border border-blue-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Minus size={18} className="text-blue-400" />
            <h3 className="text-blue-400 font-semibold">Base Case</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Monthly Revenue</span>
              <span className="text-white font-medium">€{bc.scenarios.base.monthly_revenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Monthly Spend</span>
              <span className="text-white font-medium">€{bc.scenarios.base.monthly_spend}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">ROI</span>
              <span className="text-blue-400 font-bold">{bc.scenarios.base.roi}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Break Even</span>
              <span className="text-white font-medium">{bc.scenarios.base.break_even_days} days</span>
            </div>
          </div>
        </div>

        {/* Worst Case */}
        <div className="bg-gray-900 border border-red-800/50 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingDown size={18} className="text-red-400" />
            <h3 className="text-red-400 font-semibold">Worst Case</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Monthly Revenue</span>
              <span className="text-white font-medium">€{bc.scenarios.worst.monthly_revenue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Monthly Spend</span>
              <span className="text-white font-medium">€{bc.scenarios.worst.monthly_spend}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">ROI</span>
              <span className="text-red-400 font-bold">{bc.scenarios.worst.roi}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-sm">Break Even</span>
              <span className="text-white font-medium">{bc.scenarios.worst.break_even_days} days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`border rounded-xl p-5 ${
        bc.go_no_go
          ? "bg-green-900/20 border-green-700"
          : "bg-red-900/20 border-red-700"
      }`}>
        <div className="flex items-center gap-3">
          {bc.go_no_go
            ? <CheckCircle size={24} className="text-green-400" />
            : <XCircle size={24} className="text-red-400" />
          }
          <div>
            <p className={`font-bold text-lg ${bc.go_no_go ? "text-green-400" : "text-red-400"}`}>
              {bc.go_no_go ? "GO — Recommended to Launch" : "NO GO — Not Recommended"}
            </p>
            <p className="text-gray-400 text-sm mt-0.5">
              Recommended monthly budget: <span className="text-white font-medium">€{bc.recommended_budget}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-white font-bold text-lg mb-2">
              {modalAction === "approve" ? "Approve Niche?" : "Reject Niche?"}
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              You are about to <strong className="text-white">{modalAction}</strong> the niche{" "}
              <strong className="text-white">{niche.name}</strong> with a recommended budget of{" "}
              <strong className="text-white">€{bc.recommended_budget}/month</strong>.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  modalAction === "approve"
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : "bg-red-600 hover:bg-red-500 text-white"
                }`}
              >
                {modalAction === "approve" ? "Yes, Approve" : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}