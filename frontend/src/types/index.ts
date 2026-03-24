export type NicheStatus =
  | "discovered"
  | "pending_approval"
  | "approved"
  | "rejected"
  | "building"
  | "live"
  | "paused";

export type LinkStatus = "active" | "out_of_stock" | "broken" | "stale";
export type CampaignStatus = "draft" | "active" | "paused" | "ended";
export type AlertSeverity = "info" | "warning" | "critical";
export type AgentName =
  | "research"
  | "business_case"
  | "site_builder"
  | "link_builder"
  | "ads_manager"
  | "controller";
export type AgentStatus = "running" | "idle" | "error";
export type ApprovalType =
  | "niche_launch"
  | "site_publish"
  | "budget_change"
  | "campaign_create";

export interface Niche {
  id: number;
  name: string;
  subdomain: string | null;
  score: number | null;
  status: NicheStatus;
  go_no_go: boolean | null;
  recommended_budget: number | null;
  cpc_estimate: number | null;
  aov_estimate: number | null;
  commission_rate: number | null;
  created_at: string;
  updated_at: string;
  traffic?: number;
  estimated_revenue?: number;
}

export interface BusinessCase {
  niche_id: number;
  niche_name: string;
  cac: number;
  ltv: number;
  contribution_margin: number;
  payback_period_days: number;
  scenarios: {
    best: ScenarioData;
    base: ScenarioData;
    worst: ScenarioData;
  };
  recommended_budget: number;
  go_no_go: boolean;
}

export interface ScenarioData {
  monthly_revenue: number;
  monthly_spend: number;
  roi: number;
  break_even_days: number;
}

export interface Site {
  id: number;
  niche_id: number;
  niche_name: string;
  subdomain: string;
  status: "live" | "draft" | "failed" | "building";
  page_count: number;
  last_published: string | null;
  traffic_30d: number;
  created_at: string;
}

export interface AffiliateLink {
  id: number;
  niche_id: number;
  niche_name: string;
  product_name: string;
  asin: string;
  link_url: string;
  image_url: string | null;
  price_eur: number | null;
  rating: number | null;
  review_count: number | null;
  status: LinkStatus;
  last_checked: string | null;
}

export interface Campaign {
  id: number;
  niche_id: number;
  niche_name: string;
  google_campaign_id: string;
  name: string;
  status: CampaignStatus;
  daily_budget: number;
  spend_today: number;
  spend_total: number;
  ctr: number;
  cpc: number;
  roas: number | null;
  impressions: number;
  clicks: number;
  created_at: string;
}

export interface AgentLog {
  id: number;
  agent_name: AgentName;
  action: string;
  result: string;
  status: "success" | "error" | "warning";
  timestamp: string;
}

export interface Alert {
  id: number;
  type: string;
  message: string;
  severity: AlertSeverity;
  resolved: boolean;
  created_at: string;
}

export interface BudgetAllocation {
  id: number;
  niche_id: number;
  niche_name: string;
  allocated: number;
  spent: number;
  remaining: number;
  percentage_used: number;
  updated_at: string;
}

export interface ApprovalItem {
  id: number;
  type: ApprovalType;
  niche_id: number;
  niche_name: string;
  description: string;
  details: Record<string, unknown>;
  created_at: string;
}

export interface AgentStatusInfo {
  agent_name: AgentName;
  status: AgentStatus;
  last_run: string | null;
  last_action: string | null;
  run_count_today: number;
  error_message: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
  pages: number;
}

export interface KpiSummary {
  total_traffic: number;
  total_traffic_change_pct: number;
  total_ad_spend: number;
  total_ad_spend_change_pct: number;
  estimated_revenue: number;
  estimated_revenue_change_pct: number;
  active_niches: number;
  active_niches_change: number;
}

export interface TrafficDataPoint {
  date: string;
  organic: number;
  paid: number;
}

export interface SpendRevenueDataPoint {
  niche: string;
  spend: number;
  revenue: number;
}