"use client";

import { useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import AnalyzeActions from "@/src/components/incidents/AnalyzeActions";
import ContextPanel from "@/src/components/incidents/ContextPanel";
import SummaryPanel from "@/src/components/incidents/SummaryPanel";
import SimilarIncidentsPanel from "@/src/components/incidents/SimilarIncidentsPanel";
import KnowledgeMatchesPanel from "@/src/components/incidents/KnowledgeMatchesPanel";
import HeuristicRcaPanel from "@/src/components/incidents/HeuristicRcaPanel";
import LlmRcaPanel from "@/src/components/incidents/LlmRcaPanel";
import LlmRankingHistoryPanel from "@/src/components/incidents/LlmRankingHistoryPanel";
import LlmFeedbackPanel from "@/src/components/incidents/LlmFeedbackPanel";
import LlmFeedbackForm from "@/src/components/incidents/LlmFeedbackForm";
import LlmEvaluationPanel from "@/src/components/incidents/LlmEvaluationPanel";
import PrProposalPanel from "@/src/components/incidents/PrProposalPanel";
import PrProposalHistoryPanel from "@/src/components/incidents/PrProposalHistoryPanel";
import PrActionsPanel from "@/src/components/incidents/PrActionsPanel";
import { incidentApi } from "@/src/lib/api";

type Props = {
  incidentId: string;
};

type AnalyzeResultPayload = {
  heuristicReport?: any;
  llmReport?: any;
  prProposal?: any;
};

function getLatestProposalId(data: any): string | null {
  return (
    data?.result?.proposal_id ??
    data?.result?.proposal?.proposal_id ??
    data?.proposal_id ??
    data?.proposal?.proposal_id ??
    null
  );
}

export default function IncidentDetailClient({ incidentId }: Props) {
  const [latestHeuristicReport, setLatestHeuristicReport] = useState<any>(null);
  const [latestLlmReport, setLatestLlmReport] = useState<any>(null);

  const contextQuery = useSWR(
    ["incident-context", incidentId],
    () => incidentApi.getContext(incidentId)
  );

  const summaryQuery = useSWR(
    ["incident-analysis-summary", incidentId],
    () => incidentApi.getAnalysisSummary(incidentId)
  );

  const similarQuery = useSWR(
    ["incident-similar", incidentId],
    () => incidentApi.getSimilar(incidentId)
  );

  const knowledgeQuery = useSWR(
    ["incident-knowledge", incidentId],
    () => incidentApi.getKnowledge(incidentId)
  );

  const llmHistoryQuery = useSWR(
    ["incident-llm-ranking-history", incidentId],
    () => incidentApi.getCauseRankingLlmHistory(incidentId)
  );

  const llmFeedbackQuery = useSWR(
    ["incident-llm-feedback", incidentId],
    () => incidentApi.getLlmCauseRankingFeedback(incidentId)
  );

  const llmEvaluationQuery = useSWR(
    ["incident-llm-evaluation", incidentId],
    () => incidentApi.getLlmCauseRankingEvaluation(incidentId)
  );

  const prProposalQuery = useSWR(
    ["incident-pr-proposal", incidentId],
    () => incidentApi.getLatestPrProposal(incidentId)
  );

  const prProposalHistoryQuery = useSWR(
    ["incident-pr-proposal-history", incidentId],
    () => incidentApi.getPrProposalHistory(incidentId)
  );

  const incidentPrActionsQuery = useSWR(
    ["incident-pr-actions", incidentId],
    () => incidentApi.getIncidentPrActions(incidentId)
  );

  const latestProposalId = getLatestProposalId(prProposalQuery.data);

  const proposalPrActionsQuery = useSWR(
    latestProposalId ? ["proposal-pr-actions", latestProposalId] : null,
    () => incidentApi.getPrProposalActions(latestProposalId as string)
  );

  const refreshAll = async (payload?: AnalyzeResultPayload) => {
    if (payload?.heuristicReport) {
      setLatestHeuristicReport(payload.heuristicReport);
    }

    if (payload?.llmReport) {
      setLatestLlmReport(payload.llmReport);
    }

    await Promise.all([
      contextQuery.mutate(),
      summaryQuery.mutate(),
      similarQuery.mutate(),
      knowledgeQuery.mutate(),
      llmHistoryQuery.mutate(),
      llmFeedbackQuery.mutate(),
      llmEvaluationQuery.mutate(),
      prProposalQuery.mutate(),
      prProposalHistoryQuery.mutate(),
      incidentPrActionsQuery.mutate(),
      proposalPrActionsQuery.mutate(),
    ]);
  };

  const isInitialLoading =
    contextQuery.isLoading &&
    summaryQuery.isLoading &&
    similarQuery.isLoading &&
    knowledgeQuery.isLoading &&
    llmHistoryQuery.isLoading &&
    llmFeedbackQuery.isLoading &&
    llmEvaluationQuery.isLoading &&
    prProposalQuery.isLoading &&
    prProposalHistoryQuery.isLoading &&
    incidentPrActionsQuery.isLoading;

  const summaryData =
    summaryQuery.data?.summary ??
    summaryQuery.data?.result?.summary ??
    summaryQuery.data?.result ??
    summaryQuery.data ??
    null;

  const heuristicDataFromSummary =
    summaryData?.heuristic_report ??
    summaryData?.heuristic_rca ??
    summaryData?.heuristic ??
    null;

  const llmDataFromSummary =
    summaryData?.llm_report ??
    summaryData?.llm_rca ??
    summaryData?.llm ??
    null;

  const heuristicData = latestHeuristicReport ?? heuristicDataFromSummary;
  const llmData = latestLlmReport ?? llmDataFromSummary;
  const prProposalData = prProposalQuery.data;

  const hasAnyError =
    contextQuery.error ||
    summaryQuery.error ||
    similarQuery.error ||
    knowledgeQuery.error ||
    llmHistoryQuery.error ||
    llmFeedbackQuery.error ||
    llmEvaluationQuery.error ||
    prProposalQuery.error ||
    prProposalHistoryQuery.error ||
    incidentPrActionsQuery.error ||
    proposalPrActionsQuery.error;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-slate-950/72 p-6 shadow-2xl shadow-slate-950/25">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
              Incident workspace
            </p>
            <h1 className="mt-2 text-3xl font-black text-white">
              Detalle del incidente
            </h1>
            <p className="mt-3 break-all rounded-lg border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-slate-300">
              <span className="font-semibold text-slate-100">ID:</span> {incidentId}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Consolida contexto, resumen, RCA heuristico, ranking LLM,
              feedback humano y propuesta de PR en una sola vista.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => refreshAll()}
              className="rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/25 hover:bg-cyan-200"
            >
              Refrescar detalle
            </button>

            <Link
              href="/incidents"
              className="rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:border-cyan-300/40 hover:bg-white/10"
            >
              Volver a incidentes
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          <SignalCard label="Contexto" active={!contextQuery.error} />
          <SignalCard label="Summary" active={!summaryQuery.error} />
          <SignalCard label="LLM ranking" active={!llmHistoryQuery.error} />
          <SignalCard label="PR proposal" active={!prProposalQuery.error} />
        </div>
      </section>

      <AnalyzeActions incidentId={incidentId} onDone={refreshAll} />

      {isInitialLoading && (
        <section className="rounded-lg border border-white/10 bg-slate-950/72 p-5">
          <p className="text-slate-300">Cargando detalle del incidente...</p>
        </section>
      )}

      {hasAnyError && (
        <section className="rounded-lg border border-red-300/25 bg-red-950/40 p-5">
          <div className="space-y-1 text-sm text-red-300">
            <p>Error cargando parte del detalle del incidente.</p>
            {contextQuery.error && <p>Contexto: {contextQuery.error.message}</p>}
            {summaryQuery.error && <p>Summary: {summaryQuery.error.message}</p>}
            {similarQuery.error && <p>Similares: {similarQuery.error.message}</p>}
            {knowledgeQuery.error && <p>Knowledge: {knowledgeQuery.error.message}</p>}
            {llmHistoryQuery.error && <p>LLM History: {llmHistoryQuery.error.message}</p>}
            {llmFeedbackQuery.error && <p>LLM Feedback: {llmFeedbackQuery.error.message}</p>}
            {llmEvaluationQuery.error && <p>LLM Evaluation: {llmEvaluationQuery.error.message}</p>}
            {prProposalQuery.error && <p>PR Proposal: {prProposalQuery.error.message}</p>}
            {prProposalHistoryQuery.error && (
              <p>PR Proposal History: {prProposalHistoryQuery.error.message}</p>
            )}
            {incidentPrActionsQuery.error && (
              <p>PR Actions: {incidentPrActionsQuery.error.message}</p>
            )}
            {proposalPrActionsQuery.error && (
              <p>Proposal Actions: {proposalPrActionsQuery.error.message}</p>
            )}
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <ContextPanel
          data={contextQuery.data}
          loading={contextQuery.isLoading}
          error={contextQuery.error}
        />

        <SummaryPanel
          data={summaryData}
          loading={summaryQuery.isLoading}
          error={summaryQuery.error}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <HeuristicRcaPanel data={heuristicData} />
        <LlmRcaPanel data={llmData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PrProposalPanel
          data={prProposalData}
          loading={prProposalQuery.isLoading}
          error={prProposalQuery.error}
          onReviewed={() => refreshAll()}
          onExecutionActionDone={() => refreshAll()}
          proposalActionsData={proposalPrActionsQuery.data}
        />

        <PrProposalHistoryPanel
          data={prProposalHistoryQuery.data}
          loading={prProposalHistoryQuery.isLoading}
          error={prProposalHistoryQuery.error}
        />
      </div>

      <PrActionsPanel
        data={incidentPrActionsQuery.data}
        loading={incidentPrActionsQuery.isLoading}
        error={incidentPrActionsQuery.error}
      />

      <LlmRankingHistoryPanel
        data={llmHistoryQuery.data}
        loading={llmHistoryQuery.isLoading}
        error={llmHistoryQuery.error}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <LlmFeedbackForm
          incidentId={incidentId}
          onSubmitted={() => refreshAll()}
        />

        <LlmFeedbackPanel
          data={llmFeedbackQuery.data}
          loading={llmFeedbackQuery.isLoading}
          error={llmFeedbackQuery.error}
        />
      </div>

      <LlmEvaluationPanel
        data={llmEvaluationQuery.data}
        loading={llmEvaluationQuery.isLoading}
        error={llmEvaluationQuery.error}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <SimilarIncidentsPanel
          data={similarQuery.data}
          loading={similarQuery.isLoading}
          error={similarQuery.error}
        />

        <KnowledgeMatchesPanel
          data={knowledgeQuery.data}
          loading={knowledgeQuery.isLoading}
          error={knowledgeQuery.error}
        />
      </div>
    </div>
  );
}

function SignalCard({ label, active }: { label: string; active: boolean }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p
        className={`mt-2 text-sm font-bold ${
          active ? "text-emerald-200" : "text-red-200"
        }`}
      >
        {active ? "Disponible" : "Revisar"}
      </p>
    </div>
  );
}
