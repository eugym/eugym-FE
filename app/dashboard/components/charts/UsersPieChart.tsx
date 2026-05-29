"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export interface PieSlice {
  label: string;
  value: number;
  color: string;
}

interface UsersPieChartProps {
  data?: PieSlice[];
  loading?: boolean;
}

const DEFAULT_COLORS = [
  "#19b24b", "#3B82F6", "#F59E0B", "#EF4444",
  "#8B5CF6", "#06B6D4", "#EC4899", "#6B7280",
];

const FALLBACK: PieSlice[] = [
  { label: "Regular",   value: 0, color: "#93C5FD" },
  { label: "Standard",  value: 0, color: "#19b24b" },
  { label: "Premium",   value: 0, color: "#F59E0B" },
  { label: "Corporate", value: 0, color: "#FCA5A5" },
];

export default function UsersPieChart({ data, loading }: UsersPieChartProps) {
  const slices = data?.length ? data : FALLBACK;

  if (loading) {
    return (
      <div className="h-[280px] flex items-center justify-center">
        <div className="w-40 h-40 rounded-full border-8 border-slate-100 border-t-[#19b24b] animate-spin" />
      </div>
    );
  }

  const total = slices.reduce((s, d) => s + d.value, 0);

  const chartData = {
    labels: slices.map((s) => s.label),
    datasets: [
      {
        data: slices.map((s) => s.value),
        backgroundColor: slices.map((s, i) => s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length]),
        borderWidth: 2,
        borderColor: "#ffffff",
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const pct = total ? ((ctx.raw / total) * 100).toFixed(1) : "0";
            return ` ${ctx.label}: ${ctx.raw} (${pct}%)`;
          },
        },
      },
    },
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-[200px] w-[200px]">
        <Doughnut data={chartData} options={options} />
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold text-gray-800">{total.toLocaleString()}</span>
          <span className="text-xs text-gray-400">Total Users</span>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full space-y-2">
        {slices.map((s, i) => {
          const pct = total ? ((s.value / total) * 100).toFixed(0) : "0";
          return (
            <div key={i} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length] }} />
                <span className="text-gray-600">{s.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{s.value.toLocaleString()}</span>
                <span className="text-gray-400 w-8 text-right">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
