const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

console.log("API_BASE_URL =", API_BASE_URL);

if (!API_BASE_URL) {
  throw new Error("Falta NEXT_PUBLIC_API_BASE_URL en .env.local");
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GET ${path} failed: ${res.status} - ${text}`);
  }

  return res.json();
}

async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} failed: ${res.status} - ${text}`);
  }

  return res.json();
}

export const incidentApi = {
  getIncidents: () => apiGet<any>("/incidents"),
  getContext: (id: string) => apiGet<any>(`/incidents/${id}/context`),
  analyzeHeuristic: (id: string) => apiPost<any>(`/incidents/${id}/analyze`),
  analyzeLlm: (id: string) => apiPost<any>(`/incidents/${id}/analyze-llm`),
  getAnalysisSummary: (id: string) =>
    apiGet<any>(`/incidents/${id}/analysis-summary`),
  getSimilar: (id: string) => apiGet<any>(`/incidents/${id}/similar`),
  getKnowledge: (id: string) => apiGet<any>(`/incidents/${id}/knowledge`),

  getCauseRankingLlmHistory: (id: string) =>
    apiGet<any>(`/incidents/${id}/cause-ranking-llm/history`),

  getLlmCauseRankingFeedback: (id: string) =>
    apiGet<any>(`/incidents/${id}/llm-cause-ranking/feedback`),

  submitLlmCauseRankingFeedback: (id: string, body: unknown) =>
    apiPost<any>(`/incidents/${id}/llm-cause-ranking/feedback`, body),

  getLlmCauseRankingEvaluation: (id: string) =>
    apiGet<any>(`/incidents/${id}/llm-cause-ranking/evaluation`),

  getLlmCauseRankingStats: () =>
    apiGet<any>("/llm-cause-ranking/stats"),

  createPrProposal: (
    id: string,
    body: {
      repository: string;
      target_branch: string;
      allowlisted_paths: string[];
    }
  ) => apiPost<any>(`/incidents/${id}/pr-proposal`, body),

  getLatestPrProposal: (id: string) =>
    apiGet<any>(`/incidents/${id}/pr-proposal`),

  getPrProposalHistory: (id: string) =>
    apiGet<any>(`/incidents/${id}/pr-proposal/history`),

  approvePrProposal: (
    proposalId: string,
    body: { reviewer: string; notes: string }
  ) => apiPost<any>(`/pr-proposals/${proposalId}/approve`, body),

  rejectPrProposal: (
    proposalId: string,
    body: { reviewer: string; notes: string }
  ) => apiPost<any>(`/pr-proposals/${proposalId}/reject`, body),

  preparePrProposalExecution: (proposalId: string) =>
    apiPost<any>(`/pr-proposals/${proposalId}/prepare-execution`),

  generatePrProposalFileEdits: (proposalId: string) =>
    apiPost<any>(`/pr-proposals/${proposalId}/generate-file-edits`),

  regeneratePrProposalFileEdits: (proposalId: string) =>
    apiPost<any>(`/pr-proposals/${proposalId}/regenerate-file-edits`),

  validatePrProposalFileEdits: (proposalId: string) =>
    apiPost<any>(`/pr-proposals/${proposalId}/validate-file-edits`),

  runPrProposalLocalChecks: (proposalId: string) =>
    apiPost<any>(`/pr-proposals/${proposalId}/run-local-checks`),

  createGithubPrFromProposal: (proposalId: string) =>
    apiPost<any>(`/pr-proposals/${proposalId}/create-github-pr`),

  getIncidentPrActions: (incidentId: string) =>
    apiGet<any>(`/incidents/${incidentId}/pr-actions`),

  getPrProposalActions: (proposalId: string) =>
    apiGet<any>(`/pr-proposals/${proposalId}/actions`),
};