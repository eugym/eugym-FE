import Image from "next/image";
import insightIcon from "@/public/asset/insight.png";

export default function TipCard() {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 ">
      <div className="flex items-start gap-4">
        <Image src={insightIcon} alt="insightIcom" className="w-8 h-8" />
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900">Today's Fitness Tip</h4>
          <p className="mt-2 text-sm text-gray-600">
            “Start your day with 10 minutes of stretching. It improves
            flexibility, reduces injury risk, and boosts energy levels
            throughout the day.”
          </p>
          <div className="mt-3">
            <a className="inline-flex items-center gap-2 text-sm text-emerald-700 font-medium border border-emerald-200 rounded-md px-3 py-2 hover:bg-emerald-50">
              Get Stretching Guides{" "}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
