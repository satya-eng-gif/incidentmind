import {
  Incident,
  TimelineEvent,
  MetricDataPoint,
  HindsightMemoryEntry,
  Postmortem,
  Service,
  IntegrationStatus,
} from "./types";

export const MOCK_SERVICES: Service[] = [
  {
    id: "auth-service",
    name: "auth-service",
    tier: "Tier-0",
    ownerTeam: "Identity & Access",
    health: "degraded",
    currentP99Ms: 480,
    errorRatePercent: 4.8,
  },
  {
    id: "payment-gateway",
    name: "payment-gateway",
    tier: "Tier-0",
    ownerTeam: "Payments Core",
    health: "degraded",
    currentP99Ms: 720,
    errorRatePercent: 2.1,
  },
  {
    id: "edge-proxy-us-east",
    name: "edge-proxy-us-east",
    tier: "Tier-0",
    ownerTeam: "Traffic & CDN",
    health: "healthy",
    currentP99Ms: 24,
    errorRatePercent: 0.01,
  },
  {
    id: "orders-db",
    name: "orders-db (Postgres RDS)",
    tier: "Tier-0",
    ownerTeam: "Data Platform",
    health: "degraded",
    currentP99Ms: 310,
    errorRatePercent: 3.2,
  },
  {
    id: "session-cache",
    name: "session-cache (Redis)",
    tier: "Tier-1",
    ownerTeam: "Core Platform",
    health: "healthy",
    currentP99Ms: 2.4,
    errorRatePercent: 0.0,
  },
  {
    id: "k8s-ingress-mesh",
    name: "k8s-ingress-mesh",
    tier: "Tier-0",
    ownerTeam: "Infrastructure SRE",
    health: "healthy",
    currentP99Ms: 18,
    errorRatePercent: 0.02,
  },
  {
    id: "events-stream",
    name: "events-stream (Kafka)",
    tier: "Tier-1",
    ownerTeam: "Data Infrastructure",
    health: "degraded",
    currentP99Ms: 140,
    errorRatePercent: 1.4,
  },
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: "INC-8491",
    title: "Postgres connection pool starvation under auth burst traffic",
    summary:
      "Client traffic spike caused HikariCP connection pool saturation in auth-service, escalating database connection wait times to >5000ms and cascading 504s into downstream APIs.",
    severity: "SEV-1",
    status: "investigating",
    commander: {
      name: "Alex Chen",
      avatar: "AC",
      role: "Staff SRE",
    },
    declaredAt: "2026-09-27T19:42:00Z",
    impactStartedAt: "2026-09-27T19:35:00Z",
    durationMinutes: 72,
    impactedServices: ["auth-service", "orders-db", "payment-gateway"],
    leadTeam: "Identity & Platform SRE",
    slackChannel: "#inc-8491-auth-db-pool-exhaustion",
    warRoomUrl: "https://meet.google.com/sre-inc-8491",
    tags: ["database", "connection-pool", "auth", "p99-spike"],
    blastRadius: "18% of user authentication requests failing with 504 Gateway Timeout",
    hindsightConfidence: 94,
    correlatedMemoryId: "MEM-902",
    rootCauseHypothesis:
      "HikariCP connection pool ceiling (max: 20) combined with long-running unindexed token lookup query under concurrent refresh traffic.",
    actionItemsCount: {
      total: 5,
      completed: 2,
    },
  },
  {
    id: "INC-8488",
    title: "Kafka consumer group rebalance storm delaying webhook delivery",
    summary:
      "Eager partition assignment protocol triggered infinite rebalancing loops following pod rolling restart in consumer cluster.",
    severity: "SEV-2",
    status: "identified",
    commander: {
      name: "Elena Rostova",
      avatar: "ER",
      role: "Senior Distributed Systems SRE",
    },
    declaredAt: "2026-09-27T18:15:00Z",
    impactStartedAt: "2026-09-27T18:04:00Z",
    durationMinutes: 158,
    impactedServices: ["events-stream", "payment-gateway"],
    leadTeam: "Data Platform",
    slackChannel: "#inc-8488-kafka-rebalance",
    tags: ["kafka", "queue-lag", "webhook-latency"],
    blastRadius: "Outbound payment confirmation webhooks delayed by 14 minutes",
    hindsightConfidence: 89,
    correlatedMemoryId: "MEM-884",
    rootCauseHypothesis:
      "CooperativeStickyAssignor was overridden during recent Helm chart update.",
    actionItemsCount: {
      total: 4,
      completed: 1,
    },
  },
  {
    id: "INC-8475",
    title: "Cascading BGP route flapping causing 40% packet drops at US-East edge",
    summary:
      "Transit provider Tier-1 link flapping triggered rapid convergence cycles on primary border routers, saturating secondary route table memory.",
    severity: "SEV-0",
    status: "mitigated",
    commander: {
      name: "Marcus Vance",
      avatar: "MV",
      role: "Principal Infrastructure Engineer",
    },
    declaredAt: "2026-09-26T21:10:00Z",
    impactStartedAt: "2026-09-26T21:02:00Z",
    resolvedAt: "2026-09-26T22:45:00Z",
    durationMinutes: 103,
    impactedServices: ["edge-proxy-us-east", "k8s-ingress-mesh"],
    leadTeam: "Networking & Edge SRE",
    slackChannel: "#inc-8475-bgp-flap-us-east",
    tags: ["networking", "bgp", "edge", "packet-loss"],
    blastRadius: "Global API entry points routing through us-east-1 experienced 42% SYN packet drops",
    hindsightConfidence: 78,
    rootCauseHypothesis:
      "Border gateway flap damping timer was set to aggressive decay threshold.",
    actionItemsCount: {
      total: 6,
      completed: 5,
    },
  },
  {
    id: "INC-8460",
    title: "Redis cluster OOM killer triggered on session cache node 04",
    summary:
      "Unbounded session key expiration backlog led to memory exhaustion, triggering Linux kernel OOM killer and uncoordinated failover.",
    severity: "SEV-2",
    status: "resolved",
    commander: {
      name: "Sarah Kim",
      avatar: "SK",
      role: "SRE Lead",
    },
    declaredAt: "2026-09-25T14:20:00Z",
    impactStartedAt: "2026-09-25T14:15:00Z",
    resolvedAt: "2026-09-25T15:35:00Z",
    durationMinutes: 80,
    impactedServices: ["session-cache", "auth-service"],
    leadTeam: "Core Platform",
    slackChannel: "#inc-8460-redis-oom",
    tags: ["redis", "oom", "memory-pressure"],
    blastRadius: "Users experienced sudden session logouts across EU mobile app tenants",
    hindsightConfidence: 92,
    correlatedMemoryId: "MEM-760",
    rootCauseHypothesis:
      "Active defragmentation disabled while volatile-lru policy failed due to non-expiring analytics keys.",
    actionItemsCount: {
      total: 3,
      completed: 3,
    },
  },
  {
    id: "INC-8432",
    title: "Kubernetes ingress controller CPU CFS quota throttling causing 504s",
    summary:
      "NGINX Ingress worker threads were starved by Linux CFS bandwidth quota limits during microbursts, resulting in request queueing and client connection timeouts.",
    severity: "SEV-1",
    status: "resolved",
    commander: {
      name: "Alex Chen",
      avatar: "AC",
      role: "Staff SRE",
    },
    declaredAt: "2026-09-22T08:30:00Z",
    impactStartedAt: "2026-09-22T08:24:00Z",
    resolvedAt: "2026-09-22T09:40:00Z",
    durationMinutes: 76,
    impactedServices: ["k8s-ingress-mesh"],
    leadTeam: "Infrastructure SRE",
    slackChannel: "#inc-8432-ingress-cfs-throttling",
    tags: ["kubernetes", "cfs-quota", "ingress-nginx"],
    blastRadius: "12% of inbound HTTP requests experienced latency >4000ms",
    hindsightConfidence: 96,
    correlatedMemoryId: "MEM-655",
    rootCauseHypothesis:
      "CFS quota period of 100ms was too coarse for bursty multi-threaded worker pools.",
    actionItemsCount: {
      total: 4,
      completed: 4,
    },
  },
];

