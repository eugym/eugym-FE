"use client";

import { MapPin } from "lucide-react";

interface EventItem {
  id: string;
  date?: string;
  title?: string;
  location?: string;
  spots?: number;
  tag?: "Free" | "Paid";
}
const events: EventItem[] = [
  {
    id: "e1",
    date: "SAT, MAR 30",
    title: "Beach Yoga Session",
    location: "Tarkwa Bay Beach, Lagos",
    spots: 12,
    tag: "Free",
  },
  {
    id: "e2",
    date: "SAT, MAR 30",
    title: "Beach Yoga Session",
    location: "Tarkwa Bay Beach, Lagos",
    spots: 12,
    tag: "Free",
  },
  {
    id: "e3",
    date: "SAT, MAR 30",
    title: "Beach Yoga Session",
    location: "Tarkwa Bay Beach, Lagos",
    spots: 12,
    tag: "Free",
  },
  {
    id: "e4",
    date: "SAT, MAR 30",
    title: "Beach Yoga Session",
    location: "Tarkwa Bay Beach, Lagos",
    spots: 12,
    tag: "Free",
  },
  {
    id: "e5",
    date: "SAT, MAR 30",
    title: "Beach Yoga Session",
    location: "Tarkwa Bay Beach, Lagos",
    spots: 12,
    tag: "Free",
  },
];

function EventCard({ id, date, title, location, spots }: EventItem) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🌤️</div>
          <h3 className="text-lg font-semibold text-gray-900">
            Free Outdoor Events
          </h3>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-sky-500 font-medium">{date}</div>
          <h5 className="text-gray-900 font-semibold mt-2">{title}</h5>
          <div className="flex items-center text-sm text-gray-500 mt-2">
            <MapPin size={14} className="mr-1 text-rose-500" />
            <span>{location}</span>
          </div>
          <div className="text-sm text-emerald-600 mt-2">
            {spots} spots available
          </div>
        </div>
        <div className="self-end">
          <button className="border border-emerald-400 text-emerald-600 px-4 py-2 rounded-md text-sm font-semibold hover:bg-emerald-50">
            Register For Free
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Events() {
  return (
    <>
      <div className="mb-4 flex items-center justify-between bg-amber-300">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🌤️</div>
          <h3 className="text-lg font-semibold text-gray-900">
            Free Outdoor Events
          </h3>
        </div>
        {/* Event grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 bg-accent">
          {events.map((ev) => (
            <EventCard key={ev.id} {...ev} />
          ))}
        </div>
      </div>
    </>
  );
}
