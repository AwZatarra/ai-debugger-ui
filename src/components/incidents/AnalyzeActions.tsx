"use client";

import { useState } from "react";
import { incidentApi } from "@/lib/api";

type Props = {
  incidentId: string;
  onDone?: () => void | Promise<void>;
};

export default function AnalyzeActions({ incidentId, onDone }: Props) {
  const [loadingHeuristic, setLoadingHeuristic] = useState(false);
  const [loadingLlm, setLoadingLlm] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const runHeuristic = async () => {
    try {
      setLoadingHeuristic(true);
      setMessage(null);
      await incidentApi.analyzeHeuristic(incidentId);
      setMessage("Análisis heurístico ejecutado.");
      await onDone?.();
    } catch (error: any) {
      setMessage(`Error heurístico: ${error.message}`);
    } finally {
      setLoadingHeuristic(false);
    }
  };

  const runLlm = async () => {
    try {
      setLoadingLlm(true);
      setMessage(null);
      await incidentApi.analyzeLlm(incidentId);
      setMessage("Análisis LLM ejecutado.");
      await onDone?.();
    } catch (error: any) {
      setMessage(`Error LLM: ${error.message}`);
    } finally {
      setLoadingLlm(false);
    }
  };

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
      <h3 className="text-lg font-semibold">Acciones</h3>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={runHeuristic}
          disabled={loadingHeuristic}
          className="rounded bg-white px-4 py-2 text-black disabled:opacity-50"
        >
          {loadingHeuristic ? "Ejecutando heurístico..." : "Run heuristic RCA"}
        </button>

        <button
          onClick={runLlm}
          disabled={loadingLlm}
          className="rounded bg-zinc-700 px-4 py-2 disabled:opacity-50"
        >
          {loadingLlm ? "Ejecutando LLM..." : "Run LLM RCA"}
        </button>
      </div>

      {message && <p className="text-sm text-zinc-300">{message}</p>}
    </div>
  );
}