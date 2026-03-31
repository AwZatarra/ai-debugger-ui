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
  getAnalysisSummary: (id: string) => apiGet<any>(`/incidents/${id}/analysis-summary`),
  getSimilar: (id: string) => apiGet<any>(`/incidents/${id}/similar`),
  getKnowledge: (id: string) => apiGet<any>(`/incidents/${id}/knowledge`),
};