import Image from "next/image";
import insightIcon from "@/public/asset/insight.png";

const TIPS = [
  "Start your day with 10 minutes of stretching. It improves flexibility, reduces injury risk, and boosts energy levels throughout the day.",
  "Drink at least 2–3 litres of water daily. Proper hydration improves performance, recovery, and mental clarity.",
  "Get 7–9 hours of sleep each night. Sleep is when your muscles repair and your body grows stronger.",
  "Prioritise compound movements like squats, deadlifts, and presses for maximum muscle activation.",
];

const tip = TIPS[new Date().getDay() % TIPS.length];

export default function TipCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start gap-4">
        <Image src={insightIcon} alt="tip" className="w-8 h-8 shrink-0" />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">Today's Fitness Tip</h4>
          <p className="mt-2 text-sm text-gray-600 leading-relaxed">"{tip}"</p>
          <div className="mt-3">
            <button className="inline-flex items-center gap-2 text-sm text-emerald-700 font-medium border border-emerald-200 rounded-md px-3 py-2 hover:bg-emerald-50 transition-colors">
              Get More Guides
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
