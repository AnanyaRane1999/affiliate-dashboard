import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const de = {
  nav_overview: "Übersicht",
  nav_niches: "Nischen Übersicht",
  nav_sites: "Webseiten",
  nav_links: "Affiliate Links",
  nav_campaigns: "Kampagnen",
  nav_budget: "Budget",
  nav_activity: "Aktivitätslog",
  nav_alerts: "Warnungen",
  nav_approvals: "Genehmigungen",
  nav_overrides: "Manuelle Steuerung",
  nav_agents: "Agenten Status",
  nav_qa: "QA Checkliste",
  dashboard_title: "Affiliate Wachstumsplattform",
  dashboard_subtitle: "Deutschland Markt — Automatisiertes Dashboard",
  platform_active: "Plattform Aktiv",
  total_traffic: "Gesamttraffic",
  ad_spend: "Werbeausgaben",
  est_revenue: "Geschätzter Umsatz",
  active_niches: "Aktive Nischen",
  vs_last_week: "vs letzte Woche",
  top_niches: "Top Nischen",
  recent_activity: "Aktuelle Aktivität",
  view_all: "Alle anzeigen →",
  search_placeholder: "Suchen...",
  score: "Bewertung",
  status: "Status",
  action: "Aktion",
  btn_approve: "Genehmigen",
  btn_reject: "Ablehnen",
  btn_pause: "Pausieren",
  btn_resume: "Fortsetzen",
  btn_refresh: "Aktualisieren",
  btn_resolve: "Lösen",
};

const en = {
  nav_overview: "Overview",
  nav_niches: "Niche Overview",
  nav_sites: "Sites",
  nav_links: "Affiliate Links",
  nav_campaigns: "Campaigns",
  nav_budget: "Budget",
  nav_activity: "Activity Log",
  nav_alerts: "Alerts",
  nav_approvals: "Approvals",
  nav_overrides: "Override",
  nav_agents: "Agent Status",
  nav_qa: "QA Checklist",
  dashboard_title: "Affiliate Growth Platform",
  dashboard_subtitle: "Germany Market — Automated Dashboard",
  platform_active: "Platform Active",
  total_traffic: "Total Traffic",
  ad_spend: "Ad Spend",
  est_revenue: "Est. Revenue",
  active_niches: "Active Niches",
  vs_last_week: "vs last week",
  top_niches: "Top Niches",
  recent_activity: "Recent Activity",
  view_all: "View all →",
  search_placeholder: "Search...",
  score: "Score",
  status: "Status",
  action: "Action",
  btn_approve: "Approve",
  btn_reject: "Reject",
  btn_pause: "Pause",
  btn_resume: "Resume",
  btn_refresh: "Refresh",
  btn_resolve: "Resolve",
};

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources: {
        de: { translation: de },
        en: { translation: en },
      },
      lng: "de",
      fallbackLng: "de",
      interpolation: { escapeValue: false },
    });
}

export default i18n;