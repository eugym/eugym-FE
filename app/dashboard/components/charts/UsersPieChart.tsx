"use client";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function UsersPieChart() {
  const data = {
    labels: ["Standard", "Regular", "Premium", "Corporate"],
    datasets: [
      {
        data: [20, 20, 40, 20],
        backgroundColor: ["#93C5FD", "#FB923C", "#86EFAC", "#FCA5A5"],
      },
    ],
  };

  return (
    <div className="h-[320px]">
      <Pie data={data} />
    </div>
  );
}
