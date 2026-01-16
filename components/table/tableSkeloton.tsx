"use client";

interface TableLoaderProps {
  rows?: number;
  columns?: number;
}

export default function TableLoader({
  rows = 5,
  columns = 4,
}: TableLoaderProps) {
  return (
    <div className="w-full overflow-hidden rounded-lg ">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 bg-gray-50 px-4 py-3">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-4 w-24 animate-pulse rounded bg-gray-200" />
        ))}
      </div>

      {/* Rows */}
      <div className="">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4 px-4 py-4">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 w-full animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// // usage
// <TableLoader rows={6} columns={4} />;
