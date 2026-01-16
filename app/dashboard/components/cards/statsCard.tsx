import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  iconBg?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  iconBg = "bg-blue-100",
}: StatCardProps) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-md">
      <div>
        <h3 className="text-2xl font-semibold">{value}</h3>
        <p className="mt-1 text-xs uppercase text-gray-500">{title}</p>
      </div>

      <div
        className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>
    </div>
  );
}
