"use client";

import { useState } from "react";
import { Download } from "lucide-react";

interface WorkoutDay {
  id: string;
  name: string;
  title: string;
  minutes: number;
}

const DAYS: WorkoutDay[] = [
  { id: "mon", name: "Mon", title: "Upper Body", minutes: 75 },
  { id: "tue", name: "Tue", title: "Lower Body", minutes: 75 },
  { id: "wed", name: "Wed", title: "Core & Cardio", minutes: 60 },
  { id: "thu", name: "Thu", title: "Upper Body", minutes: 75 },
  { id: "fri", name: "Fri", title: "Full Body", minutes: 90 },
  { id: "sat", name: "Sat", title: "Flexibility", minutes: 45 },
  { id: "sun", name: "Sun", title: "Rest Day", minutes: 0 },
];

const EXERCISES: Record<string, { name: string; sets: string }[]> = {
  mon: [
    { name: "Barbell Bench Press", sets: "4 × 8-10 reps" },
    { name: "Pull-Ups", sets: "3 × 8 reps" },
    { name: "Dumbbell Shoulder Press", sets: "3 × 12 reps" },
    { name: "Tricep Dips", sets: "3 × 15 reps" },
  ],
  tue: [
    { name: "Barbell Squats", sets: "4 × 8-10 reps" },
    { name: "Romanian Deadlifts", sets: "3 × 10-12 reps" },
    { name: "Bulgarian Split Squats", sets: "3 × 12 each leg" },
    { name: "Leg Press", sets: "3 × 15 reps" },
    { name: "Calf Raises", sets: "3 × 20 reps" },
  ],
  wed: [
    { name: "Plank Hold", sets: "3 × 60s" },
    { name: "Russian Twists", sets: "3 × 20 reps" },
    { name: "Bicycle Crunches", sets: "3 × 20 reps" },
    { name: "Treadmill Intervals", sets: "20 min" },
  ],
  thu: [
    { name: "Incline Dumbbell Press", sets: "4 × 10 reps" },
    { name: "Seated Cable Rows", sets: "3 × 12 reps" },
    { name: "Lateral Raises", sets: "4 × 15 reps" },
    { name: "Bicep Curls", sets: "3 × 15 reps" },
  ],
  fri: [
    { name: "Deadlift", sets: "4 × 6-8 reps" },
    { name: "Push-Ups", sets: "3 × 20 reps" },
    { name: "Goblet Squats", sets: "3 × 15 reps" },
    { name: "Farmer's Walk", sets: "3 × 40m" },
  ],
  sat: [
    { name: "Dynamic Stretching", sets: "15 min" },
    { name: "Yoga Flow", sets: "20 min" },
    { name: "Foam Rolling", sets: "10 min" },
  ],
  sun: [],
};

const TODAY_ID = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][
  new Date().getDay()
];

export default function WorkoutPlanWidget() {
  const [selected, setSelected] = useState(TODAY_ID);
  const exercises = EXERCISES[selected] ?? [];

  return (
    <section className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="text-xl">📅</span>
          <h3 className="font-semibold text-gray-900">Weekly Workout Plan</h3>
        </div>
        <button className="p-2 rounded-lg border border-emerald-100 hover:bg-emerald-50 text-emerald-600 transition-colors">
          <Download size={16} />
        </button>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar ">
        {DAYS.map((d) => {
          const active = d.id === selected;
          const isToday = d.id === TODAY_ID;
          return (
            <button
              key={d.id}
              onClick={() => setSelected(d.id)}
              className={`shrink-0 flex flex-col items-center px-4 py-3 rounded-xl border text-center transition-all min-w-[150px] ${
                active
                  ? "border-emerald-500 bg-emerald-50 ring-2 ring-emerald-100"
                  : "border-gray-200 hover:border-emerald-300"
              }`}
            >
              <span
                className={`text-xs font-semibold ${active ? "text-emerald-700" : "text-gray-500"}`}
              >
                {d.name}
                {isToday && (
                  <span className="ml-1 text-[9px] bg-emerald-500 text-white px-1 rounded-sm">
                    today
                  </span>
                )}
              </span>
              <span
                className={`text-xs mt-1 font-medium ${active ? "text-emerald-900" : "text-gray-700"}`}
              >
                {d.title}
              </span>
              <span className="text-[10px] text-gray-400 mt-0.5">
                {d.minutes > 0 ? `${d.minutes}min` : "—"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Exercise list */}
      <div className="mt-5 rounded-xl border border-gray-100 bg-gray-50 p-4">
        {exercises.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-4">
            Rest day — recover and recharge 💤
          </p>
        ) : (
          <ul className="space-y-3">
            {exercises.map((ex, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-medium text-gray-800">{ex.name}</span>
                </div>
                <span className="text-gray-500 text-xs">{ex.sets}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
