"use client";
import React, { useState } from "react";
import { MapPin, Download, User, Star, MessageSquare } from "lucide-react";

type WorkoutDay = {
  id: string;
  name: string;
  title: string;
  minutes: number;
  active?: boolean;
};

const WORKOUT_DAYS: WorkoutDay[] = [
  { id: "mon", name: "Monday", title: "Upper Body Focus", minutes: 75 },
  { id: "tue", name: "Tuesday", title: "Lower Body Focus", minutes: 75 },
  { id: "wed", name: "Wednesday", title: "Upper Body Focus", minutes: 75 },
  { id: "thu", name: "Thursday", title: "Upper Body Focus", minutes: 75 },
  { id: "fri", name: "Friday", title: "Upper Body Focus", minutes: 75 },
  { id: "sat", name: "Saturday", title: "Upper Body Focus", minutes: 75 },
  { id: "sun", name: "Sunday", title: "Rest", minutes: 0 },
];

const EXERCISES = [
  { name: "Barbell Squats", sets: "4 sets × 8-10 reps" },
  { name: "Romanian Deadlifts", sets: "3 sets × 10-12 reps" },
  { name: "Bulgarian Split Squats", sets: "3 sets × 12 each leg" },
  { name: "Leg Press", sets: "3 sets × 15 reps" },
  { name: "Calf Raises", sets: "3 sets × 15 reps" },
];

export default function PremiumUser() {
  const [selectedDay, setSelectedDay] = useState<string>("tue");

  return (
    <div className="w-full">
      {/* ---------- Main ---------- */}
      <div className=" w-full sm:px-2 px-1">
        {/* Scrollable content area */}
        <main className="">
          <div className="w-full sm:px-3 px-1 mx-auto space-y-6">
            {/* Top cards row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Trainer Card (col-span 2 on large) */}
              <div className="lg:col-span-2 bg-white rounded-xl p-6  border border-gray-100 shadow-xl flex-auto">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div className="flex items-start gap-4">
                    <img
                      src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=60"
                      alt="trainer"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">
                        My Personal Trainer
                      </h3>
                      <div className="mt-2">
                        <div className="text-sm font-medium">
                          Michael Johnson
                        </div>
                        <div className="text-xs text-gray-500">
                          Certified Strength & Conditioning Specialist
                        </div>
                        <div className="flex items-center gap-3 mt-2 text-xs">
                          <div className="flex items-center gap-1 text-amber-500">
                            <Star size={14} />
                            <span className="font-semibold">4.8 rating</span>
                          </div>
                          <div className="text-gray-400">•</div>
                          <div className="text-gray-500">
                            8 years Experience
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-3">
                          <div className="flex items-center gap-2">
                            <User size={14} />
                            <span>95 clients</span>
                          </div>
                          <div className="text-gray-300">•</div>
                          <div>7 years experience</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next session box */}
                  <div className="min-w-[180px] rounded-lg px-5 py-6 text-center bg-gradient-to-br from-primary to-green-400 text-white">
                    <div className="text-sm opacity-90">Next Session</div>
                    <div className="text-sm font-semibold mt-1">
                      Tomorrow 4:00 PM
                    </div>
                    <div className="text-xs mt-3">Upper Body Focus</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <button className="bg-primary text-white px-5 py-2 rounded-md font-semibold hover:brightness-95">
                    Book New Session
                  </button>
                  <button className="border border-emerald-400 text-emerald-600 px-5 py-2 rounded-md font-semibold">
                    Message Trainer
                  </button>
                  <button className="ml-auto hidden lg:inline-flex items-center gap-2 text-sm text-gray-500 px-3 py-2 rounded-md border border-gray-200">
                    <MessageSquare size={16} />
                    Contact
                  </button>
                </div>
              </div>

              {/* AI Trainer */}
              <div className="bg-white rounded-xl p-6  border border-gray-100 shadow-xl">
                <div className="flex items-start gap-4">
                  <div className="rounded-full p-2 bg-sky-50">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C13.1 2 14 2.9 14 4V7H10V4C10 2.9 10.9 2 12 2Z"
                        fill="#60A5FA"
                      />
                      <path
                        d="M6 10V9C6 6.79086 7.79086 5 10 5H14C16.2091 5 18 6.79086 18 9V10"
                        fill="#93C5FD"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">A.I Trainer</h4>
                    <p className="text-sm text-gray-600 mt-2">
                      Recommended for today
                    </p>
                    <p className="text-sm text-gray-500">
                      20-minute full body HIIT workout
                    </p>

                    <div className="mt-4">
                      <span className="text-sm text-emerald-600 font-medium">
                        Beginner
                      </span>
                      <div className="mt-4">
                        <button className="w-full border border-emerald-400 text-emerald-600 py-2 rounded-md font-semibold hover:bg-emerald-50">
                          Start Workout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Workout Plan section */}
            <section className="bg-white rounded-xl p-6 shadow-xl border border-gray-100 w-full px-5 hidden  ">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">📅</div>
                  <h3 className="text-lg font-semibold">Workout Plan</h3>
                </div>

                <div className="text-emerald-600">
                  <button className="p-2 rounded-md border border-emerald-100 hover:bg-emerald-50">
                    <Download size={18} />
                  </button>
                </div>
              </div>

              {/* Days row */}
              <div className="mt-6">
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 whitespace-nowrap">
                  {WORKOUT_DAYS.map((d) => {
                    const active = d.id === selectedDay;
                    return (
                      <button
                        key={d.id}
                        onClick={() => setSelectedDay(d.id)}
                        className={`flex-shrink-0 min-w-[160px] text-left p-4 rounded-lg border ${
                          active
                            ? "border-sky-500 shadow-sm bg-white"
                            : "border-gray-200 bg-white/50"
                        } ${active ? "ring-2 ring-sky-100" : ""}`}
                      >
                        <div
                          className={`text-xs font-semibold ${
                            active ? "text-sky-600" : "text-gray-500"
                          }`}
                        >
                          {d.name}
                        </div>
                        <div
                          className={`mt-2 font-semibold ${
                            active ? "text-sky-900" : "text-gray-800"
                          }`}
                        >
                          {d.title}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {d.minutes} Minutes
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Today's focus / exercises */}
              <div className="mt-6 border border-gray-200 rounded-lg p-6 bg-white">
                <div className="flex flex-wrap justify-between items-start gap-4">
                  <div>
                    <h4 className="text-lg font-semibold">
                      Today's Focus: Lower Body Strength
                    </h4>
                    <ul className="mt-4 space-y-3">
                      {EXERCISES.map((ex) => (
                        <li
                          key={ex.name}
                          className="flex justify-between items-start"
                        >
                          <div className="text-sm font-medium text-gray-700">
                            {ex.name}
                          </div>
                          <div className="text-sm text-gray-500">{ex.sets}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="ml-6 hidden md:block w-48 text-right text-sm text-gray-400">
                    <div className="mb-2">Duration: 75 min</div>
                    <div>Difficulty: Intermediate</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Extra spacing bottom */}
            <div className="h-8" />
          </div>
        </main>
      </div>
    </div>
  );
}
