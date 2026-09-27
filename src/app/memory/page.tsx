"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  BrainCircuit,
  Search,
  Copy,
  Check,
  BookOpen,
} from "lucide-react";
import { MOCK_HINDSIGHT_MEMORIES } from "@/lib/mock-data";
import { Card } from "@/components/ui/Card";

export default function MemoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = [
    "ALL",
    "Connection Pool Exhaustion",
    "Memory Leak & GC Pause",
    "Cascading Network Timeout",
    "Database Index Degradation",
    "Kafka Consumer Group Lag",
    "Configuration Drift",
  ];

  const filteredMemories = useMemo(() => {
    return MOCK_HINDSIGHT_MEMORIES.filter((mem) => {
      if (selectedCategory !== "ALL" && mem.failureCategory !== selectedCategory) {
        return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesTitle = mem.patternName.toLowerCase().includes(q);
        const matchesSummary = mem.rootCauseSummary.toLowerCase().includes(q);
        const matchesMitigation = mem.provenMitigation.toLowerCase().includes(q);
        const matchesServices = mem.services.some((s) => s.toLowerCase().includes(q));
        const matchesTags = mem.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesSummary && !matchesMitigation && !matchesServices && !matchesTags) {
          return false;
        }
      }
      return true;
    });
  }, [searchQuery, selectedCategory]);

  const handleCopy = (id: string, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Title & SRE Engine Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold font-mono tracking-tight text-slate-100 flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-indigo-400" />
            HINDSIGHT MEMORY & PATTERN REPOSITORY
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Institutional failure patterns, verified mitigations, and cross-incident postmortem intelligence.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-2.5 py-1 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
            Vector Index: 1,420 Incidents
          </span>
        </div>
      </div>

      {/* Memory Stats Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-lg bg-[#0E1524] border border-[#19243C]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            Indexed Patterns
          </span>
          <span className="text-xl font-bold font-mono text-slate-100 mt-0.5 block">
            1,420
          </span>
          <span className="text-[11px] text-slate-400">Postmortems & logs</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0E1524] border border-[#19243C]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            Verified Runbooks
          </span>
          <span className="text-xl font-bold font-mono text-slate-100 mt-0.5 block">
            342
          </span>
          <span className="text-[11px] text-emerald-400">Production ready</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0E1524] border border-[#19243C]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            Pattern Accuracy
          </span>
          <span className="text-xl font-bold font-mono text-indigo-300 mt-0.5 block">
            94.2%
          </span>
          <span className="text-[11px] text-slate-400">Telemetry correlation</span>
        </div>

        <div className="p-3.5 rounded-lg bg-[#0E1524] border border-[#19243C]">
          <span className="text-[10px] font-mono text-slate-400 uppercase block">
            MTTR Delta
          </span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
            -46 min
          </span>
          <span className="text-[11px] text-slate-400">With memory lookup</span>
        </div>
      </div>

      {/* Search and Category Filters */}
      <div className="p-4 rounded-lg bg-[#0E1524] border border-[#19253C] space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search failure patterns, symptoms, stack trace snippets, or runbooks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#090D17] border border-[#1C283E] rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded text-xs font-mono transition-colors border ${
                selectedCategory === cat
                  ? "bg-indigo-500/20 text-indigo-200 border-indigo-500/40 font-medium"
                  : "bg-[#0A0E18] text-slate-400 border-[#1A253A] hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Memory Pattern Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMemories.length === 0 ? (
          <div className="col-span-2 py-12 text-center text-slate-500 font-mono text-xs">
            No failure patterns matched your search criteria.
          </div>
        ) : (
          filteredMemories.map((entry) => (
            <Card
              key={entry.id}
              className="p-4 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-indigo-400 font-semibold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                    {entry.id}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#162134] text-slate-300 border border-[#21304A]">
                    {entry.failureCategory}
                  </span>
                </div>

                <h3 className="text-xs font-semibold text-slate-100">
                  {entry.patternName}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {entry.rootCauseSummary}
                </p>

                {/* Services & Recurrences */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-mono text-slate-500">
                    Services:
                  </span>
                  {entry.services.map((s) => (
                    <span
                      key={s}
                      className="px-1.5 py-0.2 rounded bg-[#131C2D] text-[10px] font-mono text-slate-300 border border-[#1C283E]"
                    >
                      {s}
                    </span>
                  ))}
                  <span className="text-[10px] font-mono text-amber-400 ml-auto">
                    {entry.recurrenceCount}x recorded
                  </span>
                </div>
              </div>

              {/* Proven Runbook Snippet */}
              <div className="p-2.5 rounded-md bg-[#090D16] border border-[#182336] space-y-1.5">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="flex items-center gap-1 text-slate-300">
                    <BookOpen className="w-3 h-3 text-sky-400" />
                    {entry.runbookTitle}
                  </span>
                  <button
                    onClick={() => handleCopy(entry.id, entry.runbookSnippet)}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {copiedId === entry.id ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === entry.id ? "Copied" : "Copy"}</span>
                  </button>
                </div>
                <code className="block text-[11px] font-mono text-emerald-400 break-all bg-black/40 p-2 rounded border border-[#152032]">
                  {entry.runbookSnippet}
                </code>
              </div>

              {/* Footer */}
              <div className="pt-2 border-t border-[#162032] flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span>Ref: {entry.incidentId}</span>
                <Link
                  href={`/incidents/${entry.incidentId}`}
                  className="text-sky-400 hover:text-sky-300 flex items-center gap-0.5"
                >
                  View Case Study →
                </Link>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
