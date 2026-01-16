import { FileText } from "lucide-react";

import Link from "next/link";
import { ReactNode } from "react";

interface PlanCardProps {
  category: string;
  title: string;
  fileType?: string;
  uploadedBy: string;
  uploadedAt: string;
  downloadUrl: string;
  icon?: ReactNode;
}

export default function MealPlanCard({
  category,
  title,
  fileType = "PDF",
  uploadedBy,
  uploadedAt,
  downloadUrl,
  icon,
}: PlanCardProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition">
      {/* Left section */}
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex flex-col h-full w-40 items-center  gap-2 justify-center rounded-lg bg-gray-100 py-3">
          <p className="text-sm font-medium text-gray-500">{category}</p>
          <FileText size={50} color="#6B7280" />
          <h3 className="text-[10px] text-center">{title}</h3>
          <div className="text-sm">{fileType} </div>
        </div>

        {/* Text */}
        <div className="space-y-1">
          <h3 className="text-base font-semibold text-gray-900">{title}</h3>

          <p className="text-sm text-gray-500">
            Uploaded by <span className="font-medium">{uploadedBy}</span>
          </p>

          <p className="text-xs text-gray-400">
            {uploadedAt} • {fileType}
          </p>
        </div>
      </div>

      {/* CTA */}
      <Link
        href={downloadUrl}
        className="inline-flex items-center justify-center rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-green-700 transition "
      >
        Download Plan
      </Link>
    </div>
  );
}
