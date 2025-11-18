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
}

export default function Button({
  children,
  onClick,
  className = "",
  variant = "primary",
  type = "button",
  icon,
  loading = false,
}: ButtonProps) {
  const baseStyles =
    "px-5 py-2 rounded-md font-medium transition focus:outline-none flex items-center justify-center gap-2";

  const variantStyles =
    variant === "primary"
      ? "bg-green-500 text-white hover:bg-green-600 disabled:bg-green-400"
      : "border border-green-500 text-green-500 hover:bg-green-50 disabled:opacity-50";

  return (
    <motion.button
      type={type}
      onClick={loading ? undefined : onClick} // disable click when loading
      disabled={loading}
      whileHover={{ scale: loading ? 1 : 1.05 }}
      whileTap={{ scale: loading ? 1 : 0.95 }}
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
