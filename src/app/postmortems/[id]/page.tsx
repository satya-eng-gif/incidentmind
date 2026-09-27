"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertTriangle,
  BrainCircuit,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { MOCK_POSTMORTEMS } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

export default function PostmortemDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const pmId = unwrappedParams.id;

  const postmortem =
    MOCK_POSTMORTEMS.find((p) => p.id === pmId) || MOCK_POSTMORTEMS[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Link */}
      <div>
        <Link
          href="/postmortems"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Postmortems
        </Link>
      </div>

      {/* Header Document Metadata */}
      <div className="p-5 rounded-lg bg-[#0E1524] border border-[#19253C] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
            <SeverityBadge severity={postmortem.severity} size="md" />
            <span className="text-slate-400 font-semibold">{postmortem.id}</span>
            <span className="text-slate-500">•</span>
            <span
              className={`px-2 py-0.5 rounded text-[11px] capitalize ${
                postmortem.status === "published"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}
            >
              {postmortem.status.replace("_", " ")}
            </span>
          </div>

          <Link
            href={`/incidents/${postmortem.incidentId}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-sky-400 hover:text-sky-300"
          >
            <span>Linked Incident: {postmortem.incidentId}</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

        <h1 className="text-base sm:text-xl font-bold text-white tracking-tight">
          {postmortem.title}
        </h1>

        {/* Key Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-[#172236] text-xs font-mono">
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">
              Lead Author
            </span>
            <span className="text-slate-200 font-medium">
              {postmortem.owner}
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">
              Team
            </span>
            <span className="text-slate-200 font-medium">{postmortem.team}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">
              Impact Window
            </span>
            <span className="text-slate-200 font-medium">
              {postmortem.durationMinutes} minutes
            </span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase block">
              Estimated Impact
            </span>
            <span className="text-rose-400 font-medium">
              {postmortem.financialImpactEstimate || "Minimal"}
            </span>
          </div>
        </div>
      </div>

      {/* Section 1: Executive Summary */}
      <Card className="p-5 space-y-3">
        <h2 className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-2">
          <FileText className="w-4 h-4 text-sky-400" />
          1. Incident & Customer Impact Summary
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {postmortem.impactSummary}
        </p>
      </Card>

      {/* Section 2: Root Cause Analysis */}
      <Card className="p-5 space-y-3">
        <h2 className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          2. Root Cause Technical Deep Dive
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {postmortem.rootCauseAnalysis}
        </p>
      </Card>

      {/* Section 3: 5 Whys Analysis */}
      <Card className="p-5 space-y-3">
        <h2 className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-indigo-400" />
          3. Five Whys Investigation Ladder
        </h2>
        <div className="space-y-2.5 pt-1">
          {postmortem.fiveWhys.map((why, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-md bg-[#0A0F1A] border border-[#182338] text-xs"
            >
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono text-[11px] font-semibold flex items-center justify-center shrink-0">
                {idx + 1}
              </span>
              <p className="text-slate-300 leading-relaxed font-mono">
                {why}
              </p>
            </div>
          ))}
        </div>
      </Card>

      {/* Section 4: What Went Well & Where We Got Lucky */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 space-y-3">
          <h3 className="text-xs font-mono uppercase text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            What Went Well
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            {postmortem.whatWentWell.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-4 space-y-3">
          <h3 className="text-xs font-mono uppercase text-amber-400 font-semibold flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Where We Got Lucky
          </h3>
          <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
            {postmortem.whereWeGotLucky.map((item, i) => (
              <li key={i} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {/* Section 5: Preventive Action Items Tracker */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            5. Preventive Action Items ({postmortem.actionItems.length})
          </h2>
          <span className="text-[11px] font-mono text-slate-400">
            Assigned in Jira / Linear
          </span>
        </div>

        <div className="divide-y divide-[#172236] text-xs font-mono">
          {postmortem.actionItems.map((act) => (
            <div
              key={act.id}
              className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
            >
              <div className="flex items-start gap-2.5">
                <span
                  className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                    act.priority === "P0"
                      ? "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                      : "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  }`}
                >
                  {act.priority}
                </span>
                <span className="text-slate-200 font-sans">
                  {act.title}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-slate-400 text-[11px]">
                <span>@{act.assignee}</span>
                <span>Due: {act.dueDate}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] capitalize ${
                    act.status === "completed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : act.status === "in_progress"
                      ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                  }`}
                >
                  {act.status.replace("_", " ")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Section 6: AI Hindsight Recommendations */}
      <Card className="p-5 space-y-3 border-indigo-500/30 bg-[#0C1222]">
        <h2 className="text-xs font-mono uppercase text-indigo-300 font-semibold tracking-wider flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-indigo-400" />
          6. Automated Hindsight Memory Indexing
        </h2>
        <div className="space-y-2 text-xs text-slate-300">
          {postmortem.hindsightRecommendations.map((rec, i) => (
            <div
              key={i}
              className="p-2.5 rounded bg-[#080D18] border border-[#19253C] flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
