import { NicheStatus } from "@/types";
import { clsx } from "clsx";

const STATUS_CONFIG: Record<NicheStatus, { label: string; className: string }> = {
  discovered:       { label: "Discovered",       className: "bg-gray-700 text-gray-300" },
  pending_approval: { label: "Pending Approval", className: "bg-yellow-900/50 text-yellow-400 border border-yellow-700" },
  approved:         { label: "Approved",         className: "bg-blue-900/50 text-blue-400 border border-blue-700" },
  rejected:         { label: "Rejected",         className: "bg-red-900/50 text-red-400 border border-red-700" },
  building:         { label: "Building",         className: "bg-purple-900/50 text-purple-400 border border-purple-700" },
  live:             { label: "Live",             className: "bg-green-900/50 text-green-400 border border-green-700" },
  paused:           { label: "Paused",           className: "bg-orange-900/50 text-orange-400 border border-orange-700" },
};

export default function StatusBadge({ status }: { status: NicheStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={clsx(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      config.className
    )}>
      {config.label}
    </span>
  );
}