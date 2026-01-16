"use client";

import { ChevronDown } from "lucide-react";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectInputProps {
  label?: string;
  name: string;
  value: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  disabled?: boolean;
  onChange: (name: string, value: string) => void;
}

export default function SelectInput({
  label,
  name,
  value,
  options,
  placeholder = "Select an option",
  error,
  disabled = false,
  onChange,
}: SelectInputProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div className="relative">
        <select
          id={name}
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(name, e.target.value)}
          className={`
            w-full appearance-none rounded-lg px-4 py-2.5
            text-sm outline-none transition border border-gray-200  text-gray-700
            focus:outline-none focus:ring-2 focus:ring-primary-lite
            ${
              error
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-accent"
            }
            ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-400" : ""}
          `}
        >
          <option value="" disabled>
            {placeholder}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Icon */}
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
