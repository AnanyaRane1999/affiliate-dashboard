"use client";

import { useQuery } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { MOCK_BUDGET_ALLOCATIONS } from "@/lib/mock-data";
import { BudgetAllocation } from "@/types";
import { Wallet, AlertTriangle, TrendingUp } from "lucide-react";
import { clsx } from "clsx";

export default function BudgetPage() {
  const { data: allocations, isLoading } = useQuery({
    queryKey: ["budget-allocations"],
    queryFn: async () => {
      try {
        const res = await api.get("/api/v1/budget-allocations");
        return extractData<BudgetAllocation[]>(res);
      } catch {
        return MOCK_BUDGET_ALLOCATIONS;
      }
    },
    refetchInterval: 30000,
  });

  const displayAllocations = allocations || MOCK_BUDGET_ALLOCATIONS;
  const totalAllocated = displayAllocations.reduce((a, b) => a + b.allocated, 0);
  const totalSpent = displayAllocations.reduce((a, b) => a + b.spent, 0);
  const totalRemaining = displayAllocations.reduce((a, b) => a + b.remaining, 0);
  const overallPct = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;

  function getBarColor(pct: number) {
    if (pct >= 95) return "bg-red-500";
    if (pct >= 80) return "bg-yellow-500";
    return "bg-blue-500";
  }

  function getWarningBadge(pct: number) {
    if (pct >= 95) return (
      <span className="text-xs bg-red-900/50 text-red-400 border border-red-700 px-2 py-0.5 rounded-full">
        Critical
      </span>
    );
    if (pct >= 80) return (
      <span className="text-xs bg-yellow-900/50 text-yellow-400 border border-yellow-700 px-2 py-0.5 rounded-full">
        Warning
      </span>
    );
    return (
      <span className="text-xs bg-green-900/50 text-green-400 border border-green-700 px-2 py-0.5 rounded-full">
        OK
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Budget Allocation</h1>
        <p className="text-gray-400 mt-1">
          €{totalSpent.toFixed(2)} spent of €{totalAllocated.toFixed(2)} total allocated
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-blue-400" />
            <p className="text-gray-400 text-sm">Total Allocated</p>
          </div>
          <p className="text-2xl font-bold text-white">€{totalAllocated.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-orange-400" />
            <p className="text-gray-400 text-sm">Total Spent</p>
          </div>
          <p className="text-2xl font-bold text-orange-400">€{totalSpent.toFixed(2)}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Wallet size={16} className="text-green-400" />
            <p className="text-gray-400 text-sm">Total Remaining</p>
          </div>
          <p className="text-2xl font-bold text-green-400">€{totalRemaining.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-white font-medium">Overall Budget Usage</p>
          <span className="text-white font-bold">{overallPct.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-3">
          <div
            className={clsx("h-3 rounded-full transition-all", getBarColor(overallPct))}
            style={{ width: `${Math.min(overallPct, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-gray-500 text-xs">€0</span>
          <span className="text-gray-500 text-xs">€{totalAllocated.toFixed(0)}</span>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="skeleton h-5 w-32 mb-3" />
              <div className="skeleton h-3 w-full mb-2" />
              <div className="skeleton h-4 w-24" />
            </div>
          ))
        ) : (
          displayAllocations.map((alloc) => (
            <div key={alloc.id} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-semibold">{alloc.niche_name}</h3>
                  {getWarningBadge(alloc.percentage_used)}
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">€{alloc.spent.toFixed(2)}</p>
                  <p className="text-gray-500 text-xs">of €{alloc.allocated.toFixed(2)}</p>
                </div>
              </div>

              <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
                <div
                  className={clsx("h-2.5 rounded-full transition-all", getBarColor(alloc.percentage_used))}
                  style={{ width: `${Math.min(alloc.percentage_used, 100)}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-500 text-xs">
                  {alloc.percentage_used.toFixed(1)}% used
                </span>
                <span className="text-green-400 text-xs font-medium">
                  €{alloc.remaining.toFixed(2)} remaining
                </span>
              </div>

              {alloc.percentage_used >= 80 && (
                <div className="flex items-center gap-2 mt-3 bg-yellow-900/20 border border-yellow-700/50 rounded-lg px-3 py-2">
                  <AlertTriangle size={14} className="text-yellow-400 shrink-0" />
                  <p className="text-yellow-400 text-xs">
                    {alloc.percentage_used >= 95
                      ? "Budget critically low! Consider increasing allocation."
                      : "Budget over 80% used. Monitor closely."}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}