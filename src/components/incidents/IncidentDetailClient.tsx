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
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Incident Detail</h2>
            <p className="mt-2 text-sm text-zinc-400">
              <span className="font-medium text-zinc-200">ID:</span> {incidentId}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => refreshAll()}
              className="rounded bg-white px-4 py-2 text-sm font-medium text-black"
            >
              Refrescar detalle
            </button>

            <Link
              href="/incidents"
              className="rounded border border-zinc-700 bg-zinc-950 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
            >
              Volver a incidentes
            </Link>
          </div>
        </div>
      </section>

      <AnalyzeActions incidentId={incidentId} onDone={refreshAll} />

      {isInitialLoading && (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-zinc-300">Cargando detalle del incidente...</p>
        </section>
      )}

      {hasAnyError && (
        <section className="rounded-xl border border-red-900 bg-red-950/40 p-4">
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