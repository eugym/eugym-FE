"use client";

import { CheckCircle } from "lucide-react";
import DisabledRoleGate, {
  MyUserRole,
} from "@/components/guards/DisabledRoleGate";
import WorkoutPlan from "./features/workoutPlan";
import { AITrainer } from "./features/aiTrainning";
import { UserTrainer } from "./features/userTrainers";
import MealPlan from "./features/mealPlan";
import TipCard from "./features/tips";
import Banner from "@/components/banner";
import { useState } from "react";
import { useAuthStore } from "@/app/store/auth";

function UserDashboard() {
  const [showBanner, setShowBanner] = useState(true);
  const role = useAuthStore((s) => s.user?.role);
  return (
    <>
      <div className="sticky top-1">
        {showBanner && (
          <Banner
            title="Upgrade Plan"
            description="enjoy full plan packages and lots more."
            // variant="warning"
            // variant="success"
            variant="info"
            onClose={() => setShowBanner(false)}
            onAction={() => console.log("click")}
            actionText="update payment"
          />
        )}
      </div>

      <main className="w-full my-2 sm:px-3 px-1 mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6  border border-gray-100 shadow-xl flex-auto">
            <DisabledRoleGate allow={[role as MyUserRole]}>
              <UserTrainer />
            </DisabledRoleGate>
          </div>
          <AITrainer />
        </div>{" "}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <TipCard />
          <AITrainer />
        </div>
        <PremiumSection />
        <DisabledRoleGate allow={[role as MyUserRole]}>
          <WorkoutPlan />
        </DisabledRoleGate>
        <MealPlan />
        {/* <PremiumUser /> */}
        {/* <StandardDashboard /> */}
        {/* <Events/> */}
      </main>
      {/* </div> */}
    </>
  );
}

export default UserDashboard;

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
