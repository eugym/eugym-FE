"use client";

import { useState } from "react";
import Tabs from "../components/tabs";

const stats = [
  { label: "Completed this month", value: 5 },
  { label: "Upcoming bookings", value: 2 },
  { label: "Canceled bookings", value: 4 },
  { label: "Total attended", value: 190 },
];

const bookings = [
  {
    date: "23-09-2025",
    time: "6:00 PM - 7:00 PM",
    title: "Upper Body Strength",
    trainer: "David Chen",
    duration: "45 min · Personal Training",
    location: "Eugym Victoria Island",
    status: "upcoming",
    action: "manage",
  },
  {
    date: "23-09-2025",
    time: "6:00 PM - 7:00 PM",
    title: "Upper Body Strength",
    trainer: "David Chen",
    duration: "45 min · Personal Training",
    location: "Eugym Victoria Island",
    status: "upcoming",
    action: "manage",
  },
  {
    date: "23-09-2025",
    time: "6:00 PM - 7:00 PM",
    title: "Upper Body Strength",
    trainer: "David Chen",
    duration: "45 min · Personal Training",
    location: "Eugym Victoria Island",
    status: "available",
    action: "book",
  },
];

export default function Bookings() {
  const [active, setActive] = useState("upcoming");

  const tabList = [
    { id: "upcoming", label: "Upcoming" },
    {
      id: "past_booking",
      label: "Past Bookings",
    },
    { id: "canceled_booking", label: "Canceled Bookings" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 sm:p-5 p-2 w-full">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 rounded-xl bg-white p-6 shadow-sm md:grid-cols-4 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center border-r border-gray">
              <p className="text-2xl font-semibold text-gray-900 ">
                {stat.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wide text-gray-500">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex ">
          <Tabs tabs={tabList} active={active} onChange={setActive} />
        </div>

        {/* Upcoming Booking Tab items */}
        {active === "upcoming" && (
          <div>
            <div className="space-y-4">
              {bookings.map((booking, index) => (
                <div
                  key={index}
                  className="flex flex-col justify-between rounded-xl border border-gray  bg-white p-6 shadow-md md:flex-row"
                >
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">
                      {booking.date} · {booking.time}
                    </p>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {booking.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      with {booking.trainer}
                    </p>
                    <p className="text-sm text-green-600">{booking.duration}</p>
                    <p className="text-sm text-gray-500">
                      📍 {booking.location}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center gap-3 md:mt-0">
                    <span className="text-xs text-gray-500">
                      Starting in 2 hours
                    </span>

                    {booking.action === "manage" ? (
                      <>
                        <button className="rounded-md border border-blue-500 px-4 py-2 text-sm text-blue-500 hover:bg-blue-50">
                          Schedule
                        </button>
                        <button className="rounded-md border border-red-500 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600">
                        Book Now
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ******* Past Bookings Tab ****** */}
        {active === "past_booking" && <div>No Past bookings yet....</div>}
        {active === "canceled_booking" && (
          <div>No Canceled bookings yet....</div>
        )}
      </div>
    </div>
  );
}
