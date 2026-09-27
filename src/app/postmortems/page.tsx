"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
} from "lucide-react";
import { MOCK_POSTMORTEMS } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function PostmortemsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const filteredPostmortems = MOCK_POSTMORTEMS.filter((pm) => {
    if (statusFilter === "ALL") return true;
    return pm.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold font-mono tracking-tight text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-sky-400" />
            INCIDENT POSTMORTEMS & RETROSPECTIVES
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Blameless root cause analyses, 5 Whys investigations, and preventive action item tracking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/postmortems/PM-8475">
            <Button
              variant="primary"
              size="sm"
              icon={<Plus className="w-3.5 h-3.5" />}
            >
              New Postmortem Draft
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-[#0E1524] border border-[#19243C]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            Published Reports
          </span>
          <span className="text-xl font-bold font-mono text-slate-100 mt-0.5 block">
            {MOCK_POSTMORTEMS.filter((p) => p.status === "published").length}
          </span>
          <span className="text-[11px] text-emerald-400">Blameless culture</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0E1524] border border-[#19243C]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            In Peer Review
          </span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-0.5 block">
            {MOCK_POSTMORTEMS.filter((p) => p.status === "in_review").length}
          </span>
          <span className="text-[11px] text-slate-400">Under SRE review</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0E1524] border border-[#19243C]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            Action Items Closed
          </span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
            87.5%
          </span>
          <span className="text-[11px] text-slate-400">7 of 8 completed</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0E1524] border border-[#19243C]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            Institutional Memory
          </span>
          <span className="text-xl font-bold font-mono text-indigo-300 mt-0.5 block">
            100%
          </span>
          <span className="text-[11px] text-slate-400">Vector indexed</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 p-1 rounded-md bg-[#0A0E18] border border-[#172134] w-fit">
        {["ALL", "published", "in_review", "draft"].map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            className={`px-3 py-1 rounded text-xs font-mono capitalize transition-colors ${
              statusFilter === tab
                ? "bg-[#182338] text-white font-medium shadow-xs"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Postmortems List */}
      <div className="space-y-3">
        {filteredPostmortems.map((pm) => {
          const completedActions = pm.actionItems.filter(
            (a) => a.status === "completed"
          ).length;
          const totalActions = pm.actionItems.length;

          return (
            <Card
              key={pm.id}
              className="p-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <SeverityBadge severity={pm.severity} size="sm" />
                    <span className="text-slate-400 font-semibold">{pm.id}</span>
                    <span className="text-slate-400">•</span>
                    <Link
                      href={`/incidents/${pm.incidentId}`}
                      className="text-sky-400 hover:text-sky-300"
                    >
                      {pm.incidentId}
                    </Link>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] font-medium capitalize ${
                        pm.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {pm.status.replace("_", " ")}
                    </span>
                  </div>

                  <Link
                    href={`/postmortems/${pm.id}`}
                    className="text-sm font-semibold text-slate-100 hover:text-sky-400 transition-colors block"
                  >
                    {pm.title}
                  </Link>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {pm.impactSummary}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-1">
                    <span>Lead: {pm.owner}</span>
                    <span>Team: {pm.team}</span>
                    <span>Duration: {pm.durationMinutes}m</span>
                    {pm.financialImpactEstimate && (
                      <span className="text-rose-400">
                        Impact: {pm.financialImpactEstimate}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-start md:items-end justify-between gap-3 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">
                      Preventive Actions
                    </span>
                    <span className="text-xs font-mono text-slate-200 font-medium">
                      {completedActions} / {totalActions} Completed
                    </span>
                  </div>

                  <Link href={`/postmortems/${pm.id}`}>
                    <Button variant="secondary" size="xs">
                      Read Full Report →
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
