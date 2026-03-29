"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Globe, FileText, Link2, Megaphone,
  Wallet, Activity, Bell, ClipboardCheck, ShieldAlert,
  Bot, ChevronLeft, ChevronRight, Zap,
} from "lucide-react";
import { useUIStore } from "@/store";
import { clsx } from "clsx";

const NAV_ITEMS = [
  { href: "/dashboard",           label: "Overview",        icon: LayoutDashboard },
  { href: "/dashboard/niches",    label: "Niche Overview",  icon: Globe },
  { href: "/dashboard/sites",     label: "Sites",           icon: FileText },
  { href: "/dashboard/links",     label: "Affiliate Links", icon: Link2 },
  { href: "/dashboard/campaigns", label: "Campaigns",       icon: Megaphone },
  { href: "/dashboard/budget",    label: "Budget",          icon: Wallet },
  { href: "/dashboard/activity",  label: "Activity Log",    icon: Activity },
  { href: "/dashboard/alerts",    label: "Alerts",          icon: Bell },
  { href: "/dashboard/approvals", label: "Approvals",       icon: ClipboardCheck },
  { href: "/dashboard/overrides", label: "Override",        icon: ShieldAlert },
  { href: "/dashboard/agents",    label: "Agent Status",    icon: Bot },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, toggleSidebar, unreadAlertCount } = useUIStore();

  return (
    <aside className={clsx(
      "fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-800 z-40 transition-all duration-300 flex flex-col",
      sidebarOpen ? "w-64" : "w-16"
    )}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-gray-800 shrink-0">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
          <Zap size={16} className="text-white" />
        </div>
        {sidebarOpen && (
          <div>
            <p className="text-sm font-bold text-white">AffiliateAI</p>
            <p className="text-xs text-gray-500">Germany Platform</p>
          </div>
        )}
      </div>

      {/* Nav Links */}
      <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          const isAlerts = href === "/dashboard/alerts";
          const isApprovals = href === "/dashboard/approvals";
          return (
            <Link key={href} href={href}
              className={clsx(
                "flex items-center gap-3 mx-2 px-3 py-2.5 rounded-lg mb-0.5 transition-all duration-150 relative group",
                isActive
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30"
                  : "text-gray-400 hover:bg-gray-800 hover:text-gray-100"
              )}>
              <div className="relative shrink-0">
                <Icon size={18} />
                {isAlerts && unreadAlertCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {unreadAlertCount > 9 ? "9+" : unreadAlertCount}
                  </span>
                )}
              </div>
              {sidebarOpen && (
                <span className="text-sm font-medium whitespace-nowrap">{label}</span>
              )}
              {!sidebarOpen && (
                <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 border border-gray-700 shadow-lg">
                  {label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom status */}
      {sidebarOpen && (
        <div className="px-4 py-3 border-t border-gray-800">
          <div className="flex items-center gap-2 bg-green-900/20 border border-green-700/30 rounded-lg px-3 py-2">
            <span className="w-2 h-2 rounded-full bg-green-500 status-pulse shrink-0" />
            <div>
              <p className="text-green-400 text-xs font-medium">Platform Active</p>
              <p className="text-gray-500 text-xs">6 agents running</p>
            </div>
          </div>
        </div>
      )}

      {/* Collapse toggle */}
      <button onClick={toggleSidebar}
        className="flex items-center justify-center h-12 border-t border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800 transition-colors">
        {sidebarOpen ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
      </button>
    </aside>
  );
}