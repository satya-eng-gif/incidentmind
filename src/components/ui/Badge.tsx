import React from "react";
import { cn } from "@/lib/utils";
import { Severity, IncidentStatus } from "@/lib/types";

interface SeverityBadgeProps {
  severity: Severity;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function SeverityBadge({
  severity,
  size = "md",
  className,
}: SeverityBadgeProps) {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-0.5 text-xs font-mono font-medium",
    lg: "px-2.5 py-1 text-xs font-mono font-semibold tracking-wide",
  };

  const severityStyles: Record<Severity, string> = {
    "SEV-0":
      "bg-red-500/15 text-red-400 border border-red-500/30 ring-1 ring-red-500/20 shadow-xs shadow-red-950/40",
    "SEV-1":
      "bg-rose-500/15 text-rose-400 border border-rose-500/30 ring-1 ring-rose-500/20",
    "SEV-2":
      "bg-amber-500/15 text-amber-400 border border-amber-500/30 ring-1 ring-amber-500/20",
    "SEV-3":
      "bg-sky-500/15 text-sky-400 border border-sky-500/30 ring-1 ring-sky-500/20",
    "SEV-4":
      "bg-slate-500/15 text-slate-300 border border-slate-500/30 ring-1 ring-slate-500/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded tracking-wide uppercase transition-colors",
        sizeClasses[size],
        severityStyles[severity],
        className
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full shrink-0", {
          "bg-red-400 animate-pulse": severity === "SEV-0" || severity === "SEV-1",
          "bg-amber-400": severity === "SEV-2",
          "bg-sky-400": severity === "SEV-3",
          "bg-slate-400": severity === "SEV-4",
        })}
      />
      {severity}
    </span>
  );
}

interface StatusBadgeProps {
  status: IncidentStatus;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({ status, size = "md", className }: StatusBadgeProps) {
  const sizeClasses = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2 py-0.5 text-xs font-medium",
  };

  const statusStyles: Record<IncidentStatus, string> = {
    investigating:
      "bg-amber-500/10 text-amber-400 border border-amber-500/25",
    identified:
      "bg-blue-500/10 text-blue-400 border border-blue-500/25",
    monitoring:
      "bg-purple-500/10 text-purple-400 border border-purple-500/25",
    mitigated:
      "bg-teal-500/10 text-teal-400 border border-teal-500/25",
    resolved:
      "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded capitalize",
        sizeClasses[size],
        statusStyles[status],
        className
      )}
    >
      <span
        className={cn("w-1.5 h-1.5 rounded-full shrink-0", {
          "bg-amber-400 animate-ping-slow": status === "investigating",
          "bg-blue-400": status === "identified",
          "bg-purple-400": status === "monitoring",
          "bg-teal-400": status === "mitigated",
          "bg-emerald-400": status === "resolved",
        })}
      />
      {status}
    </span>
  );
}

export function HindsightScoreBadge({
  score,
  className,
}: {
  score: number;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono font-medium border bg-indigo-500/10 text-indigo-300 border-indigo-500/30",
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
      {score}% Hindsight Match
    </span>
  );
}

export function ServiceTierBadge({
  tier,
  className,
}: {
  tier: "Tier-0" | "Tier-1" | "Tier-2";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono border",
        {
          "bg-red-500/10 text-red-300 border-red-500/20": tier === "Tier-0",
          "bg-amber-500/10 text-amber-300 border-amber-500/20": tier === "Tier-1",
          "bg-slate-500/10 text-slate-300 border-slate-500/20": tier === "Tier-2",
        },
        className
      )}
    >
      {tier}
    </span>
  );
}
