"use client";

import { CheckCircle, Dumbbell, Calendar, TrendingUp } from "lucide-react";
import { useState } from "react";
import DisabledRoleGate, { MyUserRole } from "@/components/guards/DisabledRoleGate";
import WorkoutPlan from "./features/workoutPlan";
import { AITrainer } from "./features/aiTrainning";
import { UserTrainer } from "./features/userTrainers";
import MealPlan from "./features/mealPlan";
import TipCard from "./features/tips";
import Banner from "@/components/banner";
import { useDashboardUser } from "../components/DashboardContext";

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// Quick stat for the user's personal dashboard
function UserStatChip({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
      <div className="text-emerald-600">{icon}</div>
      <div>
        <p className="text-xs text-gray-400">{label}</p>
        <p className="text-sm font-semibold text-gray-800">{value}</p>
      </div>
    </div>
  );
}

export default function UserDashboard() {
  const [showBanner, setShowBanner] = useState(true);
  const user = useDashboardUser();

  const isRegular = user.role === "REGULAR";
  const isPremium = user.role === "PREMIUM";
  const isStandard = user.role === "STANDARD";

  return (
    <>
      {/* Upgrade banner — only for REGULAR users */}
      {isRegular && showBanner && (
        <div className="sticky top-0 z-10">
          <Banner
            title="Upgrade Your Plan"
            description="Unlock personal trainers, advanced workout plans, and premium gym access nationwide."
            variant="info"
            onClose={() => setShowBanner(false)}
            onAction={() => console.log("upgrade")}
            actionText="View Plans"
          />
        </div>
      )}

      <main className="w-full px-4 sm:px-5 py-5 space-y-6 max-w-7xl mx-auto">
        {/* Personalised header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">
            {getGreeting()}, {user.firstName} 👋
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {isPremium ? "Premium Member" : isStandard ? "Standard Member" : "Member"} · {user.email}
          </p>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <UserStatChip icon={<Dumbbell size={18} />}  label="Workout Sessions" value="12 this month" />
          <UserStatChip icon={<Calendar size={18} />}  label="Next Booking"     value="Tomorrow 4pm" />
          <UserStatChip icon={<TrendingUp size={18} />} label="Streak"           value="7 days 🔥" />
          <UserStatChip icon={<CheckCircle size={18} />} label="Plan Status"    value={isPremium ? "Premium ✓" : isStandard ? "Standard ✓" : "Upgrade available"} />
        </div>

        {/* Trainer + AI trainer row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
            <DisabledRoleGate allow={[user.role as MyUserRole]}>
              <UserTrainer />
            </DisabledRoleGate>
          </div>
          <AITrainer />
        </div>

        {/* Tips + AI trainer */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <TipCard />
          <AITrainer />
        </div>

        {/* Premium promo — only for non-premium */}
        {!isPremium && <PremiumSection />}

        {/* Workout plan */}
        <DisabledRoleGate allow={[user.role as MyUserRole]}>
          <WorkoutPlan />
        </DisabledRoleGate>

        <MealPlan />
      </main>
    </>
  );
}

const premiumFeatures = [
  "Access to all gym locations nationwide",
  "Access to premium hotel gym partners",
  "Personal trainer assignments",
  "Custom diet and workout plans",
  "Priority booking for classes",
];

function PremiumSection() {
  return (
    <div className="bg-gradient-to-br from-emerald-600 to-green-700 rounded-xl p-6 text-white shadow-md">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="text-2xl">💎</div>
            <h4 className="font-semibold text-lg">Unlock Premium Features</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-emerald-50">
            {premiumFeatures.map((f) => (
              <div key={f} className="flex items-start gap-2">
                <CheckCircle className="text-emerald-200 shrink-0 mt-0.5" size={15} />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center lg:justify-end shrink-0">
          <button className="bg-white text-emerald-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  );
}
