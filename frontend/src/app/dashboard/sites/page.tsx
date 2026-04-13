"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { Site } from "@/types";
import { Globe, ExternalLink, RefreshCw, Eye, FileText, Clock, AlertTriangle } from "lucide-react";
import { clsx } from "clsx";

const MOCK_SITES: Site[] = [
  { id: 1, niche_id: 1, niche_name: "Kitesurfen", subdomain: "kitesurfen.starterkit.de", status: "live", page_count: 5, last_published: "2026-03-26T10:00:00Z", traffic_30d: 1240, created_at: "2026-03-20T00:00:00Z" },
  { id: 2, niche_id: 2, niche_name: "Camping Anfänger", subdomain: "camping.starterkit.de", status: "live", page_count: 4, last_published: "2026-03-25T10:00:00Z", traffic_30d: 980, created_at: "2026-03-20T00:00:00Z" },
  { id: 3, niche_id: 3, niche_name: "Fotografie", subdomain: "fotografie.starterkit.de", status: "building", page_count: 2, last_published: null, traffic_30d: 0, created_at: "2026-03-26T00:00:00Z" },
];

const STATUS_CONFIG = {
  live:     { label: "Live",           className: "bg-green-900/50 text-green-400 border border-green-700" },
  draft:    { label: "Entwurf",        className: "bg-gray-700/50 text-gray-400 border border-gray-600" },
  building: { label: "Im Aufbau",      className: "bg-yellow-900/50 text-yellow-400 border border-yellow-700" },
  failed:   { label: "Fehlgeschlagen", className: "bg-red-900/50 text-red-400 border border-red-700" },
};

export default function SitesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [regeneratingId, setRegeneratingId] = useState<number | null>(null);

  const { data: sites, isLoading, isError, refetch } = useQuery({
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
    refetchInterval: 30000,
  });

  const regenerateMutation = useMutation({
    mutationFn: (nicheId: number) => api.post("/api/v1/niches/" + nicheId + "/build"),
    onSuccess: (_data: unknown, nicheId: number) => {
      setRegeneratingId(null);
      setActionMsg("Regeneration triggered for niche #" + nicheId);
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      setTimeout(() => setActionMsg(null), 3000);
    },
    onError: (_err: unknown, nicheId: number) => {
      setRegeneratingId(null);
      setActionMsg("Regeneration triggered (mock mode) for niche #" + nicheId);
      setTimeout(() => setActionMsg(null), 3000);
    },
  });

  const displaySites = sites || [];

  const filtered = displaySites.filter((s) => {
    const name = s.niche_name || "";
    const sub = s.subdomain || "";
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      sub.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const liveSites = displaySites.filter((s) => s.status === "live").length;
  const totalTraffic = displaySites.reduce((a, s) => a + (s.traffic_30d || 0), 0);

  function formatDate(ts: string | null) {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("de-DE", {
      day: "2-digit", month: "2-digit", year: "numeric",
    });
  }

  return (
    <div className="flex flex-col gap-4 p-1">

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-white">Webseiten</h1>
          <p className="text-gray-400 mt-0.5 text-xs sm:text-sm">
            {liveSites} live &mdash; {totalTraffic.toLocaleString()} Traffic (30T)
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-xs shrink-0"
        >
          <RefreshCw size={12} />
          <span className="hidden sm:inline">Aktualisieren</span>
          <span className="sm:hidden">↻</span>
        </button>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div className="flex items-center gap-2 bg-blue-900/30 border border-blue-700 rounded-lg px-3 py-2">
          <RefreshCw size={14} className="text-blue-400 shrink-0" />
          <span className="text-blue-400 text-xs">{actionMsg}</span>
        </div>
      )}

      {/* Stats grid — 2x2 on mobile, 4 cols on md+ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs">Gesamt</p>
          <p className="text-2xl font-bold text-white mt-0.5">{displaySites.length}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs">Live</p>
          <p className="text-2xl font-bold text-green-400 mt-0.5">{liveSites}</p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs">Im Aufbau</p>
          <p className="text-2xl font-bold text-yellow-400 mt-0.5">
            {displaySites.filter((s) => s.status === "building").length}
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-3 sm:p-4">
          <p className="text-gray-400 text-xs">Traffic (30T)</p>
          <p className="text-2xl font-bold text-white mt-0.5">{totalTraffic.toLocaleString()}</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Webseiten suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        {/* Filter buttons — scrollable row on mobile */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {["all", "live", "building", "draft", "failed"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0",
                statusFilter === f
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700"
              )}
            >
              {f === "all" ? "Alle" : STATUS_CONFIG[f as keyof typeof STATUS_CONFIG]?.label || f}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {isError && (
        <div className="text-center py-10 text-red-400">
          <AlertTriangle size={28} className="mx-auto mb-2" />
          <p className="text-sm">Fehler beim Laden.</p>
        </div>
      )}

      {/* Loading skeletons */}
      {isLoading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
              <div className="skeleton h-4 w-40 mb-2" />
              <div className="skeleton h-3 w-full mb-1.5" />
              <div className="skeleton h-3 w-28" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          <AlertTriangle size={28} className="mx-auto mb-2 text-gray-700" />
          <p className="text-sm">Keine Webseiten gefunden.</p>
        </div>
      )}

      {/* Site cards */}
      {!isLoading && !isError && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtered.map((site) => {
            const isRegenerating = regeneratingId === site.niche_id;
            const config = STATUS_CONFIG[site.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.draft;
            const previewUrl = "https://" + (site.subdomain || "");
            return (
              <div key={site.id} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-colors">

                {/* Top row: icon + name + badge */}
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 bg-blue-900/30 border border-blue-700/30 rounded-lg flex items-center justify-center shrink-0">
                    <Globe size={15} className="text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-semibold text-sm leading-tight truncate">{site.niche_name}</h3>
                    <p className="text-gray-500 text-xs truncate">{site.subdomain}</p>
                  </div>
                  <span className={clsx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium shrink-0", config.className)}>
                    {config.label}
                  </span>
                </div>

                {/* Stats row */}
                <div className="flex items-center gap-3 flex-wrap mb-3">
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <FileText size={11} />
                    <span>{site.page_count} Seiten</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} />
                    <span>{formatDate(site.last_published)}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Eye size={11} />
                    <span>{(site.traffic_30d || 0).toLocaleString()}</span>
                  </div>
                </div>

                {/* Action buttons — full width on mobile */}
                <div className="flex gap-2">
                  {site.status === "live" && site.subdomain && (
                    <a
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-900/30 border border-blue-700 text-blue-400 rounded-lg hover:bg-blue-900/50 transition-colors text-xs"
                    >
                      <ExternalLink size={11} />
                      Vorschau
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setRegeneratingId(site.niche_id);
                      regenerateMutation.mutate(site.niche_id);
                    }}
                    disabled={isRegenerating}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors text-xs disabled:opacity-50"
                  >
                    <RefreshCw size={11} className={clsx(isRegenerating && "animate-spin")} />
                    {isRegenerating ? "Läuft..." : "Neu generieren"}
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
