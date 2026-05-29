"use client";
import StandardDashboard from "../user/standard/page";
import PremiumUser from "../user/premium/page";
import UnauthorizedPage from "@/components/UnauthorizedPage";
import Admin from "../admin/page";
import UserDashboard from "../user/page";
import FeatureUnavailable from "@/components/FeatureUnavailable/FeatureUnavailable";
import { useAuthStore } from "@/app/store/auth";

function Dashboardstats() {
  const user = useAuthStore((s) => s.user);
  const role = user?.role;

  switch (role as string) {
    case "ADMIN":
      return <Admin />;
    case "AFFILIATE_PARTNER":
      return <FeatureUnavailable showBackButton title="Affiliate Partner page" />;
    case "TRAINER":
      return <FeatureUnavailable title="Trainer dashboard" showBackButton />;
    case "REGULAR":
      return <UserDashboard />;
    case "STANDARD":
      return <StandardDashboard />;
    case "PREMIUM":
      return <UserDashboard />;
    case "CORPORATE_ADMIN":
      return <FeatureUnavailable title="CORPORATE ADMIN" />;
    default:
      return UnauthorizedPage();
  }
}

export default Dashboardstats;