export const MOCK_TIMELINE_EVENTS: Record<string, TimelineEvent[]> = {
  "INC-8491": [
    {
      id: "evt-1",
      timestamp: "19:35:12 UTC",
      type: "metric_spike",
      title: "Datadog Latency Anomaly Detected",
      description:
        "auth-service p99 latency breached SLA threshold (>250ms), sustained at 2,420ms for 3 consecutive evaluation windows.",
      meta: { metricValue: "2,420ms (Normal: 45ms)", service: "auth-service" },
    },
    {
      id: "evt-2",
      timestamp: "19:38:04 UTC",
      type: "alert",
      title: "PagerDuty Triggered: [CRIT] auth-service HTTP 504 surge",
      description:
        "High 5xx error rate alert fired. Escalation policy routed to Primary SRE On-Call (Alex Chen).",
      meta: { service: "auth-service" },
    },
    {
      id: "evt-3",
      timestamp: "19:42:00 UTC",
      type: "status_change",
      title: "SEV-1 Incident Declared by Alex Chen",
      description:
        "Incident Commander assumed role. War room #inc-8491-auth-db-pool-exhaustion generated in Slack with auto-provisioned Google Meet link.",
      author: { name: "Alex Chen", role: "Incident Commander" },
    },
    {
      id: "evt-4",
      timestamp: "19:45:30 UTC",
      type: "hindsight_pattern",
      title: "Hindsight Memory Match (94% Confidence)",
      description:
        "IncidentMind correlated telemetry with historical incident INC-7290 (Pattern MEM-902: HikariCP pool exhaustion). Recommended runbook: RB-DB-POOL-EMERGENCY-SCALE.",
      meta: { confidence: 94, service: "orders-db" },
    },
    {
      id: "evt-5",
      timestamp: "19:51:15 UTC",
      type: "deployment",
      title: "Correlated Deployment Detected: auth-service v3.18.2",
      description:
        "Commit 8f19da3 by @dave.w pushed 14 minutes prior to latency spike. Added new auth token introspection check without query caching.",
      meta: { commitHash: "8f19da3" },
    },
    {
      id: "evt-6",
      timestamp: "20:05:40 UTC",
      type: "mitigation",
      title: "Mitigation Applied: Scaled HikariCP pool and tuned PgBouncer",
      description:
        "Increased maxPoolSize from 20 to 60 per pod and enabled statement-level connection pooling in PgBouncer config map.",
      author: { name: "Alex Chen", role: "Incident Commander" },
    },
    {
      id: "evt-7",
      timestamp: "20:18:22 UTC",
      type: "note",
      title: "Traffic stabilization observed",
      description:
        "504 error rate dropped from 4.8% to 0.4%. P99 latency recovering back toward 80ms baseline. Continuing 30-minute burn-in observation window.",
      author: { name: "Elena Rostova", role: "Ops Lead" },
    },
  ],
};

