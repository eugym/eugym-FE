"use client";
import aiTrainer from "@/public/asset/aiTrainer.png";
import Image from "next/image";

export function AITrainer() {
  return (
    <div className="flex flex-col justify-center gap-3 bg-white rounded-xl p-6 border border-gray-100 shadow-xl">
      <div className="flex items-start gap-4">
        <div className="p-5 rounded bg-sky-50">
          <Image src={aiTrainer} alt="insightIcom" className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold">A.I Trainer</h4>
          <p className="text-sm text-gray-600 mt-2">Recommended for today</p>
          <p className="text-sm text-gray-500">
            20-minute full body HIIT workout
          </p>
        </div>
      </div>
      <div className="mt-4">
        <span className="text-sm text-emerald-600 font-medium">Beginner</span>
        <div className="mt-4">
          <button className="w-full border border-emerald-400 text-emerald-600 py-2 rounded-md font-semibold hover:bg-emerald-50">
            Start Workout
          </button>
        </div>
      </div>
    </div>
  );
}
