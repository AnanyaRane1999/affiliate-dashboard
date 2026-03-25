"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api, { extractData } from "@/services/api";
import { MOCK_SITES, MOCK_PAGES, API_ROUTES } from "@/lib/mock-data";
import SiteStatusBadge from "@/components/shared/SiteStatusBadge";
import { Site, Page } from "@/types";
import {
  ArrowLeft, Globe, RefreshCw, Eye,
  CheckCircle, XCircle, FileText, Link2,
} from "lucide-react";
import { clsx } from "clsx";

const PAGE_TYPE_LABELS: Record<string, string> = {
  landing:       "Landing Page",
  beginner_guide: "Beginner Guide",
  starter_kit:   "Starter Kit",
  faq:           "FAQ",
  comparison:    "Comparison",
};

export default function SiteDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [previewPage, setPreviewPage] = useState<Page | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const siteId = parseInt(params.id);

  // Fetch site
  const { data: site } = useQuery({
    queryKey: ["site", siteId],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.sites);
        const sites = extractData<Site[]>(res);
        return sites.find((s) => s.id === siteId) || MOCK_SITES[0];
      } catch {
        return MOCK_SITES.find((s) => s.id === siteId) || MOCK_SITES[0];
      }
    },
  });

  // Fetch pages
  const { data: pages, isLoading: pagesLoading } = useQuery({
    queryKey: ["site-pages", siteId],
    queryFn: async () => {
      try {
        const res = await api.get(API_ROUTES.sitePages(siteId));
        return extractData<Page[]>(res);
      } catch {
        return MOCK_PAGES.filter((p) => p.niche_id === (site?.niche_id || 1));
      }
    },
    enabled: !!site,
  });

  // Publish mutation
  const publishMutation = useMutation({
    mutationFn: () => api.post(API_ROUTES.sitePublish(siteId)),
    onSuccess: () => {
      setActionMsg("Site publish triggered successfully!");
      queryClient.invalidateQueries({ queryKey: ["site", siteId] });
      setTimeout(() => setActionMsg(null), 3000);
    },
    onError: () => setActionMsg("Publish triggered (mock mode)"),
  });

  // Rebuild mutation
  const rebuildMutation = useMutation({
    mutationFn: () => api.post(`/api/v1/sites/${siteId}/rebuild`),
    onSuccess: () => {
      setActionMsg("Site rebuild triggered successfully!");
      queryClient.invalidateQueries({ queryKey: ["site", siteId] });
      setTimeout(() => setActionMsg(null), 3000);
    },
    onError: () => setActionMsg("Rebuild triggered (mock mode)"),
  });

  const displaySite = site || MOCK_SITES[0];
  const displayPages = pages || MOCK_PAGES.filter((p) => p.niche_id === displaySite.niche_id);

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
            <h1 className="text-2xl font-bold text-white">{displaySite.niche_name}</h1>
            <SiteStatusBadge status={displaySite.status} />
          </div>
          <p className="text-blue-400 text-sm mt-0.5">{displaySite.subdomain}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => rebuildMutation.mutate()}
            disabled={rebuildMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={16} className={clsx(rebuildMutation.isPending && "animate-spin")} />
            Rebuild
          </button>
          <button
            onClick={() => publishMutation.mutate()}
            disabled={publishMutation.isPending}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors disabled:opacity-50"
          >
            <Globe size={16} />
            Publish
          </button>
        </div>
      </div>

      {/* Action message */}
      {actionMsg && (
        <div className="flex items-center gap-2 bg-green-900/30 border border-green-700 rounded-lg px-4 py-3">
          <CheckCircle size={16} className="text-green-400" />
          <span className="text-green-400 text-sm">{actionMsg}</span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Pages", value: displaySite.page_count },
          { label: "Traffic (30d)", value: displaySite.traffic_30d > 0 ? displaySite.traffic_30d.toLocaleString() : "—" },
          { label: "Published Pages", value: displayPages.filter(p => p.is_published).length },
          { label: "Affiliate Links", value: displayPages.reduce((a, p) => a + (p.affiliate_link_count || 0), 0) },
        ].map((stat) => (
          <div key={stat.label} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <p className="text-gray-400 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Pages List + Preview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Pages List */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
            <FileText size={16} className="text-blue-400" />
            <span className="text-white font-medium">Pages</span>
            <span className="ml-auto text-gray-500 text-sm">{displayPages.length} pages</span>
          </div>

          {pagesLoading ? (
            <div className="p-6 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-16 w-full" />)}
            </div>
          ) : displayPages.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <FileText size={32} className="mx-auto mb-2 text-gray-700" />
              No pages generated yet.
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {displayPages.map((page) => (
                <div
                  key={page.id}
                  className={clsx(
                    "flex items-center justify-between px-6 py-4 hover:bg-gray-800/30 cursor-pointer transition-colors",
                    previewPage?.id === page.id && "bg-blue-900/20 border-l-2 border-blue-500"
                  )}
                  onClick={() => setPreviewPage(previewPage?.id === page.id ? null : page)}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-white text-sm font-medium">
                        {PAGE_TYPE_LABELS[page.page_type] || page.page_type}
                      </span>
                      {page.is_published
                        ? <span className="text-xs bg-green-900/50 text-green-400 border border-green-700 px-2 py-0.5 rounded-full">Published</span>
                        : <span className="text-xs bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Draft</span>
                      }
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-gray-500 text-xs truncate max-w-[200px]">{page.url || "—"}</span>
                      {page.affiliate_link_count ? (
                        <span className="flex items-center gap-1 text-xs text-orange-400">
                          <Link2 size={10} />
                          {page.affiliate_link_count} links
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Eye size={16} className={clsx(
                    "transition-colors",
                    previewPage?.id === page.id ? "text-blue-400" : "text-gray-600"
                  )} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content Preview Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-800">
            <Eye size={16} className="text-blue-400" />
            <span className="text-white font-medium">Content Preview</span>
          </div>

          {previewPage ? (
            <div className="p-6 overflow-y-auto max-h-[500px]">
              <div className="mb-4">
                <h3 className="text-white font-semibold mb-1">
                  {PAGE_TYPE_LABELS[previewPage.page_type]}
                </h3>
                {previewPage.meta_title && (
                  <p className="text-blue-400 text-sm mb-1">
                    <span className="text-gray-500">Title: </span>
                    {previewPage.meta_title}
                  </p>
                )}
                {previewPage.meta_description && (
                  <p className="text-gray-400 text-sm">
                    <span className="text-gray-500">Description: </span>
                    {previewPage.meta_description}
                  </p>
                )}
              </div>
              <div className="border-t border-gray-800 pt-4">
                <p className="text-gray-500 text-xs mb-2">Page Content:</p>
                <div
                  className="text-gray-300 text-sm leading-relaxed prose prose-invert prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewPage.content || "<p>No content available.</p>" }}
                />
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              <Eye size={32} className="mx-auto mb-2 text-gray-700" />
              <p>Click any page on the left to preview its content</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}