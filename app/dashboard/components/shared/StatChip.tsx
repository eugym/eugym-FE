import { ReactNode } from "react";

interface StatChipProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: "emerald" | "sky" | "amber" | "rose" | "indigo" | "gray";
}

const colorMap = {
  emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
  sky:     "text-sky-600 bg-sky-50 border-sky-100",
  amber:   "text-amber-600 bg-amber-50 border-amber-100",
  rose:    "text-rose-600 bg-rose-50 border-rose-100",
  indigo:  "text-indigo-600 bg-indigo-50 border-indigo-100",
  gray:    "text-gray-600 bg-gray-50 border-gray-100",
};

export default function StatChip({
  icon,
  label,
  value,
  color = "emerald",
}: StatChipProps) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${colorMap[color]}`}>
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-[11px] font-medium opacity-70">{label}</p>
        <p className="text-sm font-semibold leading-snug">{value}</p>
      </div>
    </div>
  );
}
