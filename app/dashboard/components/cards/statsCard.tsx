import { ReactNode } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
  loading?: boolean;
  trend?: { value: number; label?: string };
  description?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBg = "bg-blue-100",
  loading = false,
  trend,
  description,
}: StatCardProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm animate-pulse">
        <div className="space-y-2">
          <div className="h-7 w-16 rounded bg-slate-200" />
          <div className="h-3 w-28 rounded bg-slate-100" />
          <div className="h-3 w-20 rounded bg-slate-100" />
        </div>
        <div className="h-11 w-11 rounded-full bg-slate-200" />
      </div>
    );
  }

  const trendPositive = trend && trend.value > 0;
  const trendNegative = trend && trend.value < 0;

  return (
    <div className="flex items-start justify-between rounded-xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col gap-1 min-w-0">
        <h3 className="text-2xl font-bold text-gray-900 tabular-nums">
          {typeof value === "number" ? value.toLocaleString() : value}
        </h3>
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide leading-snug">
          {title}
        </p>
        {description && (
          <p className="text-xs text-gray-400 mt-0.5">{description}</p>
        )}
        {trend && (
          <div className={`flex items-center gap-1 mt-1 text-xs font-medium ${
            trendPositive ? "text-emerald-600" : trendNegative ? "text-red-500" : "text-gray-400"
          }`}>
            {trendPositive ? <TrendingUp size={12} /> : trendNegative ? <TrendingDown size={12} /> : <Minus size={12} />}
            <span>
              {trendPositive ? "+" : ""}{trend.value}%{" "}
              <span className="font-normal text-gray-400">{trend.label ?? "vs last month"}</span>
            </span>
          </div>
        )}
      </div>

      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
}
