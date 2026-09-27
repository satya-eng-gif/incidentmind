"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  BrainCircuit,
  FileText,
  Settings,
  PlusCircle,
  ShieldAlert,
  Server,
  ChevronRight,
  Radio,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MOCK_SRE_TEAM } from "@/lib/mock-data";

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Activity,
      badge: null,
    },
    {
      name: "Incidents",
      href: "/incidents",
      icon: AlertTriangle,
      badge: MOCK_SRE_TEAM.systemHealthSummary.activeIncidentsCount.toString(),
      badgeVariant: "critical",
    },
    {
      name: "Hindsight Memory",
      href: "/memory",
      icon: BrainCircuit,
      badge: "AI",
      badgeVariant: "ai",
    },
    {
      name: "Postmortems",
      href: "/postmortems",
      icon: FileText,
      badge: null,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: Settings,
      badge: null,
    },
  ];

  const primaryUser = MOCK_SRE_TEAM.currentOnCall.primary;

  return (
    <aside className="w-64 shrink-0 flex flex-col bg-[#0A0E18] border-r border-[#192336] select-none h-screen sticky top-0">
      {/* Brand Header */}
      <div className="h-14 px-4 flex items-center justify-between border-b border-[#192336]">
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 group transition-opacity hover:opacity-95"
        >
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-xs shadow-sky-950">
            <ShieldAlert className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm tracking-tight text-white flex items-center gap-1.5">
              IncidentMind
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20 font-normal">
                SRE
              </span>
            </span>
          </div>
        </Link>

        {/* Live cluster status pill */}
        <div
          title="Cluster Health: DEGRADED (1 Active SEV-1)"
          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-mono"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping-slow" />
          <span>DEGRADED</span>
        </div>
      </div>

      {/* Primary Action: New Incident */}
      <div className="p-3 border-b border-[#141D2D]">
        <Link
          href="/incidents/new"
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-rose-600 hover:bg-rose-500 active:bg-rose-700 text-white text-xs font-semibold tracking-wide transition-all shadow-sm shadow-rose-950/40 border border-rose-500/40 group"
        >
          <PlusCircle className="w-4 h-4 transition-transform group-hover:rotate-90 duration-200" />
          <span>New Incident</span>
          <span className="ml-auto text-[10px] font-mono px-1 rounded bg-rose-700/60 text-rose-200 border border-rose-400/30">
            N
          </span>
        </Link>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        <div className="px-2 pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
          Core Operations
        </div>

        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-2.5 py-2 rounded-md text-xs font-medium transition-colors group",
                isActive
                  ? "bg-[#162134] text-white font-semibold border border-sky-500/30 shadow-xs"
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#111827] border border-transparent"
              )}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon
                  className={cn(
                    "w-4 h-4 shrink-0 transition-colors",
                    isActive
                      ? "text-sky-400"
                      : "text-slate-500 group-hover:text-slate-300"
                  )}
                />
                <span className="truncate">{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={cn(
                    "px-1.5 py-0.5 rounded text-[10px] font-mono font-medium shrink-0",
                    item.badgeVariant === "critical"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse"
                      : item.badgeVariant === "ai"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold"
                      : "bg-[#1E293B] text-slate-400"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        {/* Quick System Telemetry Info */}
        <div className="pt-5 px-2">
          <div className="flex items-center justify-between pb-1.5 text-[10px] font-mono uppercase tracking-wider text-slate-400">
            <span>Critical Tiers</span>
            <Server className="w-3 h-3 text-slate-400" />
          </div>
          <div className="space-y-1 text-[11px] font-mono">
            <div className="flex items-center justify-between py-1 px-2 rounded bg-[#0E1524] border border-[#162136]">
              <span className="text-slate-400">auth-service</span>
              <span className="text-rose-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                480ms p99
              </span>
            </div>
            <div className="flex items-center justify-between py-1 px-2 rounded bg-[#0E1524] border border-[#162136]">
              <span className="text-slate-400">edge-proxy</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                24ms p99
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* On-Call & Team Footer Area */}
      <div className="p-3 border-t border-[#192336] bg-[#0C111E]">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2">
          <span className="flex items-center gap-1">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            PRIMARY ON-CALL
          </span>
          <span className="text-slate-400 font-mono">PST (UTC-7)</span>
        </div>

        <div className="flex items-center gap-2.5 p-2 rounded-md bg-[#131B2C] border border-[#1E2B42]">
          <div className="relative">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-600 to-indigo-600 text-white font-mono text-xs font-semibold flex items-center justify-center shrink-0">
              {primaryUser.avatar}
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#131B2C]" />
          </div>

          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-medium text-slate-200 truncate">
              {primaryUser.name}
            </span>
            <span className="text-[10px] text-slate-400 truncate font-mono">
              Core SRE • On-Call
            </span>
          </div>

          <Link
            href="/settings"
            title="Team & Escalation Settings"
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