export const MOCK_TELEMETRY_DATA: MetricDataPoint[] = [
  { timestamp: "19:20", p99LatencyMs: 42, errorRatePercent: 0.01, rps: 12400, cpuPercent: 32 },
  { timestamp: "19:25", p99LatencyMs: 45, errorRatePercent: 0.02, rps: 12800, cpuPercent: 34 },
  { timestamp: "19:30", p99LatencyMs: 58, errorRatePercent: 0.05, rps: 14200, cpuPercent: 38 },
  { timestamp: "19:35", p99LatencyMs: 380, errorRatePercent: 1.2, rps: 18500, cpuPercent: 54 },
  { timestamp: "19:40", p99LatencyMs: 2420, errorRatePercent: 4.8, rps: 19800, cpuPercent: 88 },
  { timestamp: "19:45", p99LatencyMs: 3100, errorRatePercent: 6.2, rps: 19100, cpuPercent: 94 },
  { timestamp: "19:50", p99LatencyMs: 3450, errorRatePercent: 7.1, rps: 18900, cpuPercent: 96 },
  { timestamp: "19:55", p99LatencyMs: 2980, errorRatePercent: 5.4, rps: 18200, cpuPercent: 91 },
  { timestamp: "20:00", p99LatencyMs: 2400, errorRatePercent: 4.3, rps: 17900, cpuPercent: 84 },
  { timestamp: "20:05", p99LatencyMs: 1200, errorRatePercent: 2.1, rps: 17500, cpuPercent: 72 },
  { timestamp: "20:10", p99LatencyMs: 340, errorRatePercent: 0.6, rps: 16800, cpuPercent: 56 },
  { timestamp: "20:15", p99LatencyMs: 120, errorRatePercent: 0.15, rps: 16200, cpuPercent: 46 },
  { timestamp: "20:20", p99LatencyMs: 65, errorRatePercent: 0.04, rps: 15900, cpuPercent: 41 },
];

