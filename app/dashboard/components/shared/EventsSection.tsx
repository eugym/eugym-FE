"use client";

import { MapPin, Calendar, Users } from "lucide-react";

interface Event {
  id: string;
  date: string;
  title: string;
  location: string;
  spots: number;
  tag: "Free" | "Paid";
  price?: string;
}

const EVENTS: Event[] = [
  { id: "e1", date: "SAT, JUN 14",  title: "Beach Yoga Session",        location: "Tarkwa Bay Beach, Lagos",   spots: 12, tag: "Free" },
  { id: "e2", date: "SUN, JUN 15",  title: "5K Morning Run",             location: "Lekki Conservation Centre", spots: 30, tag: "Free" },
  { id: "e3", date: "SAT, JUN 21",  title: "CrossFit Open Challenge",    location: "Victoria Island, Lagos",    spots: 8,  tag: "Free" },
  { id: "e4", date: "MON, JUN 23",  title: "Nutrition Masterclass",      location: "Online (Zoom)",             spots: 50, tag: "Free" },
  { id: "e5", date: "SAT, JUN 28",  title: "Pool Aerobics Session",      location: "Eko Hotel, Lagos",          spots: 20, tag: "Paid", price: "₦2,500" },
  { id: "e6", date: "SUN, JUN 29",  title: "Weekend Bootcamp",           location: "National Stadium, Lagos",   spots: 15, tag: "Free" },
];

interface EventsSectionProps {
  title?: string;
  filter?: "Free" | "Paid" | "all";
  limit?: number;
}

function EventCard({ item }: { item: Event }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-medium text-sky-500">
            <Calendar size={11} />
            {item.date}
          </div>
          <h5 className="text-sm font-semibold text-gray-900 mt-1.5">{item.title}</h5>
          <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
            <MapPin size={11} className="text-rose-400 shrink-0" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
        </div>
        <span className={`shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full ${
          item.tag === "Free"
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}>
          {item.tag === "Paid" && item.price ? item.price : "Free"}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <Users size={11} />
          <span>{item.spots} spots left</span>
        </div>
        <button className="text-xs border border-emerald-400 text-emerald-600 px-3 py-1.5 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
          {item.tag === "Free" ? "Register Free" : "Book Now"}
        </button>
      </div>
    </div>
  );
}

export default function EventsSection({
  title = "Upcoming Events",
  filter = "all",
  limit = 6,
}: EventsSectionProps) {
  const events = EVENTS
    .filter((e) => filter === "all" || e.tag === filter)
    .slice(0, limit);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌤️</span>
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>
        </div>
        <button className="text-xs text-emerald-600 hover:underline font-medium">View all</button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm bg-white rounded-xl border border-dashed border-gray-200">
          No events available right now. Check back soon!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((ev) => (
            <EventCard key={ev.id} item={ev} />
          ))}
        </div>
      )}
    </section>
  );
}
