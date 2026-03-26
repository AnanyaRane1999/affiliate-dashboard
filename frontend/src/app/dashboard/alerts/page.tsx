"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import api, { extractData } from "@/services/api";
import { Alert, AlertSeverity } from "@/types";
import { API_ROUTES } from "@/lib/mock-data";
import { Bell, CheckCircle, AlertTriangle, AlertOctagon, Info } from "lucide-react";
import { clsx } from "clsx";

const MOCK_ALERTS: Alert[] = [
  { id: 1, type: "spend_spike", message: "Camping Anfänger campaign CPC exceeded €2.50 threshold", severity: "critical", resolved: false, created_at: "2026-03-26T09:30:00Z" },
  { id: 2, type: "tracking_failure", message: "GA4 tracking not firing on kitesurfen.starterkit.de/starter-kit", severity: "warning", resolved: false, created_at: "2026-03-26T08:15:00Z" },
  { id: 3, type: "link_broken", message: "2 affiliate links returning 404 on Camping niche", severity: "warning", resolved: false, created_at: "2026-03-26T07:00:00Z" },
  { id: 4, type: "budget_low", message: "Kitesurfen niche budget is 80% consumed this month", severity: "info", resolved: false, created_at: "2026-03-25T18:00:00Z" },
  { id: 5, type: "agent_error", message: "Research Agent failed to connect to SerpAPI — retrying", severity: "warning", resolved: true, created_at: "2026-03-25T12:00:00Z" },
];

const SEVERITY_CONFIG: Record<AlertSeverity, { label: string; className: string; icon: React.ElementType; bg: string }> = {
  critical: { label: "Critical", className: "text-red-400 border-red-700",    icon: AlertOctagon,  bg: "bg-red-900/20 border-red-700/50" },
  warning:  { label: "Warning",  className: "text-yellow-400 border-yellow-700", icon: AlertTriangle, bg: "bg-yellow-900/20 border-yellow-700/50" },
  info:     { label: "Info",     className: "text-blue-400 border-blue-700",   icon: Info,          bg: "bg-blue-900/20 border-blue-700/50" },
};

export default function AlertsPage() {
  const queryClient = useQueryClient();
  const [severityFilter, setSeverityFilter] = useState<AlertSeverity | "all">("all");
  const [showResolved, setShowResolved] = useState(false);

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["alerts"],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.alerts);
        return extractData<Alert[]>(res);
      } catch {
        return MOCK_ALERTS;
      }
    },
    refetchInterval: 10000,
  });

  const resolveMutation = useMutation({
    mutationFn: (id: number) => api.patch(API_ROUTES.alertResolve(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const displayAlerts = alerts || MOCK_ALERTS;
  const filtered = displayAlerts.filter((a) => {
    const matchSeverity = severityFilter === "all" || a.severity === severityFilter;
    const matchResolved = showResolved ? true : !a.resolved;
    return matchSeverity && matchResolved;
  });

  const criticalCount = displayAlerts.filter((a) => a.severity === "critical" && !a.resolved).length;
  const warningCount = displayAlerts.filter((a) => a.severity === "warning" && !a.resolved).length;
  const unresolvedCount = displayAlerts.filter((a) => !a.resolved).length;

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
          <h1 className="text-2xl font-bold text-white">Alerts</h1>
          <p className="text-gray-400 mt-1">
            {unresolvedCount} unresolved — {criticalCount} critical
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 status-pulse" />
          <span className="text-gray-400 text-xs">Auto-refresh 10s</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-900/20 border border-red-700/50 rounded-xl p-4">
          <p className="text-red-400 text-sm">Critical</p>
          <p className="text-2xl font-bold text-red-400 mt-1">{criticalCount}</p>
        </div>
        <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-xl p-4">
          <p className="text-yellow-400 text-sm">Warnings</p>
          <p className="text-2xl font-bold text-yellow-400 mt-1">{warningCount}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Total Unresolved</p>
          <p className="text-2xl font-bold text-white mt-1">{unresolvedCount}</p>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        {(["all", "critical", "warning", "info"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setSeverityFilter(f)}
            className={clsx(
              "px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors",
              severityFilter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            )}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
        <button
          onClick={() => setShowResolved(!showResolved)}
          className={clsx(
            "px-3 py-2 rounded-lg text-xs font-medium transition-colors ml-auto",
            showResolved
              ? "bg-gray-600 text-white"
              : "bg-gray-800 text-gray-400 hover:bg-gray-700"
          )}
        >
          {showResolved ? "Hide Resolved" : "Show Resolved"}
        </button>
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
          <Bell size={16} className="text-blue-400" />
          <span className="text-white font-medium">Alert Feed</span>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <CheckCircle size={32} className="mx-auto mb-2 text-green-700" />
            <p>No alerts found! All clear.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {filtered.map((alert) => {
              const config = SEVERITY_CONFIG[alert.severity];
              const Icon = config.icon;
              return (
                <div
                  key={alert.id}
                  className={clsx(
                    "flex items-start gap-4 px-6 py-4 transition-colors",
                    alert.resolved ? "opacity-50" : "hover:bg-gray-800/30"
                  )}
                >
                  <div className={clsx("p-2 rounded-lg border mt-0.5 shrink-0", config.bg)}>
                    <Icon size={16} className={config.className.split(" ")[0]} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={clsx(
                        "text-xs font-medium px-2 py-0.5 rounded-full border",
                        config.className
                      )}>
                        {config.label}
                      </span>
                      <span className="text-gray-500 text-xs">{alert.type.replace(/_/g, " ")}</span>
                      {alert.resolved && (
                        <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">
                          Resolved
                        </span>
                      )}
                    </div>
                    <p className="text-white text-sm">{alert.message}</p>
                    <p className="text-gray-500 text-xs mt-1">{formatTime(alert.created_at)}</p>
                  </div>

                  {!alert.resolved && (
                    <button
                      onClick={() => resolveMutation.mutate(alert.id)}
                      disabled={resolveMutation.isPending}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-xs shrink-0 disabled:opacity-50"
                    >
                      <CheckCircle size={12} />
                      Resolve
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}