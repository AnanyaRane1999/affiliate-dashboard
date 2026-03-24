"use client";

import { Bell, Search } from "lucide-react";
import { useUIStore } from "@/store";
import { clsx } from "clsx";

export default function Header() {
  const {
    sidebarOpen,
    unreadAlertCount,
    globalSearchQuery,
    setGlobalSearchQuery,
  } = useUIStore();

  return (
    <header className={clsx(
      "fixed top-0 right-0 h-16 bg-gray-900 border-b border-gray-800 z-30 flex items-center px-4 gap-4 transition-all duration-300",
      sidebarOpen ? "left-64" : "left-16"
    )}>
      {/* Search bar */}
      <div className="flex-1 max-w-md relative">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
        />
        <input
          type="text"
          placeholder="Search niches, campaigns, alerts..."
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="flex-1" />

      {/* Platform status */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span className="w-2 h-2 rounded-full bg-green-500 status-pulse" />
        <span className="hidden sm:block">Platform Active</span>
      </div>

      {/* Alerts bell */}
      <button className="relative text-gray-400 hover:text-white transition-colors p-1">
        <Bell size={20} />
        {unreadAlertCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {unreadAlertCount > 9 ? "9+" : unreadAlertCount}
          </span>
        )}
      </button>
    </header>
  );
}