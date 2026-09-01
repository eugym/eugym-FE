"use client";

import { useDashboardUser } from "../components/DashboardContext";
import Admin            from "../admin/page";
import RegularDashboard from "../user/regular/page";
import StandardDashboard from "../user/standard/page";
import PremiumDashboard  from "../user/premium/page";
import TrainerDashboard  from "../user/trainers/page";
import AffiliateDashboard from "../affiliate/page";
import FeatureUnavailable from "@/components/FeatureUnavailable/FeatureUnavailable";

export default function DashboardStats() {
  const user = useDashboardUser();

  switch (user.role) {
    case "SUPER_ADMIN":
    case "ADMIN":
      return <Admin />;

    case "REGULAR":
      return <RegularDashboard />;

    case "STANDARD":
      return <StandardDashboard />;

    case "PREMIUM":
      return <PremiumDashboard />;

    case "TRAINER":
      return <TrainerDashboard />;

    case "AFFILIATE_PARTNER":
      return <AffiliateDashboard />;

    // This page *is* the dashboard, so a "Back to dashboard" button here would
    // link to itself. Use the sidebar instead.
    case "CORPORATE_ADMIN":
      return (
        <FeatureUnavailable
          title="Corporate Admin Dashboard"
          description="Your company overview is on the way. In the meantime, use the sidebar to browse membership plans."
          showBackButton={false}
        />
      );

    default:
      return (
        <FeatureUnavailable
          title="Dashboard unavailable"
          description="There's no dashboard for your account type yet. Please contact support if you think this is a mistake."
          showBackButton={false}
        />
      );
  }
}
