import React from "react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  change?: string;
  trend?: "up" | "down" | "neutral";
  statusColor?: "emerald" | "amber" | "rose" | "sky" | "slate";
  icon?: React.ReactNode;
  className?: string;
}

export function MetricCard({
  label,
  value,
  subValue,
  change,
  trend,
  statusColor = "slate",
  icon,
  className,
}: MetricCardProps) {
  const colorBorders = {
    emerald: "hover:border-emerald-500/30",
    amber: "hover:border-amber-500/30",
    rose: "hover:border-rose-500/30",
    sky: "hover:border-sky-500/30",
    slate: "hover:border-slate-700",
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-[#1A2335] bg-[#0E1422] p-4 transition-all duration-150",
        colorBorders[statusColor],
        className
      )}
    >
      <div className="flex items-center justify-between text-slate-400 mb-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400 font-mono">
          {label}
        </span>
        {icon && <span className="text-slate-400">{icon}</span>}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-slate-100">
          {value}
        </span>
        {subValue && (
          <span className="text-xs font-mono text-slate-400">{subValue}</span>
        )}
      </div>

      {change && (
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={cn("font-medium", {
              "text-emerald-400": trend === "down" || (trend === "up" && statusColor === "emerald"),
              "text-rose-400": trend === "up" && statusColor !== "emerald",
              "text-slate-400": trend === "neutral",
            })}
          >
            {change}
          </span>
          <span className="text-[11px] text-slate-500">vs 30-day baseline</span>
        </div>
      )}
    </div>
  );
}
