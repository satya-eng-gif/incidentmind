import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "outline"
    | "ghost"
    | "subtle";
  size?: "xs" | "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "secondary",
      size = "md",
      icon,
      iconPosition = "left",
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-sky-500 disabled:opacity-50 disabled:pointer-events-none select-none shrink-0";

    const variantStyles = {
      primary:
        "bg-sky-600 text-white hover:bg-sky-500 active:bg-sky-700 shadow-xs border border-sky-500/40",
      secondary:
        "bg-[#151D2C] text-slate-200 hover:bg-[#1C263A] hover:text-white border border-[#232F46] active:bg-[#121927]",
      danger:
        "bg-rose-950/60 text-rose-300 hover:bg-rose-900/70 border border-rose-800/50 hover:border-rose-700 active:bg-rose-950",
      outline:
        "bg-transparent text-slate-300 hover:bg-[#141C2B] hover:text-white border border-[#232F46]",
      ghost:
        "bg-transparent text-slate-400 hover:text-slate-100 hover:bg-[#161F2E]",
      subtle:
        "bg-[#111724] text-slate-300 hover:bg-[#192235] hover:text-white border border-transparent",
    };

    const sizeStyles = {
      xs: "text-xs px-2 py-1 gap-1",
      sm: "text-xs px-2.5 py-1.5 gap-1.5",
      md: "text-xs px-3.5 py-2 gap-2 font-medium",
      lg: "text-sm px-4 py-2.5 gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {icon && iconPosition === "left" && (
          <span className="shrink-0">{icon}</span>
        )}
        {children}
        {icon && iconPosition === "right" && (
          <span className="shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
