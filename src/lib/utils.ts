export function normalizeIncidents(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.incidents)) return data.incidents;
  if (Array.isArray(data?.result?.incidents)) return data.result.incidents;
  return [];
}

export function normalizeSimilar(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.similar_incidents)) return data.similar_incidents;
  if (Array.isArray(data?.result?.similar_incidents)) return data.result.similar_incidents;
  return [];
}

export function normalizeKnowledge(data: any): any[] {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.matches)) return data.matches;
  if (Array.isArray(data?.result?.matches)) return data.result.matches;
  return [];
}