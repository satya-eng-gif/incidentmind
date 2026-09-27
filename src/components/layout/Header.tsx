"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Search,
  Clock,
  Bell,
  ExternalLink,
  Command,
  Wifi,
} from "lucide-react";
import { MOCK_INCIDENTS } from "@/lib/mock-data";

export function Header() {
  const pathname = usePathname();
  const [utcTime, setUtcTime] = useState<string>("00:00:00 UTC");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        `${now.getUTCHours().toString().padStart(2, "0")}:${now
          .getUTCMinutes()
          .toString()
          .padStart(2, "0")}:${now
          .getUTCSeconds()
          .toString()
          .padStart(2, "0")} UTC`
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const activeIncidents = MOCK_INCIDENTS.filter(
    (i) => i.status !== "resolved"
  );
  const activeSev1 = activeIncidents.find((i) => i.severity === "SEV-1" || i.severity === "SEV-0");

  const getBreadcrumb = () => {
    if (pathname === "/dashboard") return "Operations Dashboard";
    if (pathname === "/incidents") return "Active Incidents & Triage";
    if (pathname === "/incidents/new") return "Declare Incident (War Room)";
    if (pathname.startsWith("/incidents/")) return "Incident Command Center";
    if (pathname === "/memory") return "Hindsight Memory & Pattern Engine";
    if (pathname === "/postmortems") return "Postmortems & Retrospectives";
    if (pathname.startsWith("/postmortems/")) return "Postmortem Report";
    if (pathname === "/settings") return "SRE Team & Integration Settings";
    return "Operations";
  };

  return (
    <header className="h-14 border-b border-[#192336] bg-[#0A0D15]/95 backdrop-blur-xs px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Breadcrumbs / Route Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">incidentmind</span>
          <span className="text-slate-400">/</span>
          <span className="text-slate-200 font-semibold">{getBreadcrumb()}</span>
        </div>

        {/* Active Incident Warning Ribbon if active */}
        {activeSev1 && (
          <Link
            href={`/incidents/${activeSev1.id}`}
            className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/25 hover:border-rose-500/40 text-rose-300 text-xs transition-colors group"
          >
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping-slow" />
            <span className="font-mono font-semibold">{activeSev1.id}:</span>
            <span className="max-w-[260px] truncate text-slate-300">
              {activeSev1.title}
            </span>
            <ExternalLink className="w-3 h-3 text-rose-400 opacity-60 group-hover:opacity-100" />
          </Link>
        )}
      </div>

      {/* Right: Search, Global UTC Clock, Notifications */}
      <div className="flex items-center gap-3">
        {/* Quick Search Trigger */}
        <div className="relative hidden md:block">
          <button
            type="button"
            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#111724] border border-[#1F2B3E] text-slate-400 hover:text-slate-200 hover:border-slate-600 text-xs font-mono transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-500" />
            <span>Search incidents, runbooks...</span>
            <kbd className="ml-2 px-1.5 py-0.5 rounded bg-[#182235] text-[10px] text-slate-400 border border-[#23314B] flex items-center gap-0.5">
              <Command className="w-2.5 h-2.5" /> K
            </kbd>
          </button>
        </div>

        {/* Global SRE UTC Clock */}
        <div
          title="Incident reference clock (UTC)"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#101623] border border-[#192336] text-xs font-mono text-slate-300"
        >
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="tracking-wider">{utcTime}</span>
        </div>

        {/* Observability Telemetry Link status */}
        <div
          title="Telemetry streams: 6/6 Ingestion healthy"
          className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#101623] border border-[#192336] text-[11px] font-mono text-emerald-400"
        >
          <Wifi className="w-3 h-3" />
          <span className="hidden sm:inline">LIVE</span>
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          title="3 Active alerts"
          className="relative p-1.5 rounded-md text-slate-400 hover:text-slate-200 hover:bg-[#131B2B] transition-colors"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500" />
        </button>
      </div>
    </header>
  );
}
