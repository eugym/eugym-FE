"use client";

import { useState, useMemo } from "react";
import { Calendar, MapPin, Users, Search, Tag } from "lucide-react";
import Tabs from "../components/tabs";
import { useDashboardUser } from "../components/DashboardContext";
import { useEventsStore } from "@/app/store/events";
import type { GymEvent, EventCategory } from "@/app/store/events";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function fmt12(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

function displayDate(iso: string) {
  return new Date(iso + "T00:00:00")
    .toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric" })
    .toUpperCase();
}

const CATEGORY_COLOR: Record<EventCategory, string> = {
  Yoga:      "bg-purple-50 text-purple-700 border-purple-200",
  HIIT:      "bg-rose-50 text-rose-700 border-rose-200",
  Outdoor:   "bg-sky-50 text-sky-700 border-sky-200",
  Bootcamp:  "bg-orange-50 text-orange-700 border-orange-200",
  Nutrition: "bg-teal-50 text-teal-700 border-teal-200",
  Swimming:  "bg-cyan-50 text-cyan-700 border-cyan-200",
  CrossFit:  "bg-indigo-50 text-indigo-700 border-indigo-200",
  Cycling:   "bg-amber-50 text-amber-700 border-amber-200",
  Running:   "bg-green-50 text-green-700 border-green-200",
  General:   "bg-gray-100 text-gray-600 border-gray-200",
};

// ─────────────────────────────────────────────
// EventCard
// ─────────────────────────────────────────────
function EventCard({ event }: { event: GymEvent }) {
  const pct = Math.round(((event.capacity - event.spotsLeft) / event.capacity) * 100);
  const almostFull = event.spotsLeft <= 5;
  const priceLabel = event.type === "Paid" && event.price
    ? `₦${event.price.toLocaleString("en-NG")}`
    : "Free";

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-emerald-200 transition-all flex flex-col gap-4">
      {/* Top row: date + price badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-sky-500">
          <Calendar size={12} />
          <span>{displayDate(event.date)}</span>
          <span className="text-gray-300">·</span>
          <span className="text-gray-400 font-normal">
            {fmt12(event.startTime)} – {fmt12(event.endTime)}
          </span>
        </div>
        <span
          className={`shrink-0 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
            event.type === "Free"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
          }`}
        >
          {priceLabel}
        </span>
      </div>

      {/* Title + location */}
      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-gray-900 leading-snug">{event.title}</h3>
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin size={12} className="text-rose-400 shrink-0" />
          <span className="line-clamp-1">{event.location}</span>
        </div>
      </div>

      {/* Category badge */}
      <span
        className={`self-start inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${CATEGORY_COLOR[event.category]}`}
      >
        <Tag size={10} />
        {event.category}
      </span>

      {/* Spots bar + CTA */}
      <div className="mt-auto space-y-3">
        <div>
          <div className="flex justify-between text-xs text-gray-400 mb-1.5">
            <span className={`flex items-center gap-1 ${almostFull ? "text-amber-600 font-medium" : ""}`}>
              <Users size={11} />
              {event.spotsLeft} spot{event.spotsLeft !== 1 ? "s" : ""} left
            </span>
            <span>{event.capacity} total</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full transition-all ${almostFull ? "bg-amber-400" : "bg-emerald-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <button
          disabled={event.spotsLeft === 0}
          className="w-full py-2 text-sm font-semibold rounded-lg border border-emerald-500 text-emerald-600 hover:bg-emerald-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {event.spotsLeft === 0
            ? "Fully Booked"
            : event.type === "Free"
            ? "Register Free"
            : "Book Now"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Empty state
// ─────────────────────────────────────────────
function EmptyState({ message }: { message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-16 bg-white rounded-xl border border-dashed border-gray-200 text-center">
      <Calendar size={36} className="text-gray-300 mb-3" />
      <p className="text-gray-500 text-sm font-medium">{message}</p>
      <p className="text-gray-400 text-xs mt-1">Check back soon for new events.</p>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
const TABS = [
  { id: "all",  label: "All Events" },
  { id: "free", label: "Free" },
  { id: "paid", label: "Paid" },
];

export default function EventsPage() {
  const user = useDashboardUser();
  const { events: allEvents } = useEventsStore();

  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  // Only show non-cancelled, visible events to users
  const visibleEvents = allEvents.filter((e) => e.status !== "cancelled");

  const freeCount = visibleEvents.filter((e) => e.type === "Free").length;
  const paidCount = visibleEvents.filter((e) => e.type === "Paid").length;

  const filtered = useMemo(() => {
    return visibleEvents.filter((e) => {
      const matchTab =
        activeTab === "all" ||
        (activeTab === "free" && e.type === "Free") ||
        (activeTab === "paid" && e.type === "Paid");
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.location.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q);
      return matchTab && matchSearch;
    });
  }, [activeTab, search, allEvents]);

  const tabsWithCounts = TABS.map((t) => ({
    ...t,
    label: (
      <span className="flex items-center gap-1.5">
        {t.label}
        <span
          className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
            activeTab === t.id ? "bg-white/30 text-white" : "bg-gray-200 text-gray-600"
          }`}
        >
          {t.id === "all" ? visibleEvents.length : t.id === "free" ? freeCount : paidCount}
        </span>
      </span>
    ),
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-5 py-6 space-y-6">

        {/* Page header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Events</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Discover and register for upcoming fitness events, {user.firstName}
          </p>
        </div>

        {/* Stats strip */}
        <div className="flex flex-col sm:flex-row gap-3">
          {[
            { label: "Total Events", value: visibleEvents.length },
            { label: "Free Events",  value: freeCount },
            { label: "Paid Events",  value: paidCount },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 flex items-center gap-4 bg-white rounded-xl border border-gray-100 shadow-sm px-5 py-4"
            >
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by event name, location, or category…"
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Tabs */}
        <Tabs
          tabs={tabsWithCounts}
          active={activeTab}
          onChange={(id) => { setActiveTab(id); setSearch(""); }}
        />

        {/* Event grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.length === 0 ? (
            <EmptyState
              message={
                search
                  ? `No events match "${search}".`
                  : activeTab === "free"
                  ? "No free events available right now."
                  : "No paid events available right now."
              }
            />
          ) : (
            filtered.map((ev) => <EventCard key={ev.id} event={ev} />)
          )}
        </div>

      </div>
    </div>
  );
}