export const MOCK_HINDSIGHT_MEMORIES: HindsightMemoryEntry[] = [
  {
    id: "MEM-902",
    patternName: "HikariCP pool starvation under burst auth queries",
    incidentId: "INC-7290",
    failureCategory: "Connection Pool Exhaustion",
    similarityScore: 94,
    occurredAt: "2026-04-12T11:20:00Z",
    services: ["auth-service", "orders-db"],
    rootCauseSummary:
      "Default maxPoolSize of 20 connections per pod was saturated when downstream latency increased by 30ms, causing worker thread queue starvation.",
    provenMitigation:
      "Scale maxPoolSize to 60 per pod, configure idleTimeout to 120s, and ensure connectionTimeout is set to 3000ms max to prevent indefinite caller hangs.",
    recurrenceCount: 4,
    runbookTitle: "RB-DB-POOL-EMERGENCY-SCALE",
    runbookSnippet:
      "kubectl set env deployment/auth-service HIKARI_MAX_POOL_SIZE=60 --namespace=production",
    tags: ["postgresql", "hikaricp", "connection-leak", "token-validation"],
  },
  {
    id: "MEM-884",
    patternName: "Kafka eager consumer rebalance cascade",
    incidentId: "INC-6812",
    failureCategory: "Kafka Consumer Group Lag",
    similarityScore: 89,
    occurredAt: "2026-02-18T16:45:00Z",
    services: ["events-stream", "payment-gateway"],
    rootCauseSummary:
      "Eager rebalance protocol revoked all partitions simultaneously across 24 consumers during a standard rolling update, creating 12-minute backlog accumulation.",
    provenMitigation:
      "Switch partition.assignment.strategy to org.apache.kafka.clients.consumer.CooperativeStickyAssignor and increase max.poll.interval.ms to 600000.",
    recurrenceCount: 2,
    runbookTitle: "RB-KAFKA-CONSUMER-REBALANCE-MITIGATION",
    runbookSnippet:
      "helm upgrade --reuse-values --set kafka.consumer.assignmentStrategy=CooperativeStickyAssignor payment-gateway-consumers ./charts",
    tags: ["kafka", "lag", "rebalance", "partition-assignment"],
  },
  {
    id: "MEM-760",
    patternName: "Redis memory fragmentation & OOM uncoordinated failover",
    incidentId: "INC-6110",
    failureCategory: "Memory Leak & GC Pause",
    similarityScore: 92,
    occurredAt: "2025-11-04T09:15:00Z",
    services: ["session-cache"],
    rootCauseSummary:
      "Memory fragmentation ratio exceeded 2.4 under high churn JSON session keys while activedefrag was disabled.",
    provenMitigation:
      "Execute CONFIG SET activedefrag yes, adjust active-defrag-threshold-lower to 10%, and configure maxmemory-policy to volatile-lfu.",
    recurrenceCount: 3,
    runbookTitle: "RB-REDIS-OOM-PREVENTION",
    runbookSnippet:
      "redis-cli -h $REDIS_PRIMARY -p 6379 CONFIG SET activedefrag yes",
    tags: ["redis", "memory-fragmentation", "activedefrag"],
  },
  {
    id: "MEM-655",
    patternName: "Linux CFS bandwidth quota throttling on multi-threaded proxy",
    incidentId: "INC-5490",
    failureCategory: "Cascading Network Timeout",
    similarityScore: 96,
    occurredAt: "2025-08-19T22:30:00Z",
    services: ["k8s-ingress-mesh"],
    rootCauseSummary:
      "CFS quota enforcement with default 100ms period throttled ingress pods after 30ms of multi-core usage, generating 4-second artificial latency delays.",
    provenMitigation:
      "Remove CPU limits on ingress daemonset while maintaining generous CPU requests, or enable CFS quota relaxation on node kubelet.",
    recurrenceCount: 5,
    runbookTitle: "RB-K8S-CFS-QUOTA-TUNING",
    runbookSnippet:
      "kubectl patch daemonset ingress-nginx -n ingress --patch-file patch-remove-limits.yaml",
    tags: ["kubernetes", "cfs-quota", "ingress-nginx", "throttling"],
  },
  {
    id: "MEM-541",
    patternName: "Postgres index bloat on high-update user session tables",
    incidentId: "INC-4820",
    failureCategory: "Database Index Degradation",
    similarityScore: 84,
    occurredAt: "2025-05-11T03:10:00Z",
    services: ["orders-db"],
    rootCauseSummary:
      "Autovacuum scale factor set too conservatively (0.2) on 80M row table prevented dead tuple cleanup during high volume transactions.",
    provenMitigation:
      "Run REINDEX TABLE CONCURRENTLY and lower autovacuum_vacuum_scale_factor to 0.05 on write-intensive tables.",
    recurrenceCount: 2,
    runbookTitle: "RB-PG-CONCURRENT-REINDEX",
    runbookSnippet:
      "psql -d production_db -c 'REINDEX TABLE CONCURRENTLY auth_tokens;'",
    tags: ["postgresql", "autovacuum", "index-bloat"],
  },
  {
    id: "MEM-490",
    patternName: "Envoy DNS resolution timeout under CoreDNS pod evictions",
    incidentId: "INC-4310",
    failureCategory: "Configuration Drift",
    similarityScore: 81,
    occurredAt: "2025-03-02T18:00:00Z",
    services: ["edge-proxy-us-east", "k8s-ingress-mesh"],
    rootCauseSummary:
      "Envoy STRICT_DNS clusters failed lookups when CoreDNS pods were rescheduled onto overloaded spot nodes without pod disruption budgets.",
    provenMitigation:
      "Switch Envoy cluster type to LOGICAL_DNS and enforce PodDisruptionBudget with minAvailable: 3 on CoreDNS.",
    recurrenceCount: 2,
    runbookTitle: "RB-DNS-ENVOY-RESILIENCE",
    runbookSnippet:
      "kubectl apply -f https://internal-runbooks/coredns-pdb.yaml",
    tags: ["coredns", "envoy", "dns-resolution"],
  },
];

export const MOCK_POSTMORTEMS: Postmortem[] = [
  {
    id: "PM-8475",
    incidentId: "INC-8475",
    title: "Postmortem: US-East Edge Proxy Packet Drop and BGP Route Flap",
    severity: "SEV-0",
    status: "published",
    owner: "Marcus Vance",
    team: "Networking & Edge SRE",
    durationMinutes: 103,
    impactStartTime: "2026-09-26T21:02:00Z",
    impactEndTime: "2026-09-26T22:45:00Z",
    financialImpactEstimate: "$48,500 (SLA credit penalty risk)",
    impactSummary:
      "During a 103-minute window, 42% of inbound HTTP requests through the us-east edge pop were dropped due to repetitive BGP routing table reconvergence. Approximately 340,000 requests received network timeout errors.",
    rootCauseAnalysis:
      "A primary transit ISP experienced optical fiber degradation resulting in link flapping (cycling every 45 seconds). Our border gateway routers did not have BGP Route Flap Damping (RFC 2439) enabled with sufficient dampening half-life, causing each route flap to trigger a complete BGP RIB recalculation. This saturated router CPU and delayed ARP table refreshes.",
    fiveWhys: [
      "Why did users experience 504 timeouts? Border gateway routers dropped incoming packets due to buffer exhaustion.",
      "Why were router buffers exhausted? Router CPU was pegged at 100% processing continuous BGP table recalculations.",
      "Why was BGP recalculating constantly? Upstream transit provider AS3356 was announcing and withdrawing prefixes every 45 seconds.",
      "Why did our routers not suppress the flapping peer? BGP Route Flap Damping parameters were set to default disabled state after a firmware upgrade 3 weeks ago.",
      "Why was the configuration drift not caught? Network compliance validation checks only audited route-map definitions, not dampening timers.",
    ],
    contributingFactors: [
      "External carrier fiber degradation in the Ashburn data center corridor.",
      "Lack of automated configuration drift detection for BGP dampening policies.",
      "Monitoring alert for BGP state changes was throttled by alert deduplication rules.",
    ],
    whatWentWell: [
      "Failover to EU-Central and US-West edge routers via Cloudflare Anycast traffic steering was executed cleanly within 18 minutes of incident declaration.",
      "No customer data corruption or payment state desynchronization occurred.",
      "Cross-team coordination across Edge SRE and Core Platform was rapid.",
    ],
    whereWeGotLucky: [
      "Off-peak traffic volume (Sunday evening) mitigated peak concurrency impact.",
      "The secondary transit provider (Cogent) had ample spare bandwidth to accept diverted traffic.",
    ],
    actionItems: [
      {
        id: "ACT-101",
        title: "Standardize BGP route flap damping template across all Arista border routers",
        assignee: "Marcus Vance",
        priority: "P0",
        status: "completed",
        dueDate: "2026-09-28",
      },
      {
        id: "ACT-102",
        title: "Implement automated Batfish configuration regression tests in network CI pipeline",
        assignee: "David Park",
        priority: "P1",
        status: "in_progress",
        dueDate: "2026-10-05",
      },
      {
        id: "ACT-103",
        title: "Add dedicated Prometheus exporter for BGP peer flap frequency and RIB churn rate",
        assignee: "Elena Rostova",
        priority: "P1",
        status: "completed",
        dueDate: "2026-09-29",
      },
      {
        id: "ACT-104",
        title: "Conduct simulated ISP transit cutover game-day exercise",
        assignee: "Marcus Vance",
        priority: "P2",
        status: "todo",
        dueDate: "2026-10-20",
      },
    ],
    hindsightRecommendations: [
      "Automate carrier isolation runbook via IncidentMind webhook trigger when peer flap frequency exceeds 3 events in 5 minutes.",
      "Establish active multi-path synthetic probe tests from external vantage points.",
    ],
    createdAt: "2026-09-26T23:30:00Z",
    publishedAt: "2026-09-27T10:15:00Z",
  },
  {
    id: "PM-8460",
    incidentId: "INC-8460",
    title: "Postmortem: Redis Session Cluster Out-Of-Memory Eviction Storm",
    severity: "SEV-2",
    status: "published",
    owner: "Sarah Kim",
    team: "Core Platform",
    durationMinutes: 80,
    impactStartTime: "2026-09-25T14:15:00Z",
    impactEndTime: "2026-09-25T15:35:00Z",
    financialImpactEstimate: "$9,200",
    impactSummary:
      "Node 04 of the Redis session cluster ran out of memory, triggering the Linux OOM killer. The replica failed to promote immediately due to quorum vote timeout, causing invalid session tokens for 42,000 active mobile app sessions.",
    rootCauseAnalysis:
      "A new feature in user-service stored analytics session snapshots without TTL tags under key prefix 'sess:audit:'. Because the cluster eviction policy was volatile-lru, keys without TTL were immune from eviction, consuming 94% of available RAM until OS memory allocation failed.",
    fiveWhys: [
      "Why did users get logged out? Session validation returned Redis connection refused errors.",
      "Why was Redis refusing connections? Redis process was killed by kernel OOM killer on node 04.",
      "Why did memory run out? Memory reached 32GB maximum without evicting older session keys.",
      "Why did eviction not reclaim memory? 22GB of memory was occupied by keys without an explicit TTL, and policy was set to volatile-lru.",
      "Why were keys created without TTL? Developer assumed all session keys inherited global 24h default TTL via Redis template, but custom audit writer bypassed the wrapper.",
    ],
    contributingFactors: [
      "Bypassed standard Redis key wrapper library in new microservice endpoint.",
      "No automated alert for percentage of keys with TTL vs non-TTL.",
    ],
    whatWentWell: [
      "Sentinel failover completed successfully once manual quorum vote was forced.",
      "Runbook RB-REDIS-OOM-PREVENTION provided immediate recovery commands.",
    ],
    whereWeGotLucky: [
      "Only EU region sessions were located on cluster node 04; US sessions remained unaffected.",
    ],
    actionItems: [
      {
        id: "ACT-201",
        title: "Enforce allkeys-lru eviction policy across all cache clusters",
        assignee: "Sarah Kim",
        priority: "P0",
        status: "completed",
        dueDate: "2026-09-25",
      },
      {
        id: "ACT-202",
        title: "Add static lint rule in CI to reject raw redis.set without EX argument",
        assignee: "Kenji Sato",
        priority: "P1",
        status: "completed",
        dueDate: "2026-09-26",
      },
      {
        id: "ACT-203",
        title: "Configure memory alert at 75% threshold (previously 90%)",
        assignee: "Sarah Kim",
        priority: "P1",
        status: "completed",
        dueDate: "2026-09-26",
      },
    ],
    hindsightRecommendations: [
      "Enable Redis active defragmentation (activedefrag yes) by default in Terraform baseline.",
    ],
    createdAt: "2026-09-25T16:00:00Z",
    publishedAt: "2026-09-26T11:00:00Z",
  },
  {
    id: "PM-8432",
    incidentId: "INC-8432",
    title: "Postmortem: Ingress Nginx CPU CFS Quota Throttling Latency Spike",
    severity: "SEV-1",
    status: "in_review",
    owner: "Alex Chen",
    team: "Infrastructure SRE",
    durationMinutes: 76,
    impactStartTime: "2026-09-22T08:24:00Z",
    impactEndTime: "2026-09-22T09:40:00Z",
    financialImpactEstimate: "$22,000",
    impactSummary:
      "All ingress traffic through Kubernetes cluster 01 experienced intermittent p99 latency spikes up to 4.2 seconds. Up to 12% of requests failed with HTTP 504.",
    rootCauseAnalysis:
      "Ingress nginx controller daemonset had rigid CPU limits (4000m) with 100ms CFS quota enforcement. Under bursts of TLS handshakes, multiple worker threads hit the quota in the first 25ms of each 100ms window, leaving the process frozen for the remaining 75ms.",
    fiveWhys: [
      "Why did API requests time out? Ingress controller held connections open without proxying.",
      "Why was the proxy frozen? Ingress worker threads were completely throttled by the Linux CFS scheduler.",
      "Why were threads throttled when total CPU was only 45%? CFS quota evaluates per-period (100ms); bursty thread parallelism exhausts quota prematurely.",
      "Why was CPU limit set on ingress daemonset? Standard cluster security policy mandated CPU limits on all pods.",
      "Why was exception policy not defined for multi-threaded proxy pods? Lack of SRE guidelines distinguishing CPU limits between single-threaded apps and high-concurrency proxies.",
    ],
    contributingFactors: [
      "CFS quota period mismatch with microburst traffic patterns.",
      "Blind application of Kubernetes CPU limit policies without profiling thread counts.",
    ],
    whatWentWell: [
      "IncidentMind identified historical pattern MEM-655 within 4 minutes.",
      "Emergency patch to remove limits stabilized traffic instantly.",
    ],
    whereWeGotLucky: [
      "Backend microservices were healthy and unaffected once ingress unblocked.",
    ],
    actionItems: [
      {
        id: "ACT-301",
        title: "Remove CPU limits from ingress controllers and CoreDNS across all k8s clusters",
        assignee: "Alex Chen",
        priority: "P0",
        status: "completed",
        dueDate: "2026-09-22",
      },
      {
        id: "ACT-302",
        title: "Draft engineering standard for CPU limits vs CPU requests in multi-threaded runtimes",
        assignee: "Alex Chen",
        priority: "P1",
        status: "in_progress",
        dueDate: "2026-10-01",
      },
    ],
    hindsightRecommendations: [
      "Deploy cfs_quota_throttled_seconds Prometheus alerts to catch silent kernel throttling.",
    ],
    createdAt: "2026-09-22T11:00:00Z",
  },
];

