"use client";
import Image from "next/image";
import { MapPin } from "lucide-react";
import Tabs from "../components/tabs";
import { useState } from "react";

interface EventCardProps {
  date: string;
  title: string;
  location: string;
  spots: number;
  type: "Free" | "Paid";
}

const events: EventCardProps[] = [
  {
    date: "SAT, MAR 30",
    title: "Beach Yoga Session",
    location: "Tarkwa Bay Beach, Lagos",
    spots: 12,
    type: "Paid",
  },
  {
    date: "SAT, MAR 30",
    title: "Beach Yoga Session",
    location: "Tarkwa Bay Beach, Lagos",
    spots: 12,
    type: "Free",
  },
  {
    date: "SAT, MAR 30",
    title: "Beach Yoga Session",
    location: "Tarkwa Bay Beach, Lagos",
    spots: 12,
    type: "Paid",
  },
  {
    date: "SAT, MAR 30",
    title: "Beach Yoga Session",
    location: "Tarkwa Bay Beach, Lagos",
    spots: 12,
    type: "Free",
  },
  {
    date: "SAT, MAR 30",
    title: "Beach Yoga Session",
    location: "Tarkwa Bay Beach, Lagos",
    spots: 12,
    type: "Paid",
  },
  {
    date: "SAT, MAR 30",
    title: "Beach Yoga Session",
    location: "Tarkwa Bay Beach, Lagos",
    spots: 12,
    type: "Free",
  },
];

export default function Events() {
  const [active, setActive] = useState("all");

  const tabList = [
    { id: "all", label: "All" },
    {
      id: "free",
      label: "Free",
    },
    { id: "paid", label: "Paid" },
  ];

  return (
    <div className="h-full sm:p-6 p-2 ">
      <aside className="mx-auto my-5">
        <Tabs tabs={tabList} active={active} onChange={setActive} />
      </aside>
      {active === "all" && (
        <>
          {" "}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event, index) => (
              <EventCard key={index} {...event} />
            ))}
          </div>{" "}
        </>
      )}
      {active === "free" && <> free events</>}
      {active === "paid" && <> paid events</>}
    </div>
  );
}

function EventCard({ date, title, location, spots, type }: EventCardProps) {
  return (
    <div className="bg-white sm:p-4 p-2 rounded-xl shadow-sm hover:shadow-md transition min-h-[210px] min-w-[350px]">
      <div className="flex justify-between items-center mb-2 text-sm">
        <span className="text-gray-600 font-medium">{date}</span>
        <span
          className={`px-3 py-1 text-xs rounded-full ${
            type === "Free"
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {type}
        </span>
      </div>
      <h3 className="text-gray-900 font-semibold text-lg mb-2">{title}</h3>
      <div className="flex items-center text-sm text-gray-600 mb-2">
        <MapPin size={16} className="mr-1" />
        <span>{location}</span>
      </div>
      <p className="text-xs text-green-600 mb-4">{spots} spots available</p>
      <button className="flex px-5.5 border border-green-600 text-green-600 py-2 rounded-lg font-semibold hover:bg-green-600 hover:text-white transition mt-10 justify-self-end">
        Register
      </button>
    </div>
  );
}
