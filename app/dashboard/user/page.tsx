"use client";
// import PremiumUser from "./premium/page";
// import StandardDashboard from "./standard/page";
// import Regular from "./regular/page";
import MealPlanCard from "@/components/cards/MealPlanCard";
import React, { useState } from "react";
import {
  Download,
  User,
  Star,
  MessageSquare,
  CheckCircle,
  MapPin,
  Badge,
} from "lucide-react";
import Image from "next/image";
import aiTrainer from "@/public/asset/aiTrainer.png";
import DisabledRoleGate from "@/components/guards/DisabledRoleGate";
import WorkoutPlan from "./features/workoutPlan";
import { AITrainer } from "./features/aiTrainning";
import { UserTrainer } from "./features/userTrainers";

function UserDashboard() {
  return (
    <>
      <div className="w-full mt-2">
        {/* ---------- Main ---------- */}
        <div className=" w-full sm:px-2 px-1">
          {/* Scrollable content area */}
          <main className="">
            <div className="w-full sm:px-3 px-1 mx-auto space-y-6">
              {/* Top cards row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Trainer Card (col-span 2 on large) */}
                <div className="lg:col-span-2 bg-white rounded-xl p-6  border border-gray-100 shadow-xl flex-auto">
                  {/* <DisabledRoleGate allow={["member"]}> */}
                  <UserTrainer />
                  {/* </DisabledRoleGate> */}
                </div>
                <AITrainer />
              </div>
              <PremiumSection />
              {/* Workout Plan section */}
              <DisabledRoleGate allow={["member"]}>
                <WorkoutPlan />
              </DisabledRoleGate>

              {/* Extra spacing bottom */}
              <div className="" />
              <MealPlanCard
                category="Meal Plan"
                title="12 Weeks Strength and Conditioning"
                uploadedBy="Micheal Johnson"
                uploadedAt="September 23, 2025 13:50"
                downloadUrl="/plans/meal-plan.pdf"
              />

              <MealPlanCard
                category="Workout Plan"
                title="7 Days Fat Loss & Muscle Plan"
                uploadedBy="Micheal Johnson"
                uploadedAt="September 23, 2025 13:50"
                downloadUrl="/plans/workout-plan.pdf"
              />
            </div>

            <AITrainerCard />
            {/* <EventCard title="martins" date="today" /> */}
          </main>
        </div>
      </div>
    </>
  );
}

export default UserDashboard;

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

interface FeatureItem {
  id: string;
  text: string;
}

const premiumFeatures: FeatureItem[] = [
  { id: "f1", text: "Access to all gym locations nationwide" },
  { id: "f2", text: "Access to premium hotel gym partners" },
  { id: "f3", text: "Personal trainer assignments" },
  { id: "f4", text: "Custom diet and workout plans" },
  { id: "f5", text: "Priority booking for classes" },
];

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
            {premiumFeatures.map((f) => (
              <div key={f.id} className="flex items-start gap-2">
                <CheckCircle className="text-emerald-400 " size={20} />
                <div>{f.text}</div>
              </div>
            ))}
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

interface EventItem {
  id?: string;
  date?: string;
  title?: string;
  item?: string;
  location?: string;
  spots?: number;
  tag?: "Free" | "Paid";
}

function EventCard({ id, date, item, title, location, spots }: EventItem) {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition">
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
