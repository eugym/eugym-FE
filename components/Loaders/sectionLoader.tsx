"use client";

interface SectionLoaderProps {
  height?: string;
}

export default function SectionLoader({
  height = "200px",
}: SectionLoaderProps) {
  return (
    <div className="flex w-full items-center justify-center" style={{ height }}>
      <div className="flex flex-col items-center gap-3">
        {/* Spinner */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-primary" />

        {/* Text */}
        <p className="text-xs font-medium text-gray-500">Loading...</p>
      </div>
    </div>
  );
}
