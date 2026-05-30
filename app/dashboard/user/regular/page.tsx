"use client";

import { Dumbbell, Calendar, MapPin } from "lucide-react";
import { useDashboardUser } from "@/app/dashboard/components/DashboardContext";
import DashboardHeader from "@/app/dashboard/components/shared/DashboardHeader";
import StatChip from "@/app/dashboard/components/shared/StatChip";
import TipCard from "@/app/dashboard/components/shared/TipCard";
import AITrainerCard from "@/app/dashboard/components/shared/AITrainerCard";
import EventsSection from "@/app/dashboard/components/shared/EventsSection";
import UpgradeCTA from "@/app/dashboard/components/shared/UpgradeCTA";

export default function RegularDashboard() {
  const user = useDashboardUser();

  return (
    <div className="space-y-6 px-4 sm:px-5 py-5 max-w-7xl mx-auto">
      <DashboardHeader user={user} />

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatChip icon={<Dumbbell size={16} />}  label="Sessions this month" value="4"          color="emerald" />
        <StatChip icon={<Calendar size={16} />}  label="Events joined"       value="2"          color="sky" />
        <StatChip icon={<MapPin size={16} />}    label="Nearest gym"         value="2.4 km"     color="indigo" />
        <StatChip icon={<Dumbbell size={16} />}  label="Current plan"        value="Regular"    color="gray" />
      </div>

      {/* Upgrade CTA — most prominent for Regular */}
      <UpgradeCTA currentPlan="REGULAR" />

      {/* Tip + AI Trainer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TipCard />
        <AITrainerCard difficulty="Beginner" workout="20-min full body HIIT — no equipment needed" />
      </div>

      {/* Free events */}
      <EventsSection title="Free Outdoor Events Near You" filter="Free" limit={6} />
    </div>
  );
}
