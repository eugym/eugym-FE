"use client";

import { Users, CreditCard, CheckCircle, Clock, TrendingUp, Plus, QrCode } from "lucide-react";
import { useDashboardUser } from "@/app/dashboard/components/DashboardContext";
import DashboardHeader from "@/app/dashboard/components/shared/DashboardHeader";
import StatChip from "@/app/dashboard/components/shared/StatChip";

const RECENT_CHECKINS = [
  { id: "ch1", name: "Adaeze Nwosu",   plan: "Premium",  time: "09:14 AM", status: "checked-in" },
  { id: "ch2", name: "Emeka Williams", plan: "Standard", time: "09:08 AM", status: "checked-in" },
  { id: "ch3", name: "Seun Adeyemi",   plan: "Premium",  time: "08:52 AM", status: "checked-in" },
  { id: "ch4", name: "Fatima Hassan",  plan: "Standard", time: "08:30 AM", status: "checked-in" },
  { id: "ch5", name: "Chidi Okafor",   plan: "Regular",  time: "08:15 AM", status: "checked-in" },
];

const MONTHLY_PAYMENTS = [
  { month: "Jun 2025", amount: "₦124,500", status: "Paid",    date: "Jun 1" },
  { month: "May 2025", amount: "₦118,000", status: "Paid",    date: "May 1" },
  { month: "Apr 2025", amount: "₦110,000", status: "Paid",    date: "Apr 1" },
  { month: "Mar 2025", amount: "₦105,000", status: "Paid",    date: "Mar 1" },
];

export default function AffiliateDashboard() {
  const user = useDashboardUser();

  return (
    <div className="space-y-6 px-4 sm:px-5 py-5 max-w-7xl mx-auto">
      <DashboardHeader user={user} subtitle="Affiliate Partner Portal" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatChip icon={<CheckCircle size={16} />} label="Check-ins today"    value="47"          color="emerald" />
        <StatChip icon={<Users size={16} />}       label="Active members"     value="312"         color="sky" />
        <StatChip icon={<CreditCard size={16} />}  label="This month revenue" value="₦124,500"    color="amber" />
        <StatChip icon={<TrendingUp size={16} />}  label="vs last month"      value="+5.5%"       color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent check-ins */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Today's Check-ins</h3>
              <p className="text-xs text-gray-400 mt-0.5">47 members checked in so far</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors">
              <Plus size={12} />
              Manual Check-in
            </button>
          </div>

          <div className="space-y-2">
            {RECENT_CHECKINS.map((c) => (
              <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{c.name}</p>
                    <p className="text-xs text-gray-400">{c.plan}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-600">{c.time}</p>
                  <div className="flex items-center gap-1 text-emerald-600 mt-0.5">
                    <CheckCircle size={10} />
                    <span className="text-[10px]">Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button className="mt-3 w-full text-center text-xs text-emerald-600 font-medium hover:underline">
            View all check-ins →
          </button>
        </div>

        {/* QR check-in + quick actions */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl p-5 text-white text-center">
            <QrCode size={48} className="mx-auto mb-3 opacity-90" />
            <h4 className="font-semibold">QR Check-in</h4>
            <p className="text-xs opacity-80 mt-1">Let members scan to check in at your facility</p>
            <button className="mt-4 w-full bg-white/20 hover:bg-white/30 py-2 rounded-lg text-sm font-semibold transition-colors border border-white/20">
              Generate QR Code
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h4 className="font-semibold text-gray-900 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              {[
                { label: "View all members",    icon: <Users size={14} /> },
                { label: "Export today's log",  icon: <Clock size={14} /> },
                { label: "View payment history", icon: <CreditCard size={14} /> },
              ].map((a) => (
                <button key={a.label} className="w-full flex items-center gap-3 text-sm text-gray-700 p-2.5 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all text-left">
                  <span className="text-emerald-600">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment history */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="font-semibold text-gray-900 mb-4">Payment History</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Period", "Amount", "Status", "Date"].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MONTHLY_PAYMENTS.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-3 py-3 font-medium text-gray-800">{p.month}</td>
                  <td className="px-3 py-3 text-gray-700 font-semibold">{p.amount}</td>
                  <td className="px-3 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-500 text-xs">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
