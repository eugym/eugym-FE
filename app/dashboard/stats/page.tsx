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

    case "CORPORATE_ADMIN":
      return <FeatureUnavailable title="Corporate Admin Dashboard" showBackButton />;

    default:
      return <FeatureUnavailable title="Dashboard unavailable" showBackButton />;
  }
}
