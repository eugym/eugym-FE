"use client";

import { useState } from "react";
import { Layers, CalendarDays, ShieldCheck } from "lucide-react";
import PlanCard from "../components/cards/planCard";
import Tabs from "../components/tabs";
import { useDashboardUser } from "../components/DashboardContext";
import { Dailyplans, MonthlyPlans, QuarterlyPlans } from "./data";
import type { PlanId } from "./data";
import type { Role } from "@/app/store/auth";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const ROLE_TO_PLAN: Partial<Record<Role, PlanId>> = {
  REGULAR:  "regular",
  STANDARD: "standard",
  PREMIUM:  "premium",
};

const PLAN_TIER: Record<PlanId, number> = {
  regular:  0,
  standard: 1,
  premium:  2,
};

const PLAN_LABEL: Record<PlanId, string> = {
  regular:  "Regular",
  standard: "Standard",
  premium:  "Premium",
};

const TABS = [
  { id: "daily",     label: "Daily" },
  { id: "monthly",   label: "Monthly" },
  { id: "quarterly", label: "Quarterly" },
];

const PLANS_BY_TAB = {
  daily:     Dailyplans,
  monthly:   MonthlyPlans,
  quarterly: QuarterlyPlans,
};

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────
export default function MembershipPlans() {
  const user = useDashboardUser();
  const [activeTab, setActiveTab] = useState<"daily" | "monthly" | "quarterly">("daily");

  const currentPlanId: PlanId = ROLE_TO_PLAN[user.role] ?? "regular";
  const currentTier = PLAN_TIER[currentPlanId];
  const plans = PLANS_BY_TAB[activeTab];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-5 py-6 space-y-6">

        {/* Page header */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Membership Plans</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Choose the plan that fits your fitness journey, {user.firstName}
          </p>
        </div>

        {/* Current plan banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white border border-emerald-100 rounded-xl px-5 py-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <ShieldCheck size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                You're on the{" "}
                <span className="text-emerald-600">{PLAN_LABEL[currentPlanId]} plan</span>
              </p>
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                <CalendarDays size={11} />
                Renews on July 30, 2025
              </p>
            </div>
          </div>
          {currentPlanId !== "premium" && (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-3 py-1.5 rounded-full">
              <Layers size={12} />
              Upgrade available
            </span>
          )}
        </div>

        {/* Billing cycle tabs */}
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-3">
            Billing cycle
          </p>
          <Tabs
            tabs={TABS}
            active={activeTab}
            onChange={(id) => setActiveTab(id as typeof activeTab)}
          />
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {plans.map((plan) => (
            <PlanCard
              key={plan.id}
              {...plan}
              isCurrentPlan={plan.id === currentPlanId}
              currentPlanTier={currentTier}
              planTier={PLAN_TIER[plan.id]}
              onAction={() => {
                console.log(`Plan selected: ${plan.id} (${activeTab})`);
              }}
            />
          ))}
        </div>

        {/* Footer note */}
        <p className="text-center text-xs text-gray-400 pb-4">
          All plans include a 7-day free trial. Cancel anytime. Prices shown in NGN.
        </p>
      </div>
    </div>
  );
}
