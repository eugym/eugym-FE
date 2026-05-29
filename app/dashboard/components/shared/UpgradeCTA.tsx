import { CheckCircle, ArrowRight } from "lucide-react";

interface UpgradeCTAProps {
  currentPlan: "REGULAR" | "STANDARD";
}

const CONFIG = {
  REGULAR: {
    heading: "Upgrade to Standard or Premium",
    subheading: "You're on the Regular plan. Unlock bookings, workout plans, and more.",
    color: "from-sky-600 to-indigo-700",
    features: [
      "Gym access & class bookings",
      "Personalised workout plans",
      "Events & community challenges",
      "Upgrade anytime, cancel anytime",
    ],
    cta: "View Plans",
  },
  STANDARD: {
    heading: "Unlock Premium Features",
    subheading: "Go Premium for a personal trainer, meal plans, and hotel gym access.",
    color: "from-amber-500 to-orange-600",
    features: [
      "Dedicated personal trainer",
      "Custom meal & diet plans",
      "Premium hotel gym partners",
      "Priority class booking",
    ],
    cta: "Upgrade to Premium",
  },
};

export default function UpgradeCTA({ currentPlan }: UpgradeCTAProps) {
  const c = CONFIG[currentPlan];

  return (
    <div className={`rounded-xl bg-gradient-to-br ${c.color} p-6 text-white shadow-md`}>
      <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
        <div className="flex-1">
          <h4 className="text-lg font-bold">{c.heading}</h4>
          <p className="text-sm opacity-80 mt-1">{c.subheading}</p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {c.features.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm opacity-90">
                <CheckCircle size={14} className="shrink-0 opacity-80" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0">
          <button className="inline-flex items-center gap-2 bg-white text-gray-800 font-semibold px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm">
            {c.cta}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
