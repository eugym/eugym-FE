"use client";

import { useBackendQuery } from "@/hooks/useBackend";
import {
  Users, UserCheck, Repeat, CreditCard,
  Building2, TrendingUp, Activity,
} from "lucide-react";
import StatCard from "../components/cards/statsCard";
import RevenueBarChart from "../components/charts/RevenueBarChart";
import UsersPieChart, { PieSlice } from "../components/charts/UsersPieChart";
import { Table, ITableHead, ITableBody } from "@/components/table";
import { useDashboardUser } from "../components/DashboardContext";

// ---------- types ----------
interface AdminStats {
  totalUsers: number;
  totalTrainers: number;
  totalAffiliates: number;
  totalAdmins: number;
  totalRegular: number;
  totalStandard: number;
  totalPremium: number;
  totalCorporate: number;
  activeUsers: number;
  inactiveUsers: number;
}

// Stats come from GET /admin/stats via the /api/backend/* proxy.
//
// NOTE: the backend currently returns { totalMembers, monthlyRevenue,
// todayBookings, pendingPOS, lowStockItems, activeTrainers } — not the
// per-tier breakdown this page charts. The tier counts below will read 0 until
// the endpoint is widened. Tracked for the backend module.

// ---------- helpers ----------
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const todayLong = new Date().toLocaleDateString("en-NG", {
  weekday: "long", year: "numeric", month: "long", day: "numeric",
});

const CORP_HEADERS: ITableHead[] = [
  { name: "companyName", label: "Company" },
  { name: "email",       label: "Email" },
  { name: "phone",       label: "Phone" },
  { name: "status",      label: "Status" },
];

const CORP_BODY: ITableBody[] = [
  { id: "1", companyName: "Access Bank",   email: "hr@access.com",   phone: "08012345678", status: "active" },
  { id: "2", companyName: "MTN Nigeria",   email: "hr@mtn.com",      phone: "08012345679", status: "active" },
  { id: "3", companyName: "Dangote Group", email: "hr@dangote.com",  phone: "08012345680", status: "inactive" },
];

// ---------- component ----------
export default function Admin() {
  const user = useDashboardUser();

  const { data: stats, isLoading } = useBackendQuery<AdminStats>("admin/stats", {
    staleTime: 1000 * 60 * 5, // 5 min
  });

  // Build pie-chart slices from real data
  const pieSlices: PieSlice[] = stats
    ? [
        { label: "Regular",    value: stats.totalRegular,   color: "#93C5FD" },
        { label: "Standard",   value: stats.totalStandard,  color: "#19b24b" },
        { label: "Premium",    value: stats.totalPremium,   color: "#F59E0B" },
        { label: "Corporate",  value: stats.totalCorporate, color: "#8B5CF6" },
        { label: "Trainers",   value: stats.totalTrainers,  color: "#06B6D4" },
        { label: "Affiliates", value: stats.totalAffiliates,color: "#FB923C" },
      ].filter((s) => s.value > 0)
    : [];

  return (
    <div className="space-y-6 p-5">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {getGreeting()}, {user.firstName} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{todayLong}</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full">
          <Activity size={12} className="shrink-0" />
          Live Dashboard
        </span>
      </div>

      {/* ── Stats grid ── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? "—"}
          icon={<Users className="h-5 w-5 text-blue-600" />}
          iconBg="bg-blue-100"
          loading={isLoading}
          description="All registered accounts"
        />
        <StatCard
          title="Active Subscribers"
          value={stats?.activeUsers ?? "—"}
          icon={<CreditCard className="h-5 w-5 text-emerald-600" />}
          iconBg="bg-emerald-100"
          loading={isLoading}
          description="Currently active users"
        />
        <StatCard
          title="Total Trainers"
          value={stats?.totalTrainers ?? "—"}
          icon={<UserCheck className="h-5 w-5 text-indigo-600" />}
          iconBg="bg-indigo-100"
          loading={isLoading}
          description="Registered personal trainers"
        />
        <StatCard
          title="Affiliate Partners"
          value={stats?.totalAffiliates ?? "—"}
          icon={<Repeat className="h-5 w-5 text-amber-600" />}
          iconBg="bg-amber-100"
          loading={isLoading}
          description="Active gym affiliates"
        />
        <StatCard
          title="Premium Users"
          value={stats?.totalPremium ?? "—"}
          icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
          iconBg="bg-purple-100"
          loading={isLoading}
        />
        <StatCard
          title="Standard Users"
          value={stats?.totalStandard ?? "—"}
          icon={<Users className="h-5 w-5 text-sky-600" />}
          iconBg="bg-sky-100"
          loading={isLoading}
        />
        <StatCard
          title="Corporate Clients"
          value={stats?.totalCorporate ?? "—"}
          icon={<Building2 className="h-5 w-5 text-rose-600" />}
          iconBg="bg-rose-100"
          loading={isLoading}
          description="Corporate membership accounts"
        />
        <StatCard
          title="Inactive Users"
          value={stats?.inactiveUsers ?? "—"}
          icon={<Users className="h-5 w-5 text-gray-500" />}
          iconBg="bg-gray-100"
          loading={isLoading}
        />
      </div>

      {/* ── Charts row ── */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* Revenue bar chart — 2/3 width */}
        <div className="lg:col-span-2 rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-800">Monthly Revenue</h2>
              <p className="text-xs text-gray-400 mt-0.5">Breakdown by membership tier (₦ thousands)</p>
            </div>
            <div className="flex gap-2">
              <select className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option>All tiers</option>
                <option>Standard</option>
                <option>Premium</option>
                <option>Corporate</option>
              </select>
              <select className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
          </div>
          <RevenueBarChart loading={false} />
        </div>

        {/* Pie chart — 1/3 width */}
        <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-800">User Distribution</h2>
            <p className="text-xs text-gray-400 mt-0.5">By membership tier</p>
          </div>
          <UsersPieChart data={pieSlices} loading={isLoading} />
        </div>
      </div>

      {/* ── Corporate clients table ── */}
      <div>
        <Table
          title="Corporate Clients"
          subTitle="Company membership accounts"
          headers={CORP_HEADERS}
          body={CORP_BODY}
          showSerialNumber
          allowSearchBar
        />
      </div>
    </div>
  );
}
