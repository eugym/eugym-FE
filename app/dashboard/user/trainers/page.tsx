"use client";

import { Users, Calendar, Clock, TrendingUp, MessageSquare, Plus } from "lucide-react";
import { useDashboardUser } from "@/app/dashboard/components/DashboardContext";
import DashboardHeader from "@/app/dashboard/components/shared/DashboardHeader";
import StatChip from "@/app/dashboard/components/shared/StatChip";

const MY_CLIENTS = [
  { id: "c1", name: "Adaeze Nwosu",    plan: "Premium",  sessions: 8,  nextSession: "Today 2PM",       avatar: "AN", progress: 82 },
  { id: "c2", name: "Chidi Okafor",    plan: "Standard", sessions: 5,  nextSession: "Tomorrow 7AM",    avatar: "CO", progress: 65 },
  { id: "c3", name: "Emeka Williams",  plan: "Premium",  sessions: 12, nextSession: "Wed 4PM",         avatar: "EW", progress: 91 },
  { id: "c4", name: "Fatima Hassan",   plan: "Standard", sessions: 3,  nextSession: "Thu 6PM",         avatar: "FH", progress: 40 },
  { id: "c5", name: "Seun Adeyemi",    plan: "Premium",  sessions: 7,  nextSession: "Fri 5PM",         avatar: "SA", progress: 73 },
];

const SCHEDULE = [
  { time: "07:00 AM", client: "Chidi Okafor",   type: "Strength",    duration: "60 min", status: "upcoming" },
  { time: "10:00 AM", client: "Group Class",     type: "HIIT",        duration: "45 min", status: "upcoming" },
  { time: "02:00 PM", client: "Adaeze Nwosu",   type: "Conditioning",duration: "60 min", status: "upcoming" },
  { time: "05:00 PM", client: "Seun Adeyemi",   type: "Full Body",   duration: "60 min", status: "upcoming" },
];

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full bg-gray-100 rounded-full h-1.5">
      <div
        className="bg-emerald-500 h-1.5 rounded-full transition-all"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default function TrainerDashboard() {
  const user = useDashboardUser();

  return (
    <div className="space-y-6 px-4 sm:px-5 py-5 max-w-7xl mx-auto">
      <DashboardHeader user={user} subtitle="Your training studio overview" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatChip icon={<Users size={16} />}      label="Total clients"     value={MY_CLIENTS.length} color="emerald" />
        <StatChip icon={<Calendar size={16} />}   label="Sessions today"    value={SCHEDULE.length}   color="sky" />
        <StatChip icon={<Clock size={16} />}      label="Hours this week"   value="18 hrs"            color="amber" />
        <StatChip icon={<TrendingUp size={16} />} label="Avg. client score" value="70%"               color="indigo" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Today's schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Today's Schedule</h3>
            <button className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors">
              <Plus size={12} />
              Add Session
            </button>
          </div>

          <div className="space-y-3">
            {SCHEDULE.map((s, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100">
                <div className="shrink-0 text-center min-w-[60px]">
                  <p className="text-xs font-bold text-emerald-700">{s.time}</p>
                  <p className="text-[10px] text-gray-400">{s.duration}</p>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{s.client}</p>
                  <p className="text-xs text-gray-500">{s.type}</p>
                </div>
                <button className="shrink-0 flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                  <MessageSquare size={11} />
                  Message
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats card */}
        <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl p-5 text-white">
          <h3 className="font-semibold mb-4">This Month</h3>
          <div className="space-y-3">
            {[
              { label: "Sessions completed", value: "32" },
              { label: "New clients joined",  value: "3"  },
              { label: "Client satisfaction", value: "94%" },
              { label: "Hours trained",        value: "48h" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between text-sm">
                <span className="opacity-80">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Client list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">My Clients</h3>
          <button className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium border border-emerald-200 px-3 py-1.5 rounded-lg hover:bg-emerald-50 transition-colors">
            <Plus size={12} />
            Add Client
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {["Client", "Plan", "Sessions", "Next Session", "Progress", ""].map((h) => (
                  <th key={h} className="text-left px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MY_CLIENTS.map((c) => (
                <tr key={c.id} className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0">
                        {c.avatar}
                      </div>
                      <span className="font-medium text-gray-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      c.plan === "Premium" ? "bg-amber-50 text-amber-700" : "bg-sky-50 text-sky-700"
                    }`}>
                      {c.plan}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-gray-600">{c.sessions} done</td>
                  <td className="px-3 py-3 text-gray-600 text-xs">{c.nextSession}</td>
                  <td className="px-3 py-3 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <ProgressBar value={c.progress} />
                      <span className="text-xs text-gray-500 w-8 text-right">{c.progress}%</span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <button className="text-xs text-emerald-600 font-medium hover:underline">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
