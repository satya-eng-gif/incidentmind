export type Severity = "SEV-0" | "SEV-1" | "SEV-2" | "SEV-3" | "SEV-4";

export type IncidentStatus =
  | "investigating"
  | "identified"
  | "monitoring"
  | "mitigated"
  | "resolved";

export interface Service {
  id: string;
  name: string;
  tier: "Tier-0" | "Tier-1" | "Tier-2";
  ownerTeam: string;
  health: "healthy" | "degraded" | "outage";
  currentP99Ms: number;
  errorRatePercent: number;
}

export interface Incident {
  id: string;
  title: string;
  summary: string;
  severity: Severity;
  status: IncidentStatus;
  commander: {
    name: string;
    avatar: string;
    role: string;
  };
  declaredAt: string;
  impactStartedAt: string;
  resolvedAt?: string;
  durationMinutes: number;
  impactedServices: string[];
  leadTeam: string;
  slackChannel: string;
  warRoomUrl?: string;
  tags: string[];
  blastRadius: string;
  hindsightConfidence: number; // e.g., 94%
  correlatedMemoryId?: string;
  rootCauseHypothesis: string;
  actionItemsCount: {
    total: number;
    completed: number;
  };
}

export type TimelineEventType =
  | "alert"
  | "metric_spike"
  | "deployment"
  | "hindsight_pattern"
  | "mitigation"
  | "status_change"
  | "note";

export interface TimelineEvent {
  id: string;
  timestamp: string;
  type: TimelineEventType;
  title: string;
  description: string;
  author?: {
    name: string;
    role?: string;
  };
  meta?: {
    commitHash?: string;
    metricValue?: string;
    service?: string;
    confidence?: number;
    slackMsgId?: string;
  };
}

export interface MetricDataPoint {
  timestamp: string;
  p99LatencyMs: number;
  errorRatePercent: number;
  rps: number;
  cpuPercent: number;
}

export interface HindsightMemoryEntry {
  id: string;
  patternName: string;
  incidentId: string;
  failureCategory:
    | "Connection Pool Exhaustion"
    | "Memory Leak & GC Pause"
    | "Cascading Network Timeout"
    | "Database Index Degradation"
    | "Kafka Consumer Group Lag"
    | "Configuration Drift";
  similarityScore: number; // 0-100%
  occurredAt: string;
  services: string[];
  rootCauseSummary: string;
  provenMitigation: string;
  recurrenceCount: number;
  runbookTitle: string;
  runbookSnippet: string;
  tags: string[];
}

export interface PostmortemActionItem {
  id: string;
  title: string;
  assignee: string;
  priority: "P0" | "P1" | "P2";
  status: "todo" | "in_progress" | "completed";
  dueDate: string;
}

export interface Postmortem {
  id: string;
  incidentId: string;
  title: string;
  severity: Severity;
  status: "draft" | "in_review" | "published";
  owner: string;
  team: string;
  durationMinutes: number;
  impactStartTime: string;
  impactEndTime: string;
  financialImpactEstimate?: string;
  impactSummary: string;
  rootCauseAnalysis: string;
  fiveWhys: string[];
  contributingFactors: string[];
  whatWentWell: string[];
  whereWeGotLucky: string[];
  actionItems: PostmortemActionItem[];
  hindsightRecommendations: string[];
  createdAt: string;
  publishedAt?: string;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  category: "Alerting" | "Chat" | "Observability" | "Cloud" | "CI/CD";
  status: "connected" | "degraded" | "disconnected";
  lastSync: string;
  description: string;
  iconName: string;
}
