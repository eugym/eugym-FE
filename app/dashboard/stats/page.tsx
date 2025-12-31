"use client";
import Regular from "../user/regular/page";
import StandardDashboard from "../user/standard/page";
import PremiumUser from "../user/premium/page";
import { getUserRole } from "@/app/api/lib/role";
import UnauthorizedPage from "@/components/UnauthorizedPage";
// import PremiumUser from "@/app/user---/premiumUser";

function Dashboardstats() {
  // const [role, setRole] = useState("admin");
  // const [role, setRole] = useState("trainer");
  // const [role, setRole] = useState("affiliate");
  // const [role, setRole] = useState("standard");
  // const [role, setRole] = useState("premium");
  // const [role, setRole] = useState("regular");

  const role = getUserRole();
  switch (role as string) {
    case "ADMIN":
      return <div>admin</div>;
    case "AFFILIATE_PARTNER":
      return <div>affiliate</div>;
    case "TRAINER":
      return <div>trainer</div>;
    case "REGULAR":
      return <Regular />;
    case "STANDARD":
      return <StandardDashboard />;
    case "PREMIUM":
      return <PremiumUser />;
    case "CORPORATE_ADMIN":
      return <div>CORPORATE ADMIN</div>;

    default:
      return UnauthorizedPage();
  }
}

export default Dashboardstats;
