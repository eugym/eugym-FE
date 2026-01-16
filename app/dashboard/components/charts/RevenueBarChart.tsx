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

export default function RevenueBarChart() {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Standard Fee",
        data: Array(12).fill(55),
        backgroundColor: "#93C5FD",
      },
      {
        label: "Premium Fee",
        data: Array(12).fill(45),
        backgroundColor: "#86EFAC",
      },
      {
        label: "Corporate Fee",
        data: Array(12).fill(30),
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right" as const,
      },
    },
  };

  return (
    <div className="h-[320px]">
      <Bar data={data} options={options} />
    </div>
  );
}
