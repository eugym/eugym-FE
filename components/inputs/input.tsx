"use client";

import React, { useState } from "react";
import { User, Mail, Lock, Building2, Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?:
    | "text"
    | "number"
    | "email"
    | "password"
    | "confirmPassword"
    | "company";
  value: string;
  onChange?: (value: string) => void;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  const getLeftIcon = () => {
    const lower = label.toLowerCase();

    if (lower.includes("name")) return <User size={18} />;
    if (lower.includes("email")) return <Mail size={18} />;
    if (lower.includes("company")) return <Building2 size={18} />;
    if (isPassword) return <Lock size={18} />;

    return null;
  };

  return (
    <div className="flex flex-col space-y-1 w-full">
      <label className="text-xs text-gray-600 uppercase tracking-wide">
        {label}
      </label>

      <div className="relative flex items-center">
        {/* Left Icon */}
        {getLeftIcon() && (
          <span className="absolute left-3 text-gray-400">{getLeftIcon()}</span>
        )}

        <input
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={`w-full py-2 rounded-md border border-gray-200 text-sm text-gray-700
            focus:outline-none focus:ring-2 focus:ring-primary-lite
            ${getLeftIcon() ? "pl-10" : "pl-3"}
            ${isPassword ? "pr-10" : "pr-3"}`}
        />

        {/* Show / Hide Password */}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default InputField;
