"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Flame,
  ShieldAlert,
  Hash,
  Video,
  BrainCircuit,
  BellRing,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { Severity } from "@/lib/types";
import { MOCK_SERVICES } from "@/lib/mock-data";
import { SeverityBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function NewIncidentPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [severity, setSeverity] = useState<Severity>("SEV-1");
  const [summary, setSummary] = useState("");
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "auth-service",
  ]);
  const [autoSlack, setAutoSlack] = useState(true);
  const [autoMeet, setAutoMeet] = useState(true);
  const [autoHindsight, setAutoHindsight] = useState(true);
  const [autoPage, setAutoPage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const toggleService = (svcId: string) => {
    if (selectedServices.includes(svcId)) {
      setSelectedServices(selectedServices.filter((s) => s !== svcId));
    } else {
      setSelectedServices([...selectedServices, svcId]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    // Simulate incident declaration and automated war room creation
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedId("INC-8491");
      setTimeout(() => {
        router.push("/incidents/INC-8491");
      }, 1200);
    }, 800);
  };

  const severities: {
    sev: Severity;
    label: string;
    description: string;
  }[] = [
    {
      sev: "SEV-0",
      label: "Critical Outage",
      description: "Complete platform outage or data corruption impacting all users.",
    },
    {
      sev: "SEV-1",
      label: "Major Degradation",
      description: "Core Tier-0 service unavailable or failing for significant user subset.",
    },
    {
      sev: "SEV-2",
      label: "Moderate Impact",
      description: "Degraded performance or non-critical customer-facing workflow impacted.",
    },
    {
      sev: "SEV-3",
      label: "Minor Issue",
      description: "Low-impact edge case, internal tool failure, or minor latency increase.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Back link */}
      <div>
        <Link
          href="/incidents"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Incidents Queue
        </Link>
      </div>

      {/* Declaration Title & Alert Banner */}
      <div className="space-y-2">
        <h1 className="text-xl font-bold font-mono tracking-tight text-slate-100 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-400" />
          DECLARE PRODUCTION INCIDENT
        </h1>
        <p className="text-xs text-slate-400">
          Initialize incident war room, page the on-call SRE lead, and trigger real-time Hindsight Memory correlation.
        </p>
      </div>

      {submittedId ? (
        <Card className="p-8 text-center space-y-3 bg-[#0E1726] border-emerald-500/40">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-semibold font-mono text-white">
            Incident Declared: {submittedId}
          </h2>
          <p className="text-xs text-slate-300">
            War room generated, Slack channel initialized, and Hindsight Memory correlated. Redirecting to Command Center...
          </p>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Severity Selection */}
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wide">
                1. Select Severity Level
              </label>
              <span className="text-[11px] font-mono text-slate-400">
                Determines paging escalation policy
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {severities.map((item) => (
                <button
                  type="button"
                  key={item.sev}
                  onClick={() => setSeverity(item.sev)}
                  className={`p-3 rounded-lg border text-left transition-all flex flex-col justify-between ${
                    severity === item.sev
                      ? "bg-[#162235] border-sky-500 ring-1 ring-sky-500/30 shadow-xs"
                      : "bg-[#0B101C] border-[#1C263A] hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <SeverityBadge severity={item.sev} size="sm" />
                    <span className="text-xs font-semibold text-slate-200">
                      {item.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>
          </Card>

          {/* Incident Details */}
          <Card className="p-4 space-y-4">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wide block">
              2. Incident Overview & Symptoms
            </label>

            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Incident Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Postgres connection pool saturation under auth burst traffic"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#090D17] border border-[#1E293F] rounded-md text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Initial Symptoms */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Initial Symptoms & Observations
              </label>
              <textarea
                rows={3}
                placeholder="Describe what alerted the team, p99 latency spikes, error percentages, or failed API endpoints..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 bg-[#090D17] border border-[#1E293F] rounded-md text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 resize-none"
              />
            </div>

            {/* Impacted Services Multi-select */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Impacted Services & Infrastructure Components
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {selectedServices.length} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {MOCK_SERVICES.map((service) => {
                  const isSelected = selectedServices.includes(service.id);
                  return (
                    <button
                      type="button"
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-mono transition-colors border ${
                        isSelected
                          ? "bg-sky-500/20 text-sky-200 border-sky-500/40"
                          : "bg-[#0B101C] text-slate-400 border-[#1B263B] hover:text-slate-200"
                      }`}
                    >
                      {isSelected ? "✓ " : "+ "}
                      {service.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Incident Commander */}
            <div className="p-3 rounded-md bg-[#0A0E18] border border-[#182336] flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-sky-600 text-white font-mono text-[10px] flex items-center justify-center">
                  AC
                </div>
                <div>
                  <span className="text-slate-300 font-medium block">
                    Incident Commander: Alex Chen
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Staff SRE • Primary On-Call
                  </span>
                </div>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE ON-CALL
              </span>
            </div>
          </Card>

          {/* Automated War Room Provisions */}
          <Card className="p-4 space-y-3">
            <label className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wide block">
              3. Automated Orchestration Actions
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-2.5 p-2.5 rounded-md bg-[#0B101C] border border-[#1A253A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoSlack}
                  onChange={(e) => setAutoSlack(e.target.checked)}
                  className="mt-0.5 rounded bg-[#131C2D] border-[#223048] text-sky-500"
                />
                <div className="text-xs">
                  <span className="font-medium text-slate-200 flex items-center gap-1.5">
                    <Hash className="w-3.5 h-3.5 text-sky-400" />
                    Provision Slack Channel
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                    Auto-create #inc-&lt;id&gt;-warroom
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-md bg-[#0B101C] border border-[#1A253A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoMeet}
                  onChange={(e) => setAutoMeet(e.target.checked)}
                  className="mt-0.5 rounded bg-[#131C2D] border-[#223048] text-sky-500"
                />
                <div className="text-xs">
                  <span className="font-medium text-slate-200 flex items-center gap-1.5">
                    <Video className="w-3.5 h-3.5 text-indigo-400" />
                    Google Meet Bridge
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                    Instant video bridge for responder sync
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-md bg-[#0B101C] border border-[#1A253A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoHindsight}
                  onChange={(e) => setAutoHindsight(e.target.checked)}
                  className="mt-0.5 rounded bg-[#131C2D] border-[#223048] text-sky-500"
                />
                <div className="text-xs">
                  <span className="font-medium text-slate-200 flex items-center gap-1.5">
                    <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                    Trigger Hindsight Vector Query
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                    Correlate against 1,420 past incidents
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-2.5 rounded-md bg-[#0B101C] border border-[#1A253A] cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoPage}
                  onChange={(e) => setAutoPage(e.target.checked)}
                  className="mt-0.5 rounded bg-[#131C2D] border-[#223048] text-sky-500"
                />
                <div className="text-xs">
                  <span className="font-medium text-slate-200 flex items-center gap-1.5">
                    <BellRing className="w-3.5 h-3.5 text-rose-400" />
                    PagerDuty Escalation
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 font-mono">
                    Escalate to tier-0 on-call rotation
                  </span>
                </div>
              </label>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Link href="/incidents">
              <Button type="button" variant="outline" size="md">
                Cancel
              </Button>
            </Link>

            <Button
              type="submit"
              variant="danger"
              size="md"
              disabled={isSubmitting || !title.trim()}
              icon={<Flame className="w-4 h-4" />}
            >
              {isSubmitting ? "Orchestrating War Room..." : "Declare Incident & Open War Room"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
