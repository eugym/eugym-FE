"use client";

import { Dumbbell, Calendar, TrendingUp, Star } from "lucide-react";
import { useDashboardUser } from "@/app/dashboard/components/DashboardContext";
import DashboardHeader from "@/app/dashboard/components/shared/DashboardHeader";
import StatChip from "@/app/dashboard/components/shared/StatChip";
import TrainerWidget from "@/app/dashboard/components/shared/TrainerWidget";
import AITrainerCard from "@/app/dashboard/components/shared/AITrainerCard";
import WorkoutPlanWidget from "@/app/dashboard/components/shared/WorkoutPlanWidget";
import TipCard from "@/app/dashboard/components/shared/TipCard";
import EventsSection from "@/app/dashboard/components/shared/EventsSection";
import MealPlanCard from "@/components/cards/MealPlanCard";

export default function PremiumDashboard() {
  const user = useDashboardUser();

  return (
    <div className="space-y-6 px-4 sm:px-5 py-5 max-w-7xl mx-auto">
      <DashboardHeader user={user} subtitle={`Full access · Premium Member since 2025`} />

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatChip icon={<Dumbbell size={16} />}   label="Sessions this month" value="18"       color="emerald" />
        <StatChip icon={<Calendar size={16} />}   label="Upcoming bookings"   value="5"        color="sky" />
        <StatChip icon={<TrendingUp size={16} />} label="Active streak"       value="14 days 🔥" color="amber" />
        <StatChip icon={<Star size={16} />}       label="Plan"                value="Premium ✓" color="indigo" />
      </div>

      {/* Personal trainer + AI trainer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <TrainerWidget />
        </div>
        <AITrainerCard difficulty="Advanced" workout="45-min HIIT + strength superset" />
      </div>

      {/* Workout plan */}
      <WorkoutPlanWidget />

      {/* Tip + Events side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TipCard />
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Gym Access</h4>
            <p className="text-sm text-gray-500">
              As a Premium member you have access to all partner gyms and hotel facilities nationwide.
            </p>
          </div>
          <button className="mt-4 w-full text-sm border border-emerald-400 text-emerald-600 py-2 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
            Find Nearest Gym
          </button>
        </div>
      </div>

      {/* Plans */}
      <section className="space-y-3">
        <h3 className="font-semibold text-gray-900">Your Plans</h3>
        <MealPlanCard
          category="Meal Plan"
          title="12 Weeks Premium Nutrition Programme"
          uploadedBy="Micheal Johnson"
          uploadedAt="June 1, 2025 09:00"
          downloadUrl="/plans/premium-meal.pdf"
        />
        <MealPlanCard
          category="Workout Plan"
          title="12 Weeks Strength & Conditioning"
          uploadedBy="Micheal Johnson"
          uploadedAt="June 1, 2025 09:00"
          downloadUrl="/plans/premium-workout.pdf"
        />
      </section>

      {/* Events */}
      <EventsSection title="Exclusive Events & Classes" filter="all" limit={6} />
    </div>
  );
}
