"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export interface MonthlyRevenue {
  month: string;
  standard: number;
  premium: number;
  corporate: number;
}

interface RevenueBarChartProps {
  data?: MonthlyRevenue[];
  loading?: boolean;
}

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const PLACEHOLDER: MonthlyRevenue[] = MONTHS.map((month) => ({
  month,
  standard:  Math.round(Math.random() * 40 + 30),
  premium:   Math.round(Math.random() * 35 + 25),
  corporate: Math.round(Math.random() * 25 + 10),
}));

export default function RevenueBarChart({ data, loading }: RevenueBarChartProps) {
  if (loading) {
    return (
      <div className="h-[300px] flex items-end gap-1 px-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col-reverse gap-0.5">
            {[60, 45, 30].map((h, j) => (
              <div
                key={j}
                className="rounded-t animate-pulse bg-slate-200"
                style={{ height: `${h * (0.5 + Math.random() * 0.5)}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  const rows = data?.length ? data : PLACEHOLDER;

  const chartData = {
    labels: rows.map((r) => r.month),
    datasets: [
      {
        label: "Standard",
        data: rows.map((r) => r.standard),
        backgroundColor: "#93C5FD",
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Premium",
        data: rows.map((r) => r.premium),
        backgroundColor: "#19b24b",
        borderRadius: 4,
        borderSkipped: false,
      },
      {
        label: "Corporate",
        data: rows.map((r) => r.corporate),
        backgroundColor: "#3B82F6",
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        position: "top" as const,
        align: "end" as const,
        labels: { boxWidth: 10, boxHeight: 10, borderRadius: 5, useBorderRadius: true, font: { size: 11 } },
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.dataset.label}: ₦${ctx.raw}k`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11 } },
      },
      y: {
        grid: { color: "#f1f5f9" },
        ticks: {
          font: { size: 11 },
          callback: (v: any) => `₦${v}k`,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="h-[300px]">
      <Bar data={chartData} options={options} />
    </div>
  );
}
