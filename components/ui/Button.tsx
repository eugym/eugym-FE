"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Plate System button.
 *
 * A machined 2px edge rather than a pill, weight rather than lift: pressing
 * seats the control 1px down as loaded iron settles, instead of the hover-scale
 * bounce a soft UI uses. See DESIGN.md § Form and material.
 *
 * `--plate-green` is a fill only — it fails contrast as text on light ground —
 * so the green variant carries white type, and green *text* uses
 * `--plate-green-deep` (5.45:1).
 */
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

  const base =
    "relative inline-flex items-center justify-center gap-2 px-6 py-2.5 " +
    "text-sm font-semibold tracking-tight rounded-(--plate-radius) " +
    "transition-[background-color,color,border-color,transform] " +
    "duration-150 ease-out select-none " +
    "focus-visible:outline-2 focus-visible:outline-offset-2 " +
    "focus-visible:outline-(--plate-iron) " +
    "disabled:cursor-not-allowed disabled:opacity-45";

  const variants: Record<string, string> = {
    primary:
      "bg-(--plate-green) text-white border border-(--plate-green-deep) " +
      "hover:bg-(--plate-green-deep) active:translate-y-px",
    secondary:
      "bg-(--plate-surface) text-(--plate-iron) " +
      "border border-(--plate-rule) " +
      "hover:border-(--plate-iron) active:translate-y-px",
    ghost:
      "bg-transparent text-(--plate-green-deep) border border-transparent " +
      "hover:bg-black/[0.04] active:translate-y-px",
  };

  return (
    <motion.button
      type={type}
      onClick={loading ? undefined : onClick}
      disabled={isDisabled}
      aria-busy={loading || undefined}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {loading ? (
        <>
          {/* Keep the label in place while loading so the control doesn't
              change width and shove the layout around it. */}
          <span className="invisible flex items-center gap-2">
            {icon}
            {children}
          </span>
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          </span>
        </>
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </motion.button>
  );
}
