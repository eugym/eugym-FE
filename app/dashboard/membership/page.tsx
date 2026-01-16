"use client";
import React, { useState } from "react";

import PlanCard from "../components/cards/planCard";
import Tabs from "../components/tabs";
import { Dailyplans, MonthlyPlans, QuarterlyPlans } from "./data";
import Banner from "@/components/banner/index";

export default function MembershipPlans() {
  const [active, setActive] = useState("daily");
  const [showBanner, setShowBanner] = useState(true);

  const tabList = [
    { id: "daily", label: "Daily" },
    {
      id: "monthly",
      label: "Monthly",
    },
    { id: "quarterly", label: "Quarterly" },
  ];
  return (
    <div className="min-h-screen w-full mx-auto px-1">
      <div className="sticky top-1">
        {showBanner && (
          <Banner
            title="Feature in progress"
            description="This module is currently under development."
            // variant="warning"
            // variant="success"
            variant="info"
            onClose={() => setShowBanner(false)}
            onAction={() => console.log("click")}
            actionText="update payment"
          />
        )}
      </div>

      <div className="p-2">
        <Tabs tabs={tabList} active={active} onChange={setActive} />

        <div className="mt-2">
          {active === "daily" && (
            <div className="flex flex-wrap gap-6 justify-center my-10">
              {Dailyplans.map((plan) => (
                <PlanCard key={plan.title} {...plan} />
              ))}
            </div>
          )}
          {active === "monthly" && (
            <>
              <div className="flex flex-wrap gap-6 justify-center my-10">
                {MonthlyPlans.map((plan) => (
                  <PlanCard key={plan.title} {...plan} />
                ))}
              </div>
            </>
          )}
          {active === "quarterly" && (
            <>
              <div className="flex flex-wrap gap-6 justify-center my-10">
                {QuarterlyPlans.map((plan) => (
                  <PlanCard key={plan.title} {...plan} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
