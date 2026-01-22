import { Download } from "lucide-react";
import { useState } from "react";

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

export default function () {
  const [selectedDay, setSelectedDay] = useState<string>("tue");

  return (
    <>
      <section className="w-full rounded-xl border border-gray-100 bg-white p-4 sm:p-6 shadow-xl">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📅</div>
            <h3 className="text-base sm:text-lg font-semibold">Workout Plan</h3>
          </div>

          <button className="self-start sm:self-auto p-2 rounded-md border border-emerald-100 hover:bg-emerald-50 text-emerald-600">
            <Download size={18} />
          </button>
        </div>

        {/* Days row */}
        <div className="mt-6">
          <div className="grid grid-cols-5 gap-3 overflow-x-scroll pb-2 snap-x snap-mandatory ">
            {WORKOUT_DAYS.map((d) => {
              const active = d.id === selectedDay;
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDay(d.id)}
                  className={`snap-start flex-shrink-0 w-[150px] sm:w-[170px] text-left p-4 rounded-lg border transition 
                      ${
                        active
                          ? "border-sky-500 ring-2 ring-sky-100"
                          : "border-gray-200"
                      } bg-white`}
                >
                  <div
                    className={`text-xs font-semibold ${
                      active ? "text-sky-600" : "text-gray-500"
                    }`}
                  >
                    {d.name}
                  </div>
                  <div
                    className={`mt-2 text-sm font-semibold ${
                      active ? "text-sky-900" : "text-gray-800"
                    }`}
                  >
                    {d.title}
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    {d.minutes} Minutes
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Exercises */}
        <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 sm:p-6">
          <div className="flex flex-col gap-6 md:flex-row md:justify-between">
            {/* Left */}
            <div className="flex-1">
              <h4 className="text-base sm:text-lg font-semibold">
                Today&apos;s Focus: Lower Body Strength
              </h4>

              <ul className="mt-4 space-y-3">
                {EXERCISES.map((ex) => (
                  <li
                    key={ex.name}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="font-medium text-gray-700">{ex.name}</span>
                    <span className="text-gray-500">{ex.sets}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right stats */}
            <div className="flex flex-row justify-between md:flex-col md:items-end gap-2 text-sm text-gray-400 md:min-w-[160px]">
              <div>Duration: 75 min</div>
              <div>Difficulty: Intermediate</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
