"use client";

import { useState, useMemo } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  User,
  X,
  CheckCircle,
  AlertCircle,
  Plus,
  Search,
  Filter,
  RefreshCw,
  Star,
} from "lucide-react";
import Tabs from "../components/tabs";
import { useDashboardUser } from "../components/DashboardContext";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type BookingStatus = "upcoming" | "completed" | "cancelled";
type SessionType =
  | "Personal Training"
  | "Group Class"
  | "Gym Access"
  | "Spinning"
  | "Yoga"
  | "HIIT";

interface Booking {
  id: string;
  date: string; // ISO string
  timeSlot: string; // "4:00 PM – 5:00 PM"
  title: string;
  trainer: string;
  type: SessionType;
  location: string;
  duration: string; // "60 min"
  status: BookingStatus;
  cancelledOn?: string;
  rating?: number;
}

interface AvailableClass {
  id: string;
  date: string;
  timeSlot: string;
  title: string;
  trainer: string;
  type: SessionType;
  location: string;
  duration: string;
  spotsLeft: number;
  totalSpots: number;
  price: "Included" | string;
}

// ─────────────────────────────────────────────
// Dummy data
// ─────────────────────────────────────────────
const BOOKINGS: Booking[] = [
  {
    id: "b1",
    date: "2025-06-02",
    timeSlot: "4:00 PM – 5:00 PM",
    title: "Upper Body Strength",
    trainer: "Michael Johnson",
    type: "Personal Training",
    location: "Eugym Victoria Island",
    duration: "60 min",
    status: "upcoming",
  },
  {
    id: "b2",
    date: "2025-06-03",
    timeSlot: "7:00 AM – 7:45 AM",
    title: "Morning HIIT Class",
    trainer: "Sarah Williams",
    type: "HIIT",
    location: "Eugym Lekki",
    duration: "45 min",
    status: "upcoming",
  },
  {
    id: "b3",
    date: "2025-06-06",
    timeSlot: "6:00 PM – 7:00 PM",
    title: "Yoga & Flexibility",
    trainer: "Amanda Peters",
    type: "Yoga",
    location: "Eugym Ikoyi",
    duration: "60 min",
    status: "upcoming",
  },
  // Past bookings
  {
    id: "b4",
    date: "2025-05-30",
    timeSlot: "4:00 PM – 5:00 PM",
    title: "Lower Body Strength",
    trainer: "Michael Johnson",
    type: "Personal Training",
    location: "Eugym Victoria Island",
    duration: "60 min",
    status: "completed",
    rating: 5,
  },
  {
    id: "b5",
    date: "2025-05-28",
    timeSlot: "7:00 AM – 7:45 AM",
    title: "Morning HIIT Class",
    trainer: "Sarah Williams",
    type: "HIIT",
    location: "Eugym Lekki",
    duration: "45 min",
    status: "completed",
    rating: 4,
  },
  {
    id: "b6",
    date: "2025-05-26",
    timeSlot: "10:00 AM – 11:00 AM",
    title: "Spinning Session",
    trainer: "David Chen",
    type: "Spinning",
    location: "Eugym Ikeja",
    duration: "60 min",
    status: "completed",
    rating: 5,
  },
  {
    id: "b7",
    date: "2025-05-23",
    timeSlot: "6:00 PM – 7:00 PM",
    title: "Full Body Conditioning",
    trainer: "Michael Johnson",
    type: "Personal Training",
    location: "Eugym Victoria Island",
    duration: "60 min",
    status: "completed",
    rating: 5,
  },
  {
    id: "b8",
    date: "2025-05-21",
    timeSlot: "8:00 AM – 9:00 AM",
    title: "Yoga Flow",
    trainer: "Amanda Peters",
    type: "Yoga",
    location: "Eugym Ikoyi",
    duration: "60 min",
    status: "completed",
    rating: 4,
  },
  {
    id: "b9",
    date: "2025-05-19",
    timeSlot: "5:00 PM – 5:45 PM",
    title: "Evening HIIT",
    trainer: "Sarah Williams",
    type: "HIIT",
    location: "Eugym Lekki",
    duration: "45 min",
    status: "completed",
  },
  {
    id: "b10",
    date: "2025-05-16",
    timeSlot: "4:00 PM – 5:00 PM",
    title: "Core & Stability",
    trainer: "Michael Johnson",
    type: "Personal Training",
    location: "Eugym Victoria Island",
    duration: "60 min",
    status: "completed",
    rating: 5,
  },
  // Cancelled
  {
    id: "b11",
    date: "2025-05-29",
    timeSlot: "6:00 PM – 7:00 PM",
    title: "Spinning Session",
    trainer: "David Chen",
    type: "Spinning",
    location: "Eugym Ikeja",
    duration: "60 min",
    status: "cancelled",
    cancelledOn: "May 28, 2025",
  },
  {
    id: "b12",
    date: "2025-05-25",
    timeSlot: "7:00 AM – 7:45 AM",
    title: "Saturday HIIT",
    trainer: "Sarah Williams",
    type: "HIIT",
    location: "Eugym Lekki",
    duration: "45 min",
    status: "cancelled",
    cancelledOn: "May 24, 2025",
  },
];

