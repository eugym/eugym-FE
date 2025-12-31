import { ReactNode } from "react";
import clsx from "clsx";

type BannerVariant = "info" | "success" | "warning" | "error";

interface BannerProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
  variant?: BannerVariant;
  className?: string;
}

const variantStyles: Record<BannerVariant, string> = {
  info: "bg-blue-50 text-blue-900 border-blue-200",
  success: "bg-green-50 text-green-900 border-green-200",
  warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
  error: "bg-red-50 text-red-900 border-red-200",
};

export default function Banner({
  title,
  description,
  icon,
  actionText,
  onAction,
  variant = "info",
  className,
}: BannerProps) {
  return (
    <div
      className={clsx(
        "flex flex-col sm:flex-row items-start sm:items-center gap-4 border rounded-xl p-2",
        variantStyles[variant],
        className
      )}
    >
      {icon && <div className="flex-shrink-0 text-xl">{icon}</div>}

      <div className="flex-1">
        <h4 className="font-semibold">{title}</h4>
        {description && (
          <p className="text-sm opacity-80 mt-1">{description}</p>
        )}
      </div>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="text-sm font-medium px-4 py-2 rounded-lg bg-white/80 hover:bg-white transition"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
