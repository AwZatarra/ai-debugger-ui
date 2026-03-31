"use client";

import { useEffect, useState } from "react";
import { incidentApi } from "../../../lib/api";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default function IncidentDetailPage({ params }: PageProps) {
  const [incidentId, setIncidentId] = useState("");
  const [context, setContext] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [similar, setSimilar] = useState<any>(null);
  const [knowledge, setKnowledge] = useState<any>(null);
  const [error, setError] = useState("");
  const [loadingHeuristic, setLoadingHeuristic] = useState(false);
  const [loadingLlm, setLoadingLlm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    params.then((p) => setIncidentId(p.id));
  }, [params]);

  async function loadAll(id: string) {
    try {
      setError("");

      const [ctx, sum, sim, know] = await Promise.all([
        incidentApi.getContext(id),
        incidentApi.getAnalysisSummary(id),
        incidentApi.getSimilar(id),
        incidentApi.getKnowledge(id),
      ]);

      setContext(ctx);
      setSummary(sum);
      setSimilar(sim);
      setKnowledge(know);
    } catch (err: any) {
      setError(err.message || "Error cargando detalle");
    }
  }

  useEffect(() => {
    if (!incidentId) return;
    loadAll(incidentId);
  }, [incidentId]);

  async function runHeuristic() {
    try {
      setLoadingHeuristic(true);
      setMessage("");
      await incidentApi.analyzeHeuristic(incidentId);
      setMessage("Análisis heurístico ejecutado correctamente.");
      await loadAll(incidentId);
    } catch (err: any) {
      setMessage(`Error en análisis heurístico: ${err.message}`);
    } finally {
      setLoadingHeuristic(false);
    }
  }

  async function runLlm() {
    try {
      setLoadingLlm(true);
      setMessage("");
      await incidentApi.analyzeLlm(incidentId);
      setMessage("Análisis LLM ejecutado correctamente.");
      await loadAll(incidentId);
    } catch (err: any) {
      setMessage(`Error en análisis LLM: ${err.message}`);
    } finally {
      setLoadingLlm(false);
    }
  }

  if (!incidentId) {
    return <div style={{ padding: "20px" }}>Cargando incidente...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Incident Detail</h1>
      <p><strong>ID:</strong> {incidentId}</p>

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <h2>Acciones</h2>

        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          <button onClick={runHeuristic} disabled={loadingHeuristic}>
            {loadingHeuristic ? "Ejecutando heurístico..." : "Run heuristic RCA"}
          </button>

          <button onClick={runLlm} disabled={loadingLlm}>
            {loadingLlm ? "Ejecutando LLM..." : "Run LLM RCA"}
          </button>
        </div>

        {message && (
          <p style={{ marginTop: "10px" }}>
            {message}
          </p>
        )}
      </div>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <h2>Context</h2>
      <pre>{JSON.stringify(context, null, 2)}</pre>

      <h2>Summary</h2>
      <pre>{JSON.stringify(summary, null, 2)}</pre>

      <h2>Similar</h2>
      <pre>{JSON.stringify(similar, null, 2)}</pre>

      <h2>Knowledge</h2>
      <pre>{JSON.stringify(knowledge, null, 2)}</pre>
    </div>
  );
}