const AVAILABLE: AvailableClass[] = [
  {
    id: "a1",
    date: "2025-06-02",
    timeSlot: "6:00 PM – 7:00 PM",
    title: "Evening Spinning",
    trainer: "David Chen",
    type: "Spinning",
    location: "Eugym Ikeja",
    duration: "60 min",
    spotsLeft: 4,
    totalSpots: 15,
    price: "Included",
  },
  {
    id: "a2",
    date: "2025-06-03",
    timeSlot: "8:00 AM – 9:00 AM",
    title: "Morning Yoga",
    trainer: "Amanda Peters",
    type: "Yoga",
    location: "Eugym Ikoyi",
    duration: "60 min",
    spotsLeft: 8,
    totalSpots: 20,
    price: "Included",
  },
  {
    id: "a3",
    date: "2025-06-04",
    timeSlot: "5:00 PM – 5:45 PM",
    title: "Power HIIT",
    trainer: "Sarah Williams",
    type: "HIIT",
    location: "Eugym Lekki",
    duration: "45 min",
    spotsLeft: 2,
    totalSpots: 20,
    price: "Included",
  },
  {
    id: "a4",
    date: "2025-06-05",
    timeSlot: "7:00 AM – 8:00 AM",
    title: "Full Body Strength",
    trainer: "Michael Johnson",
    type: "Personal Training",
    location: "Eugym Victoria Island",
    duration: "60 min",
    spotsLeft: 1,
    totalSpots: 1,
    price: "Included",
  },
  {
    id: "a5",
    date: "2025-06-07",
    timeSlot: "10:00 AM – 11:00 AM",
    title: "Weekend HIIT",
    trainer: "Sarah Williams",
    type: "HIIT",
    location: "Eugym Lekki",
    duration: "60 min",
    spotsLeft: 12,
    totalSpots: 25,
    price: "Included",
  },
  {
    id: "a6",
    date: "2025-06-07",
    timeSlot: "2:00 PM – 3:00 PM",
    title: "Restorative Yoga",
    trainer: "Amanda Peters",
    type: "Yoga",
    location: "Eugym Ikoyi",
    duration: "60 min",
    spotsLeft: 15,
    totalSpots: 20,
    price: "Included",
  },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-NG", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isToday(iso: string) {
  const d = new Date(iso);
  const n = new Date();
  return (
    d.getDate() === n.getDate() &&
    d.getMonth() === n.getMonth() &&
    d.getFullYear() === n.getFullYear()
  );
}

function isTomorrow(iso: string) {
  const d = new Date(iso);
  const n = new Date();
  n.setDate(n.getDate() + 1);
  return (
    d.getDate() === n.getDate() &&
    d.getMonth() === n.getMonth() &&
    d.getFullYear() === n.getFullYear()
  );
}

function dateLabel(iso: string) {
  if (isToday(iso)) return "Today";
  if (isTomorrow(iso)) return "Tomorrow";
  return formatDate(iso);
}

const TYPE_COLOR: Record<SessionType, string> = {
  "Personal Training": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "Group Class": "bg-sky-50 text-sky-700 border-sky-200",
  "Gym Access": "bg-gray-100 text-gray-600 border-gray-200",
  Spinning: "bg-amber-50 text-amber-700 border-amber-200",
  Yoga: "bg-purple-50 text-purple-700 border-purple-200",
  HIIT: "bg-rose-50 text-rose-700 border-rose-200",
};

