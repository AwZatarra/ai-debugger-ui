"use client";

import { useState } from "react";
import { incidentApi } from "@/src/lib/api";

type AnalyzeResultPayload = {
  heuristicReport?: any;
  llmReport?: any;
  prProposal?: any;
};

type Props = {
  incidentId: string;
  onDone?: (payload?: AnalyzeResultPayload) => void | Promise<void>;
};

const DEFAULT_PR_PROPOSAL_REQUEST = {
  repository: "AwZatarra/ai-debugger",
  target_branch: "master",
  allowlisted_paths: [
    "services/service-b/src/",
    "incident-detector/src/",
  ],
};

export default function AnalyzeActions({ incidentId, onDone }: Props) {
  const [loadingHeuristic, setLoadingHeuristic] = useState(false);
  const [loadingLlm, setLoadingLlm] = useState(false);
  const [loadingPrProposal, setLoadingPrProposal] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const runHeuristic = async () => {
    try {
      setLoadingHeuristic(true);
      setMessage(null);

      const response = await incidentApi.analyzeHeuristic(incidentId);
      const heuristicReport = response?.result?.report ?? null;

      setMessage("Análisis heurístico ejecutado.");
      await onDone?.({ heuristicReport });
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

      const response = await incidentApi.analyzeLlm(incidentId);
      const llmReport = response?.result?.report ?? null;

      setMessage("Análisis LLM ejecutado.");
      await onDone?.({ llmReport });
    } catch (error: any) {
      setMessage(`Error LLM: ${error.message}`);
    } finally {
      setLoadingLlm(false);
    }
  };

  const runPrProposal = async () => {
    try {
      setLoadingPrProposal(true);
      setMessage(null);

      const response = await incidentApi.createPrProposal(
        incidentId,
        DEFAULT_PR_PROPOSAL_REQUEST
      );

      const prProposal = response?.result ?? null;

      setMessage("PR proposal generada correctamente.");
      await onDone?.({ prProposal });
    } catch (error: any) {
      setMessage(`Error generando PR proposal: ${error.message}`);
    } finally {
      setLoadingPrProposal(false);
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

        <button
          onClick={runPrProposal}
          disabled={loadingPrProposal}
          className="rounded bg-emerald-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {loadingPrProposal
            ? "Generando PR proposal..."
            : "Generate PR proposal"}
        </button>
      </div>

      {message && <p className="text-sm text-zinc-300">{message}</p>}
    </div>
  );
}