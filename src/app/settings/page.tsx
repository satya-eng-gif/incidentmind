"use client";

import React, { useState } from "react";
import {
  Settings,
  Users,
  Radio,
  Bell,
  Cpu,
  BrainCircuit,
  CheckCircle2,
  Save,
  Activity,
  MessageSquare,
  GitPullRequest,
  Cloud,
} from "lucide-react";
import { MOCK_INTEGRATIONS, MOCK_SRE_TEAM } from "@/lib/mock-data";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "team" | "integrations" | "memory" | "policies"
  >("team");
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(85);
  const [autoSlackChannel, setAutoSlackChannel] = useState(true);
  const [escalationTimeoutMins, setEscalationTimeoutMins] = useState(5);
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2500);
  };

  const getIntegrationIcon = (category: string) => {
    switch (category) {
      case "Observability":
        return Activity;
      case "Chat":
        return MessageSquare;
      case "Alerting":
        return Bell;
      case "CI/CD":
        return GitPullRequest;
      case "Cloud":
        return Cloud;
      default:
        return Cpu;
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Save Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold font-mono tracking-tight text-slate-100 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-300" />
            SRE PLATFORM & INCIDENT SETTINGS
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            On-call rotation escalations, observability integrations, and Hindsight Memory policies.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {savedNotification && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settings updated
            </span>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={handleSave}
            icon={<Save className="w-3.5 h-3.5" />}
          >
            Save Changes
          </Button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-[#1A253C] pb-px">
        <button
          onClick={() => setActiveTab("team")}
          className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 font-medium flex items-center gap-2 ${
            activeTab === "team"
              ? "border-sky-500 text-sky-400 bg-sky-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          On-Call Rotations & Teams
        </button>

        <button
          onClick={() => setActiveTab("integrations")}
          className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 font-medium flex items-center gap-2 ${
            activeTab === "integrations"
              ? "border-sky-500 text-sky-400 bg-sky-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Cpu className="w-3.5 h-3.5" />
          Connected Integrations ({MOCK_INTEGRATIONS.length})
        </button>

        <button
          onClick={() => setActiveTab("memory")}
          className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 font-medium flex items-center gap-2 ${
            activeTab === "memory"
              ? "border-sky-500 text-sky-400 bg-sky-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <BrainCircuit className="w-3.5 h-3.5" />
          Hindsight Vector Memory
        </button>

        <button
          onClick={() => setActiveTab("policies")}
          className={`px-4 py-2 text-xs font-mono transition-colors border-b-2 font-medium flex items-center gap-2 ${
            activeTab === "policies"
              ? "border-sky-500 text-sky-400 bg-sky-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          Escalation Policies
        </button>
      </div>

      {/* Tab: On-Call Rotations */}
      {activeTab === "team" && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h2 className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              Active On-Call Shifts & Escalation Handlers
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Primary */}
              <div className="p-4 rounded-lg bg-[#0A0F1A] border border-[#182338] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    PRIMARY ON-CALL
                  </span>
                  <span className="text-slate-400">Shift ends: {MOCK_SRE_TEAM.currentOnCall.primary.shiftEnd}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-sky-600 text-white font-mono text-sm font-semibold flex items-center justify-center">
                    {MOCK_SRE_TEAM.currentOnCall.primary.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">
                      {MOCK_SRE_TEAM.currentOnCall.primary.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {MOCK_SRE_TEAM.currentOnCall.primary.role} • {MOCK_SRE_TEAM.currentOnCall.primary.timezone}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-[#141C2D]">
                  Paged on: SEV-0, SEV-1, SEV-2 incidents via PagerDuty / SMS / Voice
                </div>
              </div>

              {/* Secondary */}
              <div className="p-4 rounded-lg bg-[#0A0F1A] border border-[#182338] space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    SECONDARY ON-CALL
                  </span>
                  <span className="text-slate-400">Shift ends: {MOCK_SRE_TEAM.currentOnCall.secondary.shiftEnd}</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-mono text-sm font-semibold flex items-center justify-center">
                    {MOCK_SRE_TEAM.currentOnCall.secondary.avatar}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-100">
                      {MOCK_SRE_TEAM.currentOnCall.secondary.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      {MOCK_SRE_TEAM.currentOnCall.secondary.role} • {MOCK_SRE_TEAM.currentOnCall.secondary.timezone}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-[#141C2D]">
                  Escalation triggered if primary unacknowledged within 5 minutes
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Connected Integrations */}
      {activeTab === "integrations" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MOCK_INTEGRATIONS.map((integ) => {
              const Icon = getIntegrationIcon(integ.category);

              return (
                <Card
                  key={integ.id}
                  className="p-4 flex flex-col justify-between space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-md bg-[#131D2D] border border-[#1F2C42] flex items-center justify-center text-sky-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-xs font-semibold text-slate-200">
                          {integ.name}
                        </h3>
                        <span className="text-[10px] font-mono text-slate-400">
                          {integ.category}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {integ.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed font-sans">
                    {integ.description}
                  </p>

                  <div className="pt-2 border-t border-[#152032] flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>Last heartbeat: {integ.lastSync}</span>
                    <button className="text-sky-400 hover:text-sky-300">
                      Configure →
                    </button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Hindsight Vector Memory Configuration */}
      {activeTab === "memory" && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h2 className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-2">
              <BrainCircuit className="w-4 h-4 text-indigo-400" />
              Institutional Memory Engine Settings
            </h2>

            <div className="space-y-4 max-w-xl">
              <div>
                <label className="text-xs font-medium text-slate-200 block mb-1">
                  Correlation Confidence Threshold ({confidenceThreshold}%)
                </label>
                <p className="text-[11px] text-slate-400 mb-2 font-mono">
                  Only show automated runbook recommendations when vector cosine similarity exceeds this threshold.
                </p>
                <input
                  type="range"
                  min="60"
                  max="98"
                  value={confidenceThreshold}
                  onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                  className="w-full accent-sky-500"
                />
              </div>

              <div className="pt-3 border-t border-[#172236] space-y-2">
                <label className="text-xs font-medium text-slate-200 block">
                  Automatic Incident Vectorization
                </label>
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded bg-[#121A2A] border-[#223046] text-sky-500"
                  />
                  <span>
                    Index resolved incident timelines into vector memory immediately upon postmortem publication
                  </span>
                </label>
              </div>

              <div className="pt-3 border-t border-[#172236] space-y-2">
                <label className="text-xs font-medium text-slate-200 block">
                  Memory Retention Horizon
                </label>
                <select
                  aria-label="Memory Retention Horizon"
                  className="px-3 py-1.5 rounded bg-[#090E18] border border-[#1C283E] text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500"
                >
                  <option>Indefinite (Full institutional archive)</option>
                  <option>3 Years rolling</option>
                  <option>1 Year rolling</option>
                </select>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Escalation Policies */}
      {activeTab === "policies" && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <h2 className="text-xs font-mono uppercase text-slate-300 font-semibold tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-rose-400" />
              SRE Escalation SLA & Timers
            </h2>

            <div className="space-y-4 max-w-xl text-xs">
              <div className="space-y-1">
                <label className="font-medium text-slate-200 block">
                  Primary On-Call Acknowledgment SLA (Minutes)
                </label>
                <input
                  type="number"
                  value={escalationTimeoutMins}
                  onChange={(e) => setEscalationTimeoutMins(Number(e.target.value))}
                  className="w-32 px-3 py-1.5 bg-[#090E18] border border-[#1C283E] rounded font-mono text-slate-200"
                />
                <p className="text-[11px] text-slate-400 font-mono">
                  If unacknowledged, secondary on-call is escalated via phone call.
                </p>
              </div>

              <div className="pt-3 border-t border-[#172236] space-y-2">
                <label className="font-medium text-slate-200 block">
                  War Room Provisioning Automation
                </label>
                <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSlackChannel}
                    onChange={(e) => setAutoSlackChannel(e.target.checked)}
                    className="rounded bg-[#121A2A] border-[#223046] text-sky-500"
                  />
                  <span>
                    Automatically create dedicated Slack war room on SEV-0 and SEV-1 declaration
                  </span>
                </label>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
