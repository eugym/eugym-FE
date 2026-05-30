"use client";

import { Dumbbell, Calendar, TrendingUp, CheckCircle } from "lucide-react";
import { useDashboardUser } from "@/app/dashboard/components/DashboardContext";
import DashboardHeader from "@/app/dashboard/components/shared/DashboardHeader";
import StatChip from "@/app/dashboard/components/shared/StatChip";
import TipCard from "@/app/dashboard/components/shared/TipCard";
import AITrainerCard from "@/app/dashboard/components/shared/AITrainerCard";
import EventsSection from "@/app/dashboard/components/shared/EventsSection";
import WorkoutPlanWidget from "@/app/dashboard/components/shared/WorkoutPlanWidget";
import UpgradeCTA from "@/app/dashboard/components/shared/UpgradeCTA";
import MealPlanCard from "@/components/cards/MealPlanCard";

export default function StandardDashboard() {
  const user = useDashboardUser();

  return (
    <div className="space-y-6 px-4 sm:px-5 py-5 max-w-7xl mx-auto">
      <DashboardHeader user={user} />

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatChip icon={<Dumbbell size={16} />}    label="Sessions this month" value="12"       color="emerald" />
        <StatChip icon={<Calendar size={16} />}    label="Upcoming bookings"   value="3"        color="sky" />
        <StatChip icon={<TrendingUp size={16} />}  label="Active streak"       value="7 days 🔥" color="amber" />
        <StatChip icon={<CheckCircle size={16} />} label="Plan"                value="Standard" color="indigo" />
      </div>

      {/* Tip + AI Trainer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TipCard />
        <AITrainerCard difficulty="Intermediate" workout="30-min resistance + cardio circuit" />
      </div>

      {/* Workout plan */}
      <WorkoutPlanWidget />

      {/* Workout plan download */}
      <MealPlanCard
        category="Workout Plan"
        title="8 Weeks Standard Strength Programme"
        uploadedBy="Eugym Coaches"
        uploadedAt="June 1, 2025 09:00"
        downloadUrl="/plans/standard-workout.pdf"
      />

      {/* Events */}
      <EventsSection title="Events & Classes" filter="all" limit={6} />

      {/* Upgrade to Premium — subtle */}
      <UpgradeCTA currentPlan="STANDARD" />
    </div>
  );
}
