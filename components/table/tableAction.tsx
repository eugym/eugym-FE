"use client";

import { useEffect, useRef } from "react";

interface TableActionsProps {
  row: any;
  options: {
    label: string;
    action: (row: any) => void;
    loading?: boolean;
  }[];
  onClose: () => void;
}

export function TableActions({ row, options, onClose }: TableActionsProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      className="absolute right-2 top-12 z-30 w-44 rounded-lg border bg-white shadow-lg"
    >
      {options.map((opt, idx) => (
        <button
          key={idx}
          role="menuitem"
          disabled={opt.loading}
          onClick={() => {
            opt.action(row);
            onClose();
          }}
          className="w-full text-left px-4 py-2 text-sm hover:bg-primary-50 disabled:opacity-50"
        >
          {opt.loading ? "Loading..." : opt.label}
        </button>
      ))}
    </div>
  );
}