function TypeBadge({ type }: { type: SessionType }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${TYPE_COLOR[type]}`}
    >
      {type}
    </span>
  );
}

function StarRating({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={12}
          className={
            s <= value ? "text-amber-400 fill-amber-400" : "text-gray-300"
          }
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// BookingCard
// ─────────────────────────────────────────────
function BookingCard({
  booking,
  onCancel,
  onRebook,
}: {
  booking: Booking;
  onCancel?: (id: string) => void;
  onRebook?: (id: string) => void;
}) {
  const label = dateLabel(booking.date);
  const todayBg = isToday(booking.date)
    ? "border-l-4 border-l-emerald-500"
    : "";

  return (
    <div
      className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 ${todayBg}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        {/* Left — info */}
        <div className="space-y-1.5 flex-1">
          {/* Date + time */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isToday(booking.date)
                  ? "bg-emerald-100 text-emerald-700"
                  : isTomorrow(booking.date)
                    ? "bg-sky-100 text-sky-700"
                    : "bg-gray-100 text-gray-600"
              }`}
            >
              {label}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={11} />
              {booking.timeSlot}
            </span>
            <span className="text-xs text-gray-400">{booking.duration}</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-semibold text-gray-900">
            {booking.title}
          </h3>

          {/* Trainer */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <User size={13} />
            <span>{booking.trainer}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin size={13} className="text-rose-400" />
            <span>{booking.location}</span>
          </div>

          <TypeBadge type={booking.type} />

          {/* Past: rating */}
          {booking.status === "completed" && booking.rating && (
            <div className="flex items-center gap-2 pt-1">
              <StarRating value={booking.rating} />
              <span className="text-xs text-gray-400">Your rating</span>
            </div>
          )}

          {/* Cancelled: when */}
          {booking.status === "cancelled" && booking.cancelledOn && (
            <p className="text-xs text-red-500 pt-1">
              Cancelled on {booking.cancelledOn}
            </p>
          )}
        </div>

        {/* Right — actions */}
        <div className="flex flex-col items-end justify-between gap-3 shrink-0">
          {/* Status badge */}
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
              booking.status === "upcoming"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : booking.status === "completed"
                  ? "bg-sky-50 text-sky-700 border border-sky-200"
                  : "bg-red-50 text-red-600 border border-red-200"
            }`}
          >
            {booking.status === "upcoming" && <Clock size={10} />}
            {booking.status === "completed" && <CheckCircle size={10} />}
            {booking.status === "cancelled" && <AlertCircle size={10} />}
            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
          </span>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap justify-end">
            {booking.status === "upcoming" && (
              <>
                <button className="px-3 py-1.5 text-xs font-medium border border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                  Reschedule
                </button>
                <button
                  onClick={() => onCancel?.(booking.id)}
                  className="px-3 py-1.5 text-xs font-medium border border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
            {(booking.status === "completed" ||
              booking.status === "cancelled") && (
              <>
                {booking.status === "completed" && !booking.rating && (
                  <button className="px-3 py-1.5 text-xs font-medium border border-amber-400 text-amber-600 rounded-lg hover:bg-amber-50 transition-colors">
                    Rate Session
                  </button>
                )}
                <button
                  onClick={() => onRebook?.(booking.id)}
                  className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  Rebook
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// AvailableClassCard
// ─────────────────────────────────────────────
function AvailableClassCard({
  item,
  onBook,
}: {
  item: AvailableClass;
  onBook: (id: string) => void;
}) {
  const pct = Math.round(
    ((item.totalSpots - item.spotsLeft) / item.totalSpots) * 100,
  );
  const almostFull = item.spotsLeft <= 3;

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 hover:border-emerald-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-sky-600">
              {dateLabel(item.date)}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={10} />
              {item.timeSlot}
            </span>
          </div>

          <h4 className="text-sm font-semibold text-gray-900">{item.title}</h4>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <User size={11} />
            {item.trainer}
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <MapPin size={11} className="text-rose-400" />
            {item.location}
          </div>

          <TypeBadge type={item.type} />
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              item.price === "Included"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            }`}
          >
            {item.price}
          </span>
          <button
            onClick={() => onBook(item.id)}
            disabled={item.spotsLeft === 0}
            className="px-4 py-1.5 text-xs font-semibold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {item.spotsLeft === 0 ? "Full" : "Book"}
          </button>
        </div>
      </div>

      {/* Spots bar */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span className={almostFull ? "text-amber-600 font-medium" : ""}>
            {item.spotsLeft} spot{item.spotsLeft !== 1 ? "s" : ""} left
          </span>
          <span>{item.totalSpots} total</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 rounded-full">
          <div
            className={`h-1.5 rounded-full transition-all ${almostFull ? "bg-amber-500" : "bg-emerald-500"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Empty State
// ─────────────────────────────────────────────
function EmptyState({
  label,
  cta,
  onCta,
}: {
  label: string;
  cta: string;
  onCta: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl border border-dashed border-gray-200">
      <Calendar size={40} className="text-gray-300 mb-3" />
      <p className="text-gray-500 font-medium">{label}</p>
      <button
        onClick={onCta}
        className="mt-4 inline-flex items-center gap-2 text-sm text-emerald-600 font-medium border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
      >
        <Plus size={14} />
        {cta}
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────
const TABS = [
  { id: "upcoming", label: "Upcoming" },
  { id: "past", label: "Past Bookings" },
  { id: "cancelled", label: "Cancelled" },
];

export default function BookingsPage() {
  const user = useDashboardUser();

  const [activeTab, setActiveTab] = useState("upcoming");
  const [showBookModal, setShowBookModal] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [bookings, setBookings] = useState(BOOKINGS);
  const [bookedIds, setBookedIds] = useState<Set<string>>(new Set());

  // Derived stats
  const upcomingCount = bookings.filter((b) => b.status === "upcoming").length;
  const completedCount = bookings.filter(
    (b) => b.status === "completed",
  ).length;
  const cancelledCount = bookings.filter(
    (b) => b.status === "cancelled",
  ).length;
  const totalAttended = completedCount;

  const STATS = [
    { label: "Upcoming", value: upcomingCount },
    { label: "Completed", value: completedCount },
    { label: "Cancelled", value: cancelledCount },
    { label: "Total attended", value: totalAttended },
  ];

  const SESSION_TYPES: string[] = [
    "all",
    ...Array.from(new Set(bookings.map((b) => b.type))),
  ];

  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchTab =
        b.status === activeTab ||
        (activeTab === "cancelled" && b.status === "cancelled");
      const matchSearch =
        !search ||
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.trainer.toLowerCase().includes(search.toLowerCase()) ||
        b.location.toLowerCase().includes(search.toLowerCase());
      const matchType = filterType === "all" || b.type === filterType;
      return matchTab && matchSearch && matchType;
    });
  }, [bookings, activeTab, search, filterType]);

  function handleCancel(id: string) {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id
          ? {
              ...b,
              status: "cancelled" as BookingStatus,
              cancelledOn: new Date().toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }),
            }
          : b,
      ),
    );
  }

  function handleRebook(id: string) {
    setShowBookModal(true);
  }

  function handleBook(classId: string) {
    setBookedIds((prev) => new Set(prev).add(classId));
    const cls = AVAILABLE.find((a) => a.id === classId);
    if (!cls) return;
    const newBooking: Booking = {
      id: `b_new_${classId}`,
      date: cls.date,
      timeSlot: cls.timeSlot,
      title: cls.title,
      trainer: cls.trainer,
      type: cls.type,
      location: cls.location,
      duration: cls.duration,
      status: "upcoming",
    };
    setBookings((prev) => [newBooking, ...prev]);
    setShowBookModal(false);
    setActiveTab("upcoming");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-5 py-6 space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-800">My Bookings</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Manage your gym sessions and classes, {user.firstName}
            </p>
          </div>
          <button
            onClick={() => setShowBookModal(true)}
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <Plus size={15} />
            Book a Session
          </button>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-gray-200 rounded-xl overflow-hidden shadow-sm">
          {STATS.map((s, i) => (
            <div key={s.label} className="bg-white px-5 py-4 text-center">
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-xs uppercase tracking-wide text-gray-500 mt-0.5">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* Search + filter row */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by class, trainer, or location…"
              className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
          <div className="relative">
            <Filter
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-8 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 bg-white text-gray-700"
            >
              {SESSION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t === "all" ? "All types" : t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          tabs={TABS.map((t) => ({
            ...t,
            label: (
              <span className="flex items-center gap-1.5 ">
                {t.label}
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full  ${activeTab === t.id ? "bg-white/30 text-white" : "bg-gray-200 text-gray-600 bg"}`}
                >
                  {t.id === "upcoming"
                    ? upcomingCount
                    : t.id === "past"
                      ? completedCount
                      : cancelledCount}
                </span>
              </span>
            ),
          }))}
          active={activeTab}
          onChange={(id) => {
            setActiveTab(id);
            setSearch("");
            setFilterType("all");
          }}
        />

        {/* Tab content */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <EmptyState
              label={
                activeTab === "upcoming"
                  ? "No upcoming bookings. Start by booking a session."
                  : activeTab === "past"
                    ? "No past bookings yet."
                    : "No cancelled bookings."
              }
              cta="Book a Session"
              onCta={() => setShowBookModal(true)}
            />
          ) : (
            filteredBookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={handleCancel}
                onRebook={handleRebook}
              />
            ))
          )}
        </div>
      </div>

      {/* ─── Book a Session Modal ─── */}
      {showBookModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="font-semibold text-gray-900">Book a Session</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {AVAILABLE.filter((a) => !bookedIds.has(a.id)).length}{" "}
                  sessions available
                </p>
              </div>
              <button
                onClick={() => setShowBookModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 p-6">
              <div className="space-y-3">
                {AVAILABLE.map((cls) => {
                  if (bookedIds.has(cls.id)) {
                    return (
                      <div
                        key={cls.id}
                        className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3"
                      >
                        <CheckCircle
                          size={16}
                          className="text-emerald-600 shrink-0"
                        />
                        <span className="text-sm font-medium text-emerald-700">
                          {cls.title} — Booked!
                        </span>
                      </div>
                    );
                  }
                  return (
                    <AvailableClassCard
                      key={cls.id}
                      item={cls}
                      onBook={handleBook}
                    />
                  );
                })}
              </div>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-gray-100 shrink-0">
              <button
                onClick={() => setShowBookModal(false)}
                className="w-full py-2.5 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
