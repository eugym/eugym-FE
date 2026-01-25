"use-client";
import Image from "next/image";
import { MapPin, CheckCircle } from "lucide-react";
import React from "react";
import insightIcon from "@/public/asset/insight.png";
import aiTrainer from "@/public/asset/aiTrainer.png";

// ------------------------- Types -------------------------

// const premiumFeatures: FeatureItem[] = [
//   { id: "f1", text: "Access to all gym locations nationwide" },
//   { id: "f2", text: "Access to premium hotel gym partners" },
//   { id: "f3", text: "Personal trainer assignments" },
//   { id: "f4", text: "Custom diet and workout plans" },
//   { id: "f5", text: "Priority booking for classes" },
// ];

// ------------------------- Components -------------------------
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
      {children}
    </span>
  );
}

function TipCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 ">
      <div className="flex items-start gap-4">
        <Image src={insightIcon} alt="insightIcom" className="w-8 h-8" />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">Today's Fitness Tip</h4>
          <p className="mt-2 text-sm text-gray-600">
            “Start your day with 10 minutes of stretching. It improves
            flexibility, reduces injury risk, and boosts energy levels
            throughout the day.”
          </p>
          <div className="mt-3">
            <a className="inline-flex items-center gap-2 text-sm text-emerald-700 font-medium border border-emerald-200 rounded-md px-3 py-2 hover:bg-emerald-50">
              Get Stretching Guides{" "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function AITrainerCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded bg-sky-50">
          <Image src={aiTrainer} alt="insightIcom" className="w-8 h-8" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">A.I Trainer</h4>
          <p className="mt-2 text-sm text-gray-600">Recommended for today</p>
          <p className="text-sm text-gray-500 mt-1">
            20-minute full body HIIT workout
          </p>
          <div className="mt-3">
            <Badge>Beginner</Badge>
            <button className="ml-4 inline-flex items-center px-4 py-2 border border-emerald-400 text-emerald-700 rounded-md text-sm font-semibold hover:bg-emerald-50">
              Start Workout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PremiumSection() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="text-2xl">💎</div>
            <h4 className="font-semibold text-gray-900">
              Unlock Premium Features
            </h4>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-600">
            {/* {premiumFeatures.map((f) => (
              <div key={f.id} className="flex items-start gap-2">
                <CheckCircle className="text-emerald-400 " size={20} />
                <div>{f.text}</div>
              </div>
            ))} */}
          </div>
        </div>
        <div className="flex items-center lg:justify-end">
          <button className="bg-emerald-600 text-white px-5 py-2 rounded-md font-semibold hover:brightness-95">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}

// ------------------------- Page -------------------------
export default function StandardDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-2 lg:p-1">
      <div className="max-w-7xl mx-auto">
        {/* Top two cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TipCard />
          <AITrainerCard />
        </div>

        {/* Premium */}
        {/* <div className="mb-6">
          <PremiumSection />
        </div> */}

        {/* Free Outdoor Events header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🌤️</div>
            <h3 className="text-lg font-semibold text-gray-900">
              Free Outdoor Events
            </h3>
          </div>
        </div>

        {/* Event grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* {events.map((ev) => (
            <EventCard key={ev.id} item={ev} />
          ))} */}
        </div>
      </div>
    </div>
  );
}
