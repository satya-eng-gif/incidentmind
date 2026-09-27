"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  ExternalLink,
  Hash,
  Video,
  Flame,
  BrainCircuit,
  Terminal,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  GitCommit,
  Activity,
  Send,
  ShieldCheck,
  TrendingUp,
  FileText,
} from "lucide-react";
import {
  MOCK_INCIDENTS,
  MOCK_TIMELINE_EVENTS,
  MOCK_TELEMETRY_DATA,
  MOCK_HINDSIGHT_MEMORIES,
} from "@/lib/mock-data";
import { IncidentStatus } from "@/lib/types";
import { SeverityBadge, StatusBadge, HindsightScoreBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";

export default function IncidentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = use(params);
  const incidentId = unwrappedParams.id;

  const incident =
    MOCK_INCIDENTS.find((i) => i.id === incidentId) || MOCK_INCIDENTS[0];

  const [currentStatus, setCurrentStatus] = useState<IncidentStatus>(
    incident.status
  );
  const [activeTab, setActiveTab] = useState<
    "investigation" | "telemetry" | "timeline" | "actions"
  >("investigation");

  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [timelineEvents, setTimelineEvents] = useState(
    MOCK_TIMELINE_EVENTS[incident.id] || MOCK_TIMELINE_EVENTS["INC-8491"] || []
  );
  const [newNote, setNewNote] = useState("");

  const correlatedMemory = MOCK_HINDSIGHT_MEMORIES.find(
    (m) => m.id === incident.correlatedMemoryId
  ) || MOCK_HINDSIGHT_MEMORIES[0];

  const handleCopySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  const handleAddTimelineNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const now = new Date();
    const timeStr = `${now.getUTCHours().toString().padStart(2, "0")}:${now
      .getUTCMinutes()
      .toString()
      .padStart(2, "0")} UTC`;

    const newEvt = {
      id: `evt-${Date.now()}`,
      timestamp: timeStr,
      type: "note" as const,
      title: "SRE Responder Observation",
      description: newNote,
      author: { name: "Alex Chen", role: "Incident Commander" },
    };

    setTimelineEvents([newEvt, ...timelineEvents]);
    setNewNote("");
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          href="/incidents"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Incidents Queue
        </Link>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Status:</span>
          <select
            value={currentStatus}
            onChange={(e) => setCurrentStatus(e.target.value as IncidentStatus)}
            className="px-2.5 py-1 rounded bg-[#101726] border border-[#223048] text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
          >
            <option value="investigating">investigating</option>
            <option value="identified">identified</option>
            <option value="monitoring">monitoring</option>
            <option value="mitigated">mitigated</option>
            <option value="resolved">resolved</option>
          </select>
        </div>
      </div>

      {/* Incident Header Command Bar */}
      <div className="p-5 rounded-lg bg-[#0E1524] border border-[#19253C] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 flex-wrap">
              <SeverityBadge severity={incident.severity} size="lg" />
              <h1 className="text-base sm:text-lg font-bold font-mono text-white tracking-tight">
                {incident.id}
              </h1>
              <StatusBadge status={currentStatus} size="md" />
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#141E30] text-slate-300 border border-[#212E46]">
                Duration: {incident.durationMinutes}m
              </span>
            </div>

            <h2 className="text-sm sm:text-base font-semibold text-slate-100">
              {incident.title}
            </h2>

            <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
              {incident.summary}
            </p>
          </div>

          {/* Quick War Room Links */}
          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
            {incident.slackChannel && (
              <a
                href="#slack-war-room"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#131D2E] hover:bg-[#1A263B] border border-[#223048] text-xs font-mono text-slate-200 transition-colors"
              >
                <Hash className="w-3.5 h-3.5 text-sky-400" />
                <span>{incident.slackChannel}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            )}

            {incident.warRoomUrl && (
              <a
                href={incident.warRoomUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-xs font-mono text-rose-300 transition-colors"
              >
                <Video className="w-3.5 h-3.5 text-rose-400" />
                <span>Join Video Bridge</span>
                <ExternalLink className="w-3 h-3 text-rose-400" />
              </a>
            )}
          </div>
        </div>

        {/* Commander, Team, and Services Bar */}
        <div className="pt-3 border-t border-[#172236] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Commander:</span>
              <span className="text-slate-200 font-medium">
                {incident.commander.name}
              </span>
              <span className="text-[10px] text-slate-400">
                ({incident.commander.role})
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400">Lead Team:</span>
              <span className="text-slate-200">{incident.leadTeam}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400">Impacted:</span>
            {incident.impactedServices.map((svc) => (
              <span
                key={svc}
                className="px-2 py-0.5 rounded bg-[#131D2D] text-slate-300 border border-[#202E44] text-[11px]"
              >
                {svc}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-[#1A253C] pb-px">
        <button
          onClick={() => setActiveTab("investigation")}
          className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 font-medium flex items-center gap-2 ${
            activeTab === "investigation"
              ? "border-sky-500 text-sky-400 bg-sky-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          AI Hindsight & Root Cause
        </button>

        <button
          onClick={() => setActiveTab("telemetry")}
          className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 font-medium flex items-center gap-2 ${
            activeTab === "telemetry"
              ? "border-sky-500 text-sky-400 bg-sky-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          Telemetry & Metrics (Live)
        </button>

        <button
          onClick={() => setActiveTab("timeline")}
          className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 font-medium flex items-center gap-2 ${
            activeTab === "timeline"
              ? "border-sky-500 text-sky-400 bg-sky-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Incident Timeline ({timelineEvents.length})
        </button>

        <button
          onClick={() => setActiveTab("actions")}
          className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 font-medium flex items-center gap-2 ${
            activeTab === "actions"
              ? "border-sky-500 text-sky-400 bg-sky-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Mitigation & Actions ({incident.actionItemsCount.completed}/
          {incident.actionItemsCount.total})
        </button>
      </div>

      {/* Tab 1: AI Hindsight & Investigation */}
      {activeTab === "investigation" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            {/* AI Hypotheses Card */}
            <Card className="p-4 space-y-3 border-indigo-500/30 bg-[#0C1222]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-indigo-300 font-semibold flex items-center gap-2">
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  Correlated Failure Hypothesis
                </span>
                <HindsightScoreBadge score={incident.hindsightConfidence} />
              </div>

              <div className="p-3 rounded-md bg-[#090E1A] border border-[#19243C]">
                <p className="text-xs text-slate-200 font-medium leading-relaxed">
                  {incident.rootCauseHypothesis}
                </p>
                <div className="mt-2 text-[11px] font-mono text-slate-400 flex items-center gap-2">
                  <span>Blast Radius:</span>
                  <span className="text-rose-400">{incident.blastRadius}</span>
                </div>
              </div>
            </Card>

            {/* Recommended Runbook Execution Block */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase text-slate-300 font-semibold flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-sky-400" />
                  Suggested Runbook Action ({correlatedMemory.runbookTitle})
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Verified in 4 previous incidents
                </span>
              </div>

              <p className="text-xs text-slate-400">
                {correlatedMemory.provenMitigation}
              </p>

              <div className="p-3 rounded-md bg-[#080C16] border border-[#19243A] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>Execute in production cluster:</span>
                  <button
                    onClick={() =>
                      handleCopySnippet(correlatedMemory.runbookSnippet)
                    }
                    className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors"
                  >
                    {copiedSnippet ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedSnippet ? "Copied" : "Copy Command"}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-emerald-400 overflow-x-auto p-2 rounded bg-black/40 border border-[#152032]">
                  {correlatedMemory.runbookSnippet}
                </pre>
              </div>
            </Card>

            {/* Correlated Commit / Deployment */}
            <Card className="p-4 space-y-3">
              <span className="text-xs font-mono uppercase text-slate-300 font-semibold flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-amber-400" />
                Correlated Release / Deployment
              </span>
              <div className="p-3 rounded-md bg-[#0A0E18] border border-[#182338] flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      auth-service v3.18.2
                    </span>
                    <span className="text-slate-400">Commit: 8f19da3</span>
                    <span className="text-slate-400">• 14m before spike</span>
                  </div>
                  <p className="text-xs text-slate-300">
                    Added token introspection check without local query caching.
                  </p>
                </div>
                <Button variant="secondary" size="xs">
                  View Diff
                </Button>
              </div>
            </Card>
          </div>

          {/* Right Column: Historical Matches in Hindsight Memory */}
          <div className="space-y-4">
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#182338]">
                <span className="text-xs font-mono uppercase text-slate-300 font-semibold">
                  Historical Memory Match
                </span>
                <Link
                  href="/memory"
                  className="text-xs font-mono text-sky-400 hover:text-sky-300"
                >
                  Memory Explorer →
                </Link>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-sky-400 font-semibold">
                    {correlatedMemory.patternName}
                  </span>
                  <span className="text-slate-400">
                    {correlatedMemory.incidentId}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {correlatedMemory.rootCauseSummary}
                </p>
              </div>

              <div className="pt-2 border-t border-[#182338] space-y-1 text-[11px] font-mono text-slate-400">
                <div className="flex justify-between">
                  <span>Occurred:</span>
                  <span className="text-slate-300">April 2026 (5 months ago)</span>
                </div>
                <div className="flex justify-between">
                  <span>MTTR in past incident:</span>
                  <span className="text-slate-300">38 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span>Historical Postmortem:</span>
                  <Link
                    href="/postmortems/PM-8475"
                    className="text-sky-400 hover:underline"
                  >
                    View Retrospective
                  </Link>
                </div>
              </div>
            </Card>

            {/* Quick SRE Checklist */}
            <Card className="p-4 space-y-3">
              <span className="text-xs font-mono uppercase text-slate-300 font-semibold block pb-2 border-b border-[#182338]">
                SRE Response Checklist
              </span>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>War Room & Communications opened</span>
                </div>
                <div className="flex items-center gap-2 text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Telemetry anomaly pattern confirmed</span>
                </div>
                <div className="flex items-center gap-2 text-slate-300">
                  <span className="w-4 h-4 rounded-full border border-amber-400/60 flex items-center justify-center text-[10px] text-amber-400 font-mono">
                    3
                  </span>
                  <span>Apply pool scaling mitigation</span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px] text-slate-500 font-mono">
                    4
                  </span>
                  <span>Confirm 30-minute metric stabilization</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab 2: Telemetry & Metrics Charts */}
      {activeTab === "telemetry" && (
        <div className="space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Chart 1: p99 Latency Curve */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase text-slate-300 font-semibold">
                    auth-service: p99 Latency (ms)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    SLA Threshold: 250ms • Peak reached: 3,450ms
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
                  CRITICAL BREACH
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_TELEMETRY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A253A" />
                    <XAxis
                      dataKey="timestamp"
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                      domain={[0, 4000]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B101C",
                        borderColor: "#223048",
                        fontSize: "12px",
                        fontFamily: "monospace",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="p99LatencyMs"
                      stroke="#F43F5E"
                      strokeWidth={2}
                      dot={{ fill: "#F43F5E", r: 3 }}
                      activeDot={{ r: 5 }}
                      name="p99 Latency (ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Chart 2: 5xx Error Rate Area Chart */}
            <Card className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-mono uppercase text-slate-300 font-semibold">
                    HTTP 504 Gateway Timeout Rate (%)
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Tolerance threshold: &lt; 0.05% • Peak: 7.1%
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  RECOVERING
                </span>
              </div>

              <div className="h-64 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_TELEMETRY_DATA}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1A253A" />
                    <XAxis
                      dataKey="timestamp"
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748B"
                      fontSize={10}
                      tickLine={false}
                      domain={[0, 8]}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0B101C",
                        borderColor: "#223048",
                        fontSize: "12px",
                        fontFamily: "monospace",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="errorRatePercent"
                      stroke="#F59E0B"
                      fill="#F59E0B"
                      fillOpacity={0.15}
                      strokeWidth={2}
                      name="Error Rate (%)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-md bg-[#0D1322] border border-[#192438] text-xs font-mono">
              <span className="text-slate-400 block text-[10px]">CURRENT RPS</span>
              <span className="text-base font-bold text-slate-200">15,900 /s</span>
            </div>
            <div className="p-3 rounded-md bg-[#0D1322] border border-[#192438] text-xs font-mono">
              <span className="text-slate-400 block text-[10px]">PG CONNECTION WAIT</span>
              <span className="text-base font-bold text-emerald-400">14ms (Normal)</span>
            </div>
            <div className="p-3 rounded-md bg-[#0D1322] border border-[#192438] text-xs font-mono">
              <span className="text-slate-400 block text-[10px]">ACTIVE WORKER THREADS</span>
              <span className="text-base font-bold text-slate-200">42 / 60</span>
            </div>
            <div className="p-3 rounded-md bg-[#0D1322] border border-[#192438] text-xs font-mono">
              <span className="text-slate-400 block text-[10px]">SLO BURN RATE</span>
              <span className="text-base font-bold text-amber-400">1.8x</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Chronological Incident Timeline */}
      {activeTab === "timeline" && (
        <div className="space-y-4">
          {/* Post note form */}
          <form
            onSubmit={handleAddTimelineNote}
            className="p-3 rounded-lg bg-[#0E1524] border border-[#19253C] flex gap-2"
          >
            <input
              type="text"
              placeholder="Record a live observation, command output, or team update to the incident timeline..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-[#090D17] border border-[#1C283E] rounded-md text-xs font-mono text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500"
            />
            <Button
              type="submit"
              variant="secondary"
              size="sm"
              icon={<Send className="w-3.5 h-3.5" />}
            >
              Post Note
            </Button>
          </form>

          {/* Timeline Feed */}
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-[#1C283E]">
            {timelineEvents.map((evt) => {
              const typeBadges = {
                metric_spike: {
                  bg: "bg-rose-500",
                  text: "text-rose-400",
                  icon: TrendingUp,
                },
                alert: {
                  bg: "bg-amber-500",
                  text: "text-amber-400",
                  icon: AlertTriangle,
                },
                status_change: {
                  bg: "bg-sky-500",
                  text: "text-sky-400",
                  icon: Flame,
                },
                hindsight_pattern: {
                  bg: "bg-indigo-500",
                  text: "text-indigo-400",
                  icon: BrainCircuit,
                },
                deployment: {
                  bg: "bg-violet-500",
                  text: "text-violet-400",
                  icon: GitCommit,
                },
                mitigation: {
                  bg: "bg-emerald-500",
                  text: "text-emerald-400",
                  icon: ShieldCheck,
                },
                note: {
                  bg: "bg-slate-400",
                  text: "text-slate-300",
                  icon: Clock,
                },
              };

              const currentType = typeBadges[evt.type] || typeBadges.note;
              const Icon = currentType.icon;

              return (
                <div key={evt.id} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-6 mt-1 w-2.5 h-2.5 rounded-full bg-[#0E1524] border-2 border-sky-400 ring-4 ring-[#090D16]" />

                  <div className="p-3.5 rounded-lg bg-[#0E1524] border border-[#19253C] space-y-1.5 hover:border-slate-700 transition-colors">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <Icon className={`w-3.5 h-3.5 ${currentType.text}`} />
                        <span className="font-semibold text-slate-200">
                          {evt.title}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {evt.timestamp}
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {evt.description}
                    </p>

                    {evt.author && (
                      <div className="pt-1 text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                        <span>Recorded by:</span>
                        <span className="text-slate-300">
                          {evt.author.name}
                        </span>
                        <span>•</span>
                        <span>{evt.author.role}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 4: Mitigation & Actions */}
      {activeTab === "actions" && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-mono uppercase text-slate-300 font-semibold">
                  Mitigation Progress & Follow-up Actions
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Action items required before incident closure and postmortem sign-off.
                </p>
              </div>

              <Link href="/postmortems/PM-8475">
                <Button
                  variant="primary"
                  size="sm"
                  icon={<FileText className="w-3.5 h-3.5" />}
                >
                  Generate Postmortem Draft
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-[#162134] text-xs">
              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="line-through text-slate-400">
                    Scale HikariCP pool maxPoolSize from 20 to 60 per pod
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Completed
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="line-through text-slate-400">
                    Enable PgBouncer statement-level pooling mode
                  </span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Completed
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded border border-amber-400 shrink-0" />
                  <span className="text-slate-200">
                    Observe 30-minute burn-in window for error rate drop (&lt;0.05%)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  In Progress
                </span>
              </div>

              <div className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-4 h-4 rounded border border-slate-600 shrink-0" />
                  <span className="text-slate-300">
                    Patch unindexed token lookup query in auth-service v3.18.3
                  </span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-500/10 px-2 py-0.5 rounded border border-slate-500/20">
                  Pending Rollout
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
