"use client";

import { Bell, Search, Sun, Moon } from "lucide-react";
import { useUIStore } from "@/store";
import { clsx } from "clsx";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const {
    sidebarOpen,
    unreadAlertCount,
    globalSearchQuery,
    setGlobalSearchQuery,
    theme,
    setTheme,
  } = useUIStore();

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && globalSearchQuery.trim()) {
      router.push("/dashboard/niches");
    }
  }

  return (
    <header className={clsx(
      "fixed top-0 right-0 h-16 bg-gray-900/95 backdrop-blur border-b border-gray-800 z-30 flex items-center px-4 gap-4 transition-all duration-300",
      sidebarOpen ? "left-64" : "left-16"
    )}>
      {/* Search bar */}
      <div className="flex-1 max-w-md relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search niches, campaigns, alerts... (Enter)"
          value={globalSearchQuery}
          onChange={(e) => setGlobalSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
        />
      </div>

      <div className="flex-1" />

      {/* Platform status */}
      <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 status-pulse" />
        <span>Platform Active</span>
      </div>

      {/* Theme toggle */}
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      {/* Alerts bell */}
      <button
        onClick={() => router.push("/dashboard/alerts")}
        className="relative text-gray-400 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-gray-800"
      >
        <Bell size={20} />
        {unreadAlertCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
            {unreadAlertCount > 9 ? "9+" : unreadAlertCount}
          </span>
        )}
      </button>
    </header>
  );
}