import { CheckCircle, Zap } from "lucide-react";
import type { PlanId } from "@/app/dashboard/membership/data";

interface PlanCardProps {
  id: PlanId;
  title: string;
  price: string;
  priceSlash?: string;
  priceLabel?: string;
  description: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
  isCurrentPlan?: boolean;
  currentPlanTier: number;
  planTier: number;
  onAction?: () => void;
}

function savingsPct(original: string, current: string): number | null {
  const o = parseInt(original.replace(/[^0-9]/g, ""));
  const c = parseInt(current.replace(/[^0-9]/g, ""));
  if (!o || !c || o <= c) return null;
  return Math.round(((o - c) / o) * 100);
}

export default function PlanCard({
  id,
  title,
  price,
  priceSlash,
  priceLabel,
  description,
  features,
  buttonText,
  highlight = false,
  isCurrentPlan = false,
  currentPlanTier,
  planTier,
  onAction,
}: PlanCardProps) {
  const savings = priceSlash ? savingsPct(priceSlash, price) : null;

  const isUpgrade = planTier > currentPlanTier;
  const isDowngrade = planTier < currentPlanTier;

  const ctaLabel = isCurrentPlan
    ? "Your Current Plan"
    : isUpgrade
    ? `Upgrade to ${title}`
    : isDowngrade
    ? `Switch to ${title}`
    : buttonText;

  const badge = isCurrentPlan
    ? "Your Plan"
    : highlight
    ? "Most Popular"
    : null;

  const accentClass = isCurrentPlan
    ? "border-emerald-500"
    : highlight
    ? "border-green-600"
    : "border-gray-100 hover:border-green-200";

  const topBarClass = isCurrentPlan
    ? "bg-emerald-500"
    : highlight
    ? "bg-green-600"
    : "bg-transparent";

  const badgeBg = isCurrentPlan
    ? "bg-emerald-100 text-emerald-700"
    : "bg-green-100 text-green-700";

  return (
    <div
      className={`relative bg-white rounded-xl border-2 shadow-sm flex flex-col overflow-hidden transition-all ${accentClass}`}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${topBarClass}`} />

      <div className="p-5 flex flex-col gap-5 flex-1">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            {badge && (
              <span className={`shrink-0 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badgeBg}`}>
                {badge}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1 leading-snug">{description}</p>

          {/* Price */}
          <div className="flex items-end gap-2 mt-4 flex-wrap">
            <span className="text-3xl font-bold text-gray-900 leading-none">{price}</span>
            {priceLabel && (
              <span className="text-sm text-gray-400 mb-0.5">{priceLabel}</span>
            )}
            {priceSlash && (
              <span className="text-sm text-gray-400 line-through mb-0.5">{priceSlash}</span>
            )}
          </div>

          {/* Savings badge */}
          {savings && (
            <div className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
              <Zap size={10} className="fill-amber-500 text-amber-500" />
              Save {savings}%
            </div>
          )}
        </div>

        {/* CTA Button */}
        <button
          type="button"
          onClick={!isCurrentPlan ? onAction : undefined}
          disabled={isCurrentPlan}
          className={`w-full py-2.5 rounded-lg text-sm font-semibold border transition focus:outline-none focus:ring-2 focus:ring-green-500/30
            ${
              isCurrentPlan
                ? "bg-gray-100 text-gray-500 border-gray-200 cursor-default"
                : highlight || isUpgrade
                ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                : "border-green-600 text-green-600 hover:bg-green-50"
            }
          `}
        >
          {ctaLabel}
        </button>

        {/* Features */}
        <ul className="space-y-2.5 text-sm text-gray-600">
          {features.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span className="leading-snug">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
