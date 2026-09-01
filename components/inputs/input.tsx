"use client";

import React, { useId, useState } from "react";
import { User, Mail, Lock, Building2, Eye, EyeOff, Phone } from "lucide-react";

interface InputFieldProps {
  label: string;
  placeholder?: string;
  type?:
    | "text"
    | "number"
    | "tel"
    | "email"
    | "password"
    | "confirmPassword"
    | "company";
  value: string;
  onChange?: (value: string) => void;
  /** Validation message for this field. Renders red and is announced to screen readers. */
  error?: string;
  name?: string;
  autoComplete?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  name,
  autoComplete,
  inputMode,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const id = useId();
  const errorId = `${id}-error`;

  const isPassword = type === "password";
  const hasError = Boolean(error);

  const getLeftIcon = () => {
    const lower = label.toLowerCase();

    if (lower.includes("phone")) return <Phone size={18} />;
    if (lower.includes("name")) return <User size={18} />;
    if (lower.includes("email")) return <Mail size={18} />;
    if (lower.includes("company")) return <Building2 size={18} />;
    if (isPassword) return <Lock size={18} />;

    return null;
  };

  const leftIcon = getLeftIcon();

  return (
    <div className="flex flex-col space-y-1 w-full">
      <label
        htmlFor={id}
        className={`text-xs uppercase tracking-wide ${
          hasError ? "text-red-700" : "text-gray-600"
        }`}
      >
        {label}
      </label>

      <div className="relative flex items-center">
        {leftIcon && (
          <span
            className={`absolute left-3 ${
              hasError ? "text-red-400" : "text-gray-400"
            }`}
          >
            {leftIcon}
          </span>
        )}

        <input
          id={id}
          name={name}
          type={isPassword && showPassword ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={hasError || undefined}
          aria-describedby={hasError ? errorId : undefined}
          className={`w-full py-2 rounded-md border text-sm text-gray-700
            focus:outline-none focus:ring-2
            ${
              hasError
                ? "border-red-400 bg-red-50/40 focus:ring-red-400"
                : "border-gray-200 focus:ring-primary-lite"
            }
            ${leftIcon ? "pl-10" : "pl-3"}
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

      {/* The message carries the meaning — the red is only reinforcement, so this
          still reads correctly without color. */}
      {hasError && (
        <p id={errorId} className="text-xs text-red-700 leading-snug">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField;
