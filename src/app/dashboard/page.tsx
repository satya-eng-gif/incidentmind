"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  BrainCircuit,
  Flame,
  ChevronRight,
  Server,
  Terminal,
  Copy,
  Check,
  ArrowUpRight,
  Layers,
} from "lucide-react";
import {
  MOCK_INCIDENTS,
  MOCK_SERVICES,
  MOCK_HINDSIGHT_MEMORIES,
  MOCK_POSTMORTEMS,
  MOCK_SRE_TEAM,
} from "@/lib/mock-data";
import { SeverityBadge, StatusBadge, HindsightScoreBadge, ServiceTierBadge } from "@/components/ui/Badge";
import { MetricCard } from "@/components/ui/MetricCard";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const activeIncidents = MOCK_INCIDENTS.filter((i) => i.status !== "resolved");
  const topHindsightMatch = MOCK_HINDSIGHT_MEMORIES[0];

  const handleCopySnippet = (snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / System Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-lg bg-[#0E1524] border border-[#19253C] relative overflow-hidden">
        <div className="flex items-start md:items-center gap-3.5">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-semibold text-slate-100 font-mono tracking-tight">
                ACTIVE INCIDENT RESPONSE STATE
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/15 text-rose-400 border border-rose-500/30 font-medium">
                1 SEV-1 ACTIVE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              HikariCP connection pool starvation in{" "}
              <span className="text-slate-200 font-mono">auth-service</span> is
              escalating p99 latency. Automated Hindsight memory pattern match
              identified.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link href="/incidents/INC-8491">
            <Button
              variant="danger"
              size="sm"
              icon={<ArrowUpRight className="w-3.5 h-3.5" />}
              iconPosition="right"
            >
              Open INC-8491 War Room
            </Button>
          </Link>
          <Link href="/incidents/new">
            <Button variant="secondary" size="sm">
              Declare Incident
            </Button>
          </Link>
        </div>
      </div>

      {/* SRE Telemetry & KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Active Incidents"
          value={activeIncidents.length}
          subValue="1 SEV-1 • 2 SEV-2"
          change="+1 this shift"
          trend="up"
          statusColor="rose"
          icon={<AlertTriangle className="w-4 h-4 text-rose-400" />}
        />
        <MetricCard
          label="Mean Time To Acknowledge"
          value={`${MOCK_SRE_TEAM.systemHealthSummary.mttaMins}m`}
          subValue="SLA: < 5.0m"
          change="-18.4%"
          trend="down"
          statusColor="emerald"
          icon={<Clock className="w-4 h-4 text-sky-400" />}
        />
        <MetricCard
          label="Mean Time To Resolve"
          value={`${MOCK_SRE_TEAM.systemHealthSummary.mttrMins}m`}
          subValue="Target: < 60m"
          change="-12.1% w/ Hindsight"
          trend="down"
          statusColor="emerald"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-400" />}
        />
        <MetricCard
          label="Platform SLA (30-day)"
          value={`${MOCK_SRE_TEAM.systemHealthSummary.weeklyAvailabilityPercent}%`}
          subValue="Budget Rem: 7h 42m"
          change="99.95% target"
          trend="neutral"
          statusColor="slate"
          icon={<Layers className="w-4 h-4 text-indigo-400" />}
        />
      </div>

      {/* Main Grid: Active Incidents (Left 2/3) + Hindsight Memory Engine (Right 1/3) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Incidents Queue */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#182338]">
              <div>
                <CardTitle className="text-xs uppercase font-mono tracking-wider text-slate-400">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Active Incidents Triage Queue ({activeIncidents.length})
                </CardTitle>
              </div>
              <Link
                href="/incidents"
                className="text-xs font-mono text-sky-400 hover:text-sky-300 flex items-center gap-1 transition-colors"
              >
                View all ({MOCK_INCIDENTS.length})
                <ChevronRight className="w-3 h-3" />
              </Link>
            </CardHeader>

            <div className="divide-y divide-[#162032]">
              {activeIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="p-4 hover:bg-[#121A2A] transition-colors flex flex-col gap-2.5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <SeverityBadge severity={incident.severity} size="sm" />
                      <Link
                        href={`/incidents/${incident.id}`}
                        className="text-xs font-mono font-semibold text-slate-100 hover:text-sky-400 transition-colors"
                      >
                        {incident.id}
                      </Link>
                      <StatusBadge status={incident.status} size="sm" />
                    </div>

                    <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {incident.durationMinutes}m duration
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/incidents/${incident.id}`}
                    className="text-xs text-slate-200 font-medium hover:text-white line-clamp-1"
                  >
                    {incident.title}
                  </Link>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] text-slate-500 font-mono">
                        Services:
                      </span>
                      {incident.impactedServices.map((svc) => (
                        <span
                          key={svc}
                          className="px-1.5 py-0.5 rounded bg-[#162235] text-[10px] font-mono text-slate-300 border border-[#233148]"
                        >
                          {svc}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {incident.hindsightConfidence && (
                        <HindsightScoreBadge score={incident.hindsightConfidence} />
                      )}
                      <Link href={`/incidents/${incident.id}`}>
                        <Button variant="subtle" size="xs">
                          Command Center →
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Critical Services Health Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#182338]">
              <CardTitle className="text-xs uppercase font-mono tracking-wider text-slate-400">
                <Server className="w-3.5 h-3.5 text-sky-400" />
                Service Health & Latency Budget
              </CardTitle>
              <span className="text-[11px] font-mono text-slate-500">
                Live Prometheus Ingestion
              </span>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-[#162032] text-slate-500 text-[10px] uppercase">
                    <th className="py-2.5 px-4 font-medium">Service</th>
                    <th className="py-2.5 px-4 font-medium">Tier</th>
                    <th className="py-2.5 px-4 font-medium">Health</th>
                    <th className="py-2.5 px-4 font-medium">p99 Latency</th>
                    <th className="py-2.5 px-4 font-medium">5xx Rate</th>
                    <th className="py-2.5 px-4 font-medium">Owner</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#141C2C]">
                  {MOCK_SERVICES.slice(0, 5).map((service) => (
                    <tr
                      key={service.id}
                      className="hover:bg-[#121A29] transition-colors"
                    >
                      <td className="py-2.5 px-4 font-medium text-slate-200">
                        {service.name}
                      </td>
                      <td className="py-2.5 px-4">
                        <ServiceTierBadge tier={service.tier} />
                      </td>
                      <td className="py-2.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] ${
                            service.health === "healthy"
                              ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
                              : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              service.health === "healthy"
                                ? "bg-emerald-400"
                                : "bg-rose-400 animate-ping-slow"
                            }`}
                          />
                          {service.health}
                        </span>
                      </td>
                      <td
                        className={`py-2.5 px-4 ${
                          service.currentP99Ms > 100
                            ? "text-rose-400 font-semibold"
                            : "text-slate-300"
                        }`}
                      >
                        {service.currentP99Ms}ms
                      </td>
                      <td
                        className={`py-2.5 px-4 ${
                          service.errorRatePercent > 1.0
                            ? "text-rose-400 font-semibold"
                            : "text-slate-400"
                        }`}
                      >
                        {service.errorRatePercent}%
                      </td>
                      <td className="py-2.5 px-4 text-slate-400">
                        {service.ownerTeam}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Right Sidebar: Hindsight AI Correlated Memory & Recent Postmortems */}
        <div className="space-y-4">
          {/* Active Hindsight Memory Recommendation */}
          <Card className="border-indigo-500/30 bg-[#0D1222] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
            <CardHeader className="pb-3 border-b border-[#1A253E]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xs uppercase font-mono tracking-wider text-indigo-300 flex items-center gap-1.5">
                  <BrainCircuit className="w-4 h-4 text-indigo-400" />
                  Hindsight Memory Engine
                </CardTitle>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  94% Match
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-3.5 space-y-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400">
                  Historical Anomaly Correlated
                </span>
                <p className="text-xs font-semibold text-slate-200 mt-0.5">
                  {topHindsightMatch.patternName}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
                  {topHindsightMatch.rootCauseSummary}
                </p>
              </div>

              {/* Proven SRE Mitigation Snippet */}
              <div className="p-2.5 rounded-md bg-[#0A0E18] border border-[#1C263A] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1">
                    <Terminal className="w-3 h-3 text-sky-400" />
                    Recommended SRE Runbook Action:
                  </span>
                  <button
                    onClick={() =>
                      handleCopySnippet(topHindsightMatch.runbookSnippet)
                    }
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {copiedSnippet ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedSnippet ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <code className="block text-[11px] font-mono text-emerald-400 break-all bg-black/40 p-2 rounded border border-[#162030]">
                  {topHindsightMatch.runbookSnippet}
                </code>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px] font-mono">
                <span className="text-slate-400">
                  Historical recurrence: {topHindsightMatch.recurrenceCount}x
                </span>
                <Link
                  href={`/memory`}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-0.5"
                >
                  Explore Memory Vector →
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Postmortems / Retrospectives */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-[#182338]">
              <CardTitle className="text-xs uppercase font-mono tracking-wider text-slate-400">
                Recent Postmortems
              </CardTitle>
              <Link
                href="/postmortems"
                className="text-xs font-mono text-sky-400 hover:text-sky-300"
              >
                All ({MOCK_POSTMORTEMS.length})
              </Link>
            </CardHeader>
            <div className="divide-y divide-[#151E2E]">
              {MOCK_POSTMORTEMS.map((pm) => (
                <Link
                  key={pm.id}
                  href={`/postmortems/${pm.id}`}
                  className="p-3.5 block hover:bg-[#121A28] transition-colors group"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                    <span className="text-slate-400 group-hover:text-slate-300">
                      {pm.id}
                    </span>
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] ${
                        pm.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {pm.status}
                    </span>
                  </div>
                  <h4 className="text-xs font-medium text-slate-200 group-hover:text-sky-300 transition-colors line-clamp-1">
                    {pm.title}
                  </h4>
                  <div className="flex items-center gap-2 mt-1.5 text-[10px] font-mono text-slate-500">
                    <span>{pm.team}</span>
                    <span>•</span>
                    <span>{pm.actionItems.length} action items</span>
                  </div>
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
