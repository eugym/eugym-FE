import { CheckCircle } from "lucide-react";

interface PlanCardProps {
  title: string;
  price: string;
  priceSlash?: string;
  priceLabel?: string;
  description: string;
  features: string[];
  buttonText: string;
  highlight?: boolean;
  onAction?: () => void;
}

export default function PlanCard({
  title,
  price,
  priceSlash,
  priceLabel,
  description,
  features,
  buttonText,
  highlight = false,
  onAction,
}: PlanCardProps) {
  return (
    <div
      className={`bg-white shadow-sm rounded-xl p-5 flex flex-col gap-5 w-full md:w-1/4 min-w-[280px] border transition
        ${
          highlight
            ? "border-green-600"
            : "border-transparent hover:border-green-200"
        }
      `}
    >
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>

        {/* Price */}
        <div className="flex items-end gap-2 mt-4">
          {priceSlash && (
            <span className="text-sm text-gray-400 line-through">
              {priceSlash}
            </span>
          )}

          <span className="text-2xl font-semibold text-gray-900">{price}</span>

          {priceLabel && <small className="text-gray-500">{priceLabel}</small>}
        </div>
      </div>

      {/* Action Button */}
      <button
        type="button"
        onClick={onAction}
        className={`w-full py-2 rounded-md font-medium border transition focus:outline-none focus:ring-2 focus:ring-green-500
          ${
            highlight
              ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
              : "border-green-600 text-green-600 hover:bg-green-50"
          }
        `}
      >
        {buttonText}
      </button>

      {/* Features */}
      <ul className="mt-2 space-y-2 text-sm text-gray-600">
        {features.map((item) => (
          <li key={item} className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
