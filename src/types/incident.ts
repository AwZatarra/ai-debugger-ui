export type Incident = {
  incident_id: string;
  title?: string;
  service?: string;
  endpoint?: string;
  error_code?: string;
  severity?: string;
  status?: string;
  first_seen_at?: string;
  last_seen_at?: string;
};

export type IncidentContext = {
  incident_id: string;
  trace?: unknown;
  logs?: unknown[];
  metrics?: unknown;
  enriched_context?: unknown;
};

export type HeuristicRca = {
  probable_root_cause?: string;
  confidence?: number;
  explanation?: string;
  evidence?: string[];
};

export type LlmRca = {
  probable_root_cause?: string;
  confidence?: number;
  explanation?: string;
  recommendations?: string[];
};

export type AnalysisSummary = {
  incident_id: string;
  final_summary?: string;
  heuristic_rca?: HeuristicRca;
  llm_rca?: LlmRca;
};

export type SimilarIncident = {
  incident_id: string;
  score?: number;
  probable_root_cause?: string;
  summary?: string;
  analyzed_at?: string;
};

export type KnowledgeMatch = {
  id?: string;
  title?: string;
  score?: number;
  chunk?: string;
  source?: string;
};