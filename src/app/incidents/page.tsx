"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  PlusCircle,
  Clock,
} from "lucide-react";
import { MOCK_INCIDENTS, MOCK_SERVICES } from "@/lib/mock-data";
import { Severity } from "@/lib/types";
import { SeverityBadge, StatusBadge, HindsightScoreBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function IncidentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatusTab, setSelectedStatusTab] = useState<"all" | "active" | "mitigated" | "resolved">("all");
  const [selectedSeverity, setSelectedSeverity] = useState<Severity | "ALL">("ALL");
  const [selectedService, setSelectedService] = useState<string>("ALL");

  const filteredIncidents = useMemo(() => {
    return MOCK_INCIDENTS.filter((incident) => {
      // Status tab filter
      if (selectedStatusTab === "active") {
        if (incident.status === "resolved" || incident.status === "mitigated") return false;
      } else if (selectedStatusTab === "mitigated") {
        if (incident.status !== "mitigated") return false;
      } else if (selectedStatusTab === "resolved") {
        if (incident.status !== "resolved") return false;
      }

      // Severity filter
      if (selectedSeverity !== "ALL" && incident.severity !== selectedSeverity) {
        return false;
      }

      // Service filter
      if (
        selectedService !== "ALL" &&
        !incident.impactedServices.includes(selectedService)
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesId = incident.id.toLowerCase().includes(query);
        const matchesTitle = incident.title.toLowerCase().includes(query);
        const matchesSummary = incident.summary.toLowerCase().includes(query);
        const matchesCommander = incident.commander.name.toLowerCase().includes(query);
        const matchesTags = incident.tags.some((tag) => tag.toLowerCase().includes(query));

        if (!matchesId && !matchesTitle && !matchesSummary && !matchesCommander && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedStatusTab, selectedSeverity, selectedService]);

  const activeCount = MOCK_INCIDENTS.filter((i) => i.status !== "resolved").length;

  return (
    <div className="space-y-5">
      {/* Header and Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-slate-100 font-mono tracking-tight flex items-center gap-2">
            INCIDENT TRIAGE & WAR ROOMS
            <span className="text-xs font-normal px-2 py-0.5 rounded bg-[#172235] text-slate-300 border border-[#24334C]">
              {filteredIncidents.length} shown
            </span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Active and historical production incidents across all monitored infrastructure tiers.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link href="/incidents/new">
            <Button
              variant="danger"
              size="sm"
              icon={<PlusCircle className="w-3.5 h-3.5" />}
            >
              Declare Incident
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3.5 rounded-lg bg-[#0E1524] border border-[#19253C] space-y-3">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-md bg-[#0A0E18] border border-[#172134]">
            <button
              onClick={() => setSelectedStatusTab("all")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                selectedStatusTab === "all"
                  ? "bg-[#182338] text-white font-medium shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              All ({MOCK_INCIDENTS.length})
            </button>
            <button
              onClick={() => setSelectedStatusTab("active")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
                selectedStatusTab === "active"
                  ? "bg-rose-500/20 text-rose-300 font-medium border border-rose-500/30"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              Active ({activeCount})
            </button>
            <button
              onClick={() => setSelectedStatusTab("mitigated")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                selectedStatusTab === "mitigated"
                  ? "bg-[#182338] text-teal-300 font-medium shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Mitigated
            </button>
            <button
              onClick={() => setSelectedStatusTab("resolved")}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                selectedStatusTab === "resolved"
                  ? "bg-[#182338] text-emerald-300 font-medium shadow-xs"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Resolved
            </button>
          </div>

          {/* Quick Filters: Severity & Services */}
          <div className="flex items-center gap-2">
            <select
              aria-label="Filter by Severity"
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as Severity | "ALL")}
              className="px-2.5 py-1.5 rounded-md bg-[#0A0E18] border border-[#1A263C] text-xs font-mono text-slate-300 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">Severity: All</option>
              <option value="SEV-0">SEV-0 (Critical Outage)</option>
              <option value="SEV-1">SEV-1 (Major Degradation)</option>
              <option value="SEV-2">SEV-2 (Moderate Impact)</option>
              <option value="SEV-3">SEV-3 (Minor Bug / Alert)</option>
              <option value="SEV-4">SEV-4 (Low / Cosmetic)</option>
            </select>

            <select
              aria-label="Filter by Impacted Service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="px-2.5 py-1.5 rounded-md bg-[#0A0E18] border border-[#1A263C] text-xs font-mono text-slate-300 focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">Service: All</option>
              {MOCK_SERVICES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Filter incidents by title, ID (e.g. INC-8491), commander, root cause tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-[#090D17] border border-[#1C283E] rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
          />
        </div>
      </div>

      {/* Incidents Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#182338] bg-[#0B101C] text-slate-400 text-[10px] font-mono uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Incident</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Impacted Services</th>
                <th className="py-3 px-4 font-semibold">Duration / Age</th>
                <th className="py-3 px-4 font-semibold">Commander</th>
                <th className="py-3 px-4 font-semibold">Hindsight AI</th>
                <th className="py-3 px-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141D2D]">
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-mono text-xs">
                    No incidents match your active filters.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr
                    key={incident.id}
                    className="hover:bg-[#121A2A] transition-colors group"
                  >
                    {/* ID & Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 mb-1">
                        <SeverityBadge severity={incident.severity} size="sm" />
                        <Link
                          href={`/incidents/${incident.id}`}
                          className="font-mono font-semibold text-sky-400 hover:text-sky-300"
                        >
                          {incident.id}
                        </Link>
                      </div>
                      <Link
                        href={`/incidents/${incident.id}`}
                        className="font-medium text-slate-200 hover:text-white line-clamp-1 text-xs"
                      >
                        {incident.title}
                      </Link>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={incident.status} size="sm" />
                    </td>

                    {/* Services */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {incident.impactedServices.map((svc) => (
                          <span
                            key={svc}
                            className="px-1.5 py-0.2 rounded bg-[#162133] text-[10px] font-mono text-slate-300 border border-[#223046]"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Duration / Age */}
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-slate-400 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{incident.durationMinutes}m</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {incident.status === "resolved" ? "Resolved" : "Ongoing"}
                      </span>
                    </td>

                    {/* Commander */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-slate-700 font-mono text-[10px] flex items-center justify-center text-slate-200">
                          {incident.commander.avatar}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs text-slate-200 font-medium">
                            {incident.commander.name}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {incident.leadTeam}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Hindsight AI */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {incident.hindsightConfidence ? (
                        <HindsightScoreBadge score={incident.hindsightConfidence} />
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400">
                          Uncorrelated
                        </span>
                      )}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <Link href={`/incidents/${incident.id}`}>
                        <Button variant="secondary" size="xs">
                          Command Center →
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
