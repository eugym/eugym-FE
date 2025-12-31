"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

export default function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  icon,
  loading = false,
  disabled,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const baseStyles =
    "px-5 py-2 rounded-md font-medium transition focus:outline-none flex items-center justify-center gap-2";

  const variantStyles =
    variant === "primary"
      ? "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-400 disabled:text-gray-500 disabled:bg-green-700/50 "
      : "border border-green-500 text-green-500 hover:bg-green-50 disabled:opacity-50 disabled:text-gray-400";

  return (
    <motion.button
      type={type}
      onClick={loading ? undefined : onClick} // disable click when loading
      disabled={isDisabled}
      whileHover={{ scale: isDisabled ? 1 : 1.05 }}
      whileTap={{ scale: isDisabled ? 1 : 0.95 }}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {/* Loading Spinner */}
      {loading ? (
        <motion.span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
