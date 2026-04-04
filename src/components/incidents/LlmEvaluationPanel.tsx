type Props = {
  data: any;
  loading?: boolean;
  error?: any;
};

function normalizeEvaluationData(data: any) {
  const base = data?.result ?? data ?? null;

  if (!base) {
    return null;
  }

  return {
    incidentId: base.incident_id ?? "-",
    ranking: base.ranking ?? null,
    feedback: base.feedback ?? null,
    evaluation: base.evaluation ?? null,
  };
}

function formatBoolean(value: unknown) {
  if (value === true) return "Sí";
  if (value === false) return "No";
  return "-";
}

export default function LlmEvaluationPanel({ data, loading, error }: Props) {
  const parsed = normalizeEvaluationData(data);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">LLM evaluation</h3>

      {loading && <p>Cargando evaluation...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!loading && !error && !parsed && (
        <p className="text-zinc-400">No hay evaluation disponible.</p>
      )}

      {!loading && !error && parsed && (
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-zinc-400">Incident ID</p>
            <p className="break-all">{parsed.incidentId}</p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <p className="mb-3 font-medium text-zinc-300">Ranking</p>

            <div className="space-y-2">
              <p>
                <span className="text-zinc-400">Analyzed at:</span>{" "}
                {parsed.ranking?.analyzed_at ?? "-"}
              </p>
              <p>
                <span className="text-zinc-400">LLM model:</span>{" "}
                {parsed.ranking?.llm_model ?? "-"}
              </p>
              <p>
                <span className="text-zinc-400">Top rank:</span>{" "}
                {parsed.ranking?.top_rank ?? "-"}
              </p>
              <p>
                <span className="text-zinc-400">Ranked causes count:</span>{" "}
                {parsed.ranking?.ranked_causes_count ?? "-"}
              </p>
              <div>
                <p className="text-zinc-400">Top cause</p>
                <p className="whitespace-pre-wrap">
                  {parsed.ranking?.top_cause ?? "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <p className="mb-3 font-medium text-zinc-300">Feedback</p>

            <div className="space-y-2">
              <p>
                <span className="text-zinc-400">Reviewed at:</span>{" "}
                {parsed.feedback?.reviewed_at ?? "-"}
              </p>
              <p>
                <span className="text-zinc-400">Reviewer:</span>{" "}
                {parsed.feedback?.reviewer ?? "-"}
              </p>
              <p>
                <span className="text-zinc-400">Verdict:</span>{" "}
                {parsed.feedback?.verdict ?? "-"}
              </p>
              <p>
                <span className="text-zinc-400">Selected rank:</span>{" "}
                {parsed.feedback?.selected_rank ?? "-"}
              </p>
              <div>
                <p className="text-zinc-400">Selected cause</p>
                <p className="whitespace-pre-wrap">
                  {parsed.feedback?.selected_cause ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Actual root cause</p>
                <p className="whitespace-pre-wrap">
                  {parsed.feedback?.actual_root_cause ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Actual fix</p>
                <p className="whitespace-pre-wrap">
                  {parsed.feedback?.actual_fix ?? "-"}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Notes</p>
                <p className="whitespace-pre-wrap">
                  {parsed.feedback?.notes ?? "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <p className="mb-3 font-medium text-zinc-300">Evaluation</p>

            <div className="space-y-2">
              <p>
                <span className="text-zinc-400">Has feedback:</span>{" "}
                {formatBoolean(parsed.evaluation?.has_feedback)}
              </p>
              <p>
                <span className="text-zinc-400">Top 1 match by rank:</span>{" "}
                {formatBoolean(parsed.evaluation?.top1_match_by_rank)}
              </p>
              <p>
                <span className="text-zinc-400">Top 1 match by cause:</span>{" "}
                {formatBoolean(parsed.evaluation?.top1_match_by_cause)}
              </p>
              <p>
                <span className="text-zinc-400">Top 1 match:</span>{" "}
                {formatBoolean(parsed.evaluation?.top1_match)}
              </p>
              <div>
                <p className="text-zinc-400">Summary</p>
                <p className="whitespace-pre-wrap">
                  {parsed.evaluation?.summary ?? "-"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}