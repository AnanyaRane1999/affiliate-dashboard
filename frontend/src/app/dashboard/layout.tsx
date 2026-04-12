"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useUIStore } from "@/store";
import { clsx } from "clsx";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-950">
      <Sidebar />
      <Header />
      <main
        className={clsx(
          "transition-all duration-300 pt-16 min-h-screen",
          // Mobile: no margin (sidebar overlays)
          // Desktop: margin based on sidebar state
          sidebarOpen ? "md:ml-64" : "md:ml-16"
        )}
      >
        <div className="p-4 sm:p-6">{children}</div>
      </main>
    </div>
  );
}