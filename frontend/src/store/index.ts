import { create } from "zustand";
import { AlertSeverity } from "@/types";

interface UIStore {
  sidebarOpen: boolean;
  theme: "dark" | "light";
  unreadAlertCount: number;
  dateRange: "7d" | "14d" | "30d";
  globalSearchQuery: string;

  toggleSidebar: () => void;
  setTheme: (theme: "dark" | "light") => void;
  setUnreadAlertCount: (count: number) => void;
  setDateRange: (range: "7d" | "14d" | "30d") => void;
  setGlobalSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // ✅ Start closed on mobile, open on desktop
  sidebarOpen: typeof window !== "undefined" ? window.innerWidth >= 768 : true,
  theme: "dark",
  unreadAlertCount: 0,
  dateRange: "30d",
  globalSearchQuery: "",

  toggleSidebar: () =>
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme) => set({ theme }),
  setUnreadAlertCount: (count) => set({ unreadAlertCount: count }),
  setDateRange: (dateRange) => set({ dateRange }),
  setGlobalSearchQuery: (globalSearchQuery) => set({ globalSearchQuery }),
}));

interface FilterStore {
  nicheStatusFilter: string;
  siteStatusFilter: string;
  campaignStatusFilter: string;
  linkStatusFilter: string;
  alertSeverityFilter: AlertSeverity | "all";

  setNicheStatusFilter: (f: string) => void;
  setSiteStatusFilter: (f: string) => void;
  setCampaignStatusFilter: (f: string) => void;
  setLinkStatusFilter: (f: string) => void;
  setAlertSeverityFilter: (f: AlertSeverity | "all") => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  nicheStatusFilter: "all",
  siteStatusFilter: "all",
  campaignStatusFilter: "all",
  linkStatusFilter: "all",
  alertSeverityFilter: "all",

  setNicheStatusFilter: (f) => set({ nicheStatusFilter: f }),
  setSiteStatusFilter: (f) => set({ siteStatusFilter: f }),
  setCampaignStatusFilter: (f) => set({ campaignStatusFilter: f }),
  setLinkStatusFilter: (f) => set({ linkStatusFilter: f }),
  setAlertSeverityFilter: (f) => set({ alertSeverityFilter: f }),
}));