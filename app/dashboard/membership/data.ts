export type PlanId = "regular" | "standard" | "premium";

export interface Plan {
  id: PlanId;
  title: string;
  description: string;
  price: string;
  priceSlash?: string;
  priceLabel: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
}

export const Dailyplans: Plan[] = [
  {
    id: "regular",
    title: "Regular",
    description: "Get started with outdoor fitness and basic access.",
    price: "Free",
    priceLabel: "/ day",
    features: [
      "Account & app access",
      "Browse gyms & services",
      "AI trainer recommendations",
      "Free outdoor events registration",
      "Arena (outdoor callisthenics) access",
      "Basic workout videos",
      "Event participation (public)",
      "Merchandise store access",
    ],
    buttonText: "Choose Regular",
  },
  {
    id: "standard",
    title: "Standard",
    description: "Best value for consistent gym-goers.",
    price: "₦2,999",
    priceSlash: "₦3,499",
    priceLabel: "/ day",
    highlight: true,
    features: [
      "Everything in Regular",
      "Indoor gym access",
      "Multi-location access",
      "Unlimited group class bookings",
      "Equipment usage & lockers",
      "AI workout programs",
      "Fitness progress tracking",
      "Priority support",
    ],
    buttonText: "Choose Standard",
  },
  {
    id: "premium",
    title: "Premium",
    description: "Full access with personal training and coaching.",
    price: "₦4,599",
    priceSlash: "₦5,499",
    priceLabel: "/ day",
    features: [
      "Everything in Standard",
      "Trainer-led sessions",
      "Personalised coaching & programs",
      "Access to ALL Eugym locations",
      "Affiliate hotel gym access",
      "Premium indoor activities",
      "Priority class bookings",
      "Advanced analytics",
    ],
    buttonText: "Choose Premium",
  },
];

export const MonthlyPlans: Plan[] = [
  {
    id: "regular",
    title: "Regular",
    description: "Basic access for casual members.",
    price: "Free",
    priceLabel: "/ month",
    features: [
      "Account & app access",
      "Browse gyms & services",
      "AI trainer recommendations",
      "Free outdoor events registration",
      "Arena (outdoor callisthenics) access",
      "Basic workout videos",
      "Event participation (public)",
    ],
    buttonText: "Choose Regular",
  },
  {
    id: "standard",
    title: "Standard",
    description: "Group classes and gym access at your designated location.",
    price: "₦84,999",
    priceSlash: "₦104,999",
    priceLabel: "/ month",
    highlight: true,
    features: [
      "Everything in Regular",
      "Access to designated gym location",
      "Unlimited group class bookings",
      "Equipment usage & lockers",
      "Fitness progress tracking",
      "Check-in / attendance tracking",
      "Priority support",
    ],
    buttonText: "Choose Standard",
  },
  {
    id: "premium",
    title: "Premium",
    description: "Personal training and nationwide access to all facilities.",
    price: "₦30,999",
    priceSlash: "₦50,499",
    priceLabel: "/ month",
    features: [
      "Everything in Standard",
      "Custom workout & diet plans",
      "Access to ALL Eugym locations",
      "Affiliate hotel gym access",
      "Premium indoor activities",
      "Priority class bookings",
      "Dedicated account manager",
    ],
    buttonText: "Choose Premium",
  },
];

export const QuarterlyPlans: Plan[] = [
  {
    id: "regular",
    title: "Regular",
    description: "Basic access for casual members.",
    price: "Free",
    priceLabel: "/ quarter",
    features: [
      "Account & app access",
      "Browse gyms & services",
      "AI trainer recommendations",
      "Free outdoor events registration",
      "Arena (outdoor callisthenics) access",
      "Basic workout videos",
      "Event participation (public)",
    ],
    buttonText: "Choose Regular",
  },
  {
    id: "standard",
    title: "Standard",
    description: "Group classes and gym access at your designated location.",
    price: "₦84,999",
    priceSlash: "₦104,999",
    priceLabel: "/ quarter",
    highlight: true,
    features: [
      "Everything in Regular",
      "Access to designated gym location",
      "Unlimited group class bookings",
      "Equipment usage & lockers",
      "Fitness progress tracking",
      "Check-in / attendance tracking",
      "Priority support",
    ],
    buttonText: "Choose Standard",
  },
  {
    id: "premium",
    title: "Premium",
    description: "Personal training and nationwide access to all facilities.",
    price: "₦119,999",
    priceSlash: "₦149,999",
    priceLabel: "/ quarter",
    features: [
      "Everything in Standard",
      "Custom workout & diet plans",
      "Access to ALL Eugym locations",
      "Affiliate hotel gym access",
      "Premium indoor activities",
      "Priority class bookings",
      "Dedicated account manager",
    ],
    buttonText: "Choose Premium",
  },
];
