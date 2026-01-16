"use client";

export default function EmptyTable() {
  return (
    <div className="flex items-center justify-center py-20">
      <svg
        width="140"
        height="120"
        viewBox="0 0 140 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-gray-300"
      >
        {/* Table outline */}
        <rect
          x="10"
          y="20"
          width="120"
          height="80"
          rx="8"
          stroke="currentColor"
          strokeWidth="2"
        />

        {/* Header */}
        <rect
          x="10"
          y="20"
          width="120"
          height="16"
          rx="4"
          fill="currentColor"
          opacity="0.2"
        />

        {/* Rows */}
        <rect
          x="22"
          y="50"
          width="96"
          height="8"
          rx="4"
          fill="currentColor"
          opacity="0.15"
        />
        <rect
          x="22"
          y="65"
          width="96"
          height="8"
          rx="4"
          fill="currentColor"
          opacity="0.15"
        />
        <rect
          x="22"
          y="80"
          width="96"
          height="8"
          rx="4"
          fill="currentColor"
          opacity="0.15"
        />
      </svg>
    </div>
  );
}
