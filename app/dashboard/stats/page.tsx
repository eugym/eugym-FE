"use client";

import { useDashboardUser } from "../components/DashboardContext";
import Admin from "../admin/page";
import UserDashboard from "../user/page";
import StandardDashboard from "../user/standard/page";
import FeatureUnavailable from "@/components/FeatureUnavailable/FeatureUnavailable";
import UnauthorizedPage from "@/components/UnauthorizedPage";

export default function DashboardStats() {
  const user = useDashboardUser();

  switch (user.role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return <Admin />;
    case "AFFILIATE_PARTNER":
      return <FeatureUnavailable showBackButton title="Affiliate Partner Dashboard" />;
    case "TRAINER":
      return <FeatureUnavailable title="Trainer Dashboard" showBackButton />;
    case "REGULAR":
      return <UserDashboard />;
    case "STANDARD":
      return <StandardDashboard />;
    case "PREMIUM":
      return <UserDashboard />;
    case "CORPORATE_ADMIN":
      return <FeatureUnavailable title="Corporate Admin Dashboard" />;
    default:
      return UnauthorizedPage();
  }
}
