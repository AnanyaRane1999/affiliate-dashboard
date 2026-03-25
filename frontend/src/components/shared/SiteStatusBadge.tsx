import { clsx } from "clsx";

type SiteStatus = "live" | "draft" | "failed" | "building";

const STATUS_CONFIG: Record<SiteStatus, { label: string; className: string }> = {
  live:     { label: "Live",     className: "bg-green-900/50 text-green-400 border border-green-700" },
  draft:    { label: "Draft",    className: "bg-gray-700/50 text-gray-300 border border-gray-600" },
  failed:   { label: "Failed",   className: "bg-red-900/50 text-red-400 border border-red-700" },
  building: { label: "Building", className: "bg-purple-900/50 text-purple-400 border border-purple-700" },
};

export default function SiteStatusBadge({ status }: { status: SiteStatus }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;
  return (
    <span className={clsx(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      config.className
    )}>
      {config.label}
    </span>
  );
}