export const MOCK_INTEGRATIONS: IntegrationStatus[] = [
  {
    id: "datadog",
    name: "Datadog Observability",
    category: "Observability",
    status: "connected",
    lastSync: "30s ago",
    description: "Ingesting APM traces, metrics, and anomaly detection alerts.",
    iconName: "Activity",
  },
  {
    id: "slack",
    name: "Slack Enterprise Grid",
    category: "Chat",
    status: "connected",
    lastSync: "10s ago",
    description: "Automated war room channel creation and bot status updates.",
    iconName: "MessageSquare",
  },
  {
    id: "pagerduty",
    name: "PagerDuty On-Call",
    category: "Alerting",
    status: "connected",
    lastSync: "1m ago",
    description: "Bi-directional incident sync, escalation policies, and paging.",
    iconName: "BellRing",
  },
  {
    id: "prometheus",
    name: "Prometheus & Thanos",
    category: "Observability",
    status: "connected",
    lastSync: "15s ago",
    description: "Telemetry ingestion from Kubernetes clusters and edge gateways.",
    iconName: "Cpu",
  },
  {
    id: "github",
    name: "GitHub Deployments",
    category: "CI/CD",
    status: "connected",
    lastSync: "2m ago",
    description: "Correlating commit hashes, releases, and pull requests to incident timelines.",
    iconName: "GitPullRequest",
  },
  {
    id: "aws",
    name: "AWS CloudWatch & Health",
    category: "Cloud",
    status: "connected",
    lastSync: "4m ago",
    description: "Monitoring AWS RDS, ElastiCache, Route53, and infrastructure events.",
    iconName: "Cloud",
  },
];

export const MOCK_SRE_TEAM = {
  currentOnCall: {
    primary: {
      name: "Alex Chen",
      role: "Staff SRE",
      handle: "@alex.chen",
      timezone: "PST (UTC-7)",
      shiftEnd: "In 4h 18m",
      avatar: "AC",
    },
    secondary: {
      name: "Elena Rostova",
      role: "Senior Distributed Systems SRE",
      handle: "@elena.r",
      timezone: "CET (UTC+1)",
      shiftEnd: "In 12h 18m",
      avatar: "ER",
    },
  },
  systemHealthSummary: {
    overallStatus: "DEGRADED",
    activeIncidentsCount: 3,
    sev0Count: 0,
    sev1Count: 1,
    sev2Count: 2,
    mttaMins: 3.4, // Mean Time to Acknowledge
    mttrMins: 46.2, // Mean Time to Resolve
    weeklyAvailabilityPercent: 99.982,
    indexedMemoriesCount: 1420,
    runbooksLinkedCount: 342,
  },
};
