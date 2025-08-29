export type RunStepKey =
  | "initialize"
  | "seed_aliases"
  | "query_generation"
  | "source_discovery"
  | "compliance_scheduling"
  | "fetching_snapshotting"
  | "normalization"
  | "quality_scoring"
  | "deduplication"
  | "segmentation_embedding"
  | "targeted_retrieval"
  | "attribute_extraction"
  | "contradictions"
  | "questionnaire_fusion"
  | "fusion_confidence"
  | "persona_assembly"
  | "statistics_verification";

export type StepStatus = "idle" | "running" | "done" | "error";

export interface RunStep {
  key: RunStepKey;
  label: string;
  status: StepStatus;
  startedAt?: number;
  finishedAt?: number;
  logs: string[];
}

export type PersonaAttributeKey =
  | "role"
  | "expertise"
  | "mindset"
  | "personality"
  | "description";

export interface QuoteEvidence {
  attribute: PersonaAttributeKey;
  quote: string;
  url?: string;
  title?: string;
  date?: string;
  chunk_id?: string;
  weight?: number;
}

export interface PersonaCardData {
  role: string;
  expertise: string;
  mindset: string;
  personality: string;
  description: string;
  quotes: QuoteEvidence[];
  confidence: number; // 0-1
  confidenceBand: "H" | "M" | "L";
}

export interface FusionWeights {
  global: number; // 0-1
  perAttribute: Partial<Record<PersonaAttributeKey, number>>;
  strictMode: boolean;
}

export interface CoverageStats {
  discovered: number;
  fetched: number;
  kept: number;
  uniqueDomains: number;
  documents: number;
  chunks: number;
  tokens: number;
  languages: Record<string, number>;
}

export interface QualityRecencyStats {
  qualityMedian: number;
  firstPersonRatio: number;
  freshnessDaysMedian: number;
}

export interface AgreementConflictStats {
  agreementIndex: number; // 0-1
  conflicts: number;
}

export interface RunStats {
  coverage: CoverageStats;
  qualityRecency: QualityRecencyStats;
  evidenceStrength: {
    quotesPerAttribute: Record<PersonaAttributeKey, number>;
    uniqueSources: number;
    domainDiversity: number; // Herfindahl index proxy
  };
  agreementConflicts: AgreementConflictStats;
  confidence: number;
}

export interface AuditLogEntry {
  at: number;
  actor: "owner" | "reviewer";
  action: "approve" | "request_changes" | "comment";
  comment?: string;
}

export interface RunRecord {
  id: string;
  subject: string;
  aliases: string[];
  timeWindow: string;
  languages: string[];
  createdAt: number;
  steps: RunStep[];
  persona?: PersonaCardData;
  fusion: FusionWeights;
  stats?: RunStats;
  questionnaire?: Record<string, number>;
  auditLog: AuditLogEntry[];
  liveCrawlUsed: boolean;
}
