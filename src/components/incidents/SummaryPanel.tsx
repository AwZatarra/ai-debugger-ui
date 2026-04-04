type Props = {
  data: any;
  loading?: boolean;
  error?: any;
};

function normalizeSummaryData(data: any) {
  const base =
    data?.summary ??
    data?.result?.summary ??
    data?.result ??
    data ??
    null;

  if (!base) {
    return null;
  }

  return {
    incidentId: base.incident_id ?? "-",
    comparison: base.comparison ?? null,
    finalDecision: base.final_decision ?? null,
  };
}

export default function SummaryPanel({ data, loading, error }: Props) {
  const parsed = normalizeSummaryData(data);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">Summary final</h3>

      {loading && <p>Cargando summary...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!loading && !error && !parsed && (
        <p className="text-zinc-400">Aún no disponible.</p>
      )}

      {!loading && !error && parsed && (
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-zinc-400">Incident ID</p>
            <p className="break-all">{parsed.incidentId}</p>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <p className="mb-3 text-zinc-300 font-medium">Comparison</p>

            <div className="space-y-2">
              <p>
                <span className="text-zinc-400">Has heuristic:</span>{" "}
                {parsed.comparison?.has_heuristic === true
                  ? "Sí"
                  : parsed.comparison?.has_heuristic === false
                  ? "No"
                  : "-"}
              </p>

              <p>
                <span className="text-zinc-400">Has LLM:</span>{" "}
                {parsed.comparison?.has_llm === true
                  ? "Sí"
                  : parsed.comparison?.has_llm === false
                  ? "No"
                  : "-"}
              </p>

              <p>
                <span className="text-zinc-400">Agree on root cause:</span>{" "}
                {parsed.comparison?.agree_on_root_cause === true
                  ? "Sí"
                  : parsed.comparison?.agree_on_root_cause === false
                  ? "No"
                  : "-"}
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3">
            <p className="mb-3 text-zinc-300 font-medium">Final decision</p>

            <div className="space-y-3">
              <div>
                <p className="text-zinc-400">Final root cause</p>
                <p className="whitespace-pre-wrap">
                  {parsed.finalDecision?.final_root_cause ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-zinc-400">Final confidence</p>
                <p>{parsed.finalDecision?.final_confidence ?? "-"}</p>
              </div>

              <div>
                <p className="text-zinc-400">Final source</p>
                <p>{parsed.finalDecision?.final_source ?? "-"}</p>
              </div>

              <div>
                <p className="text-zinc-400">Final explanation</p>
                <p className="whitespace-pre-wrap">
                  {parsed.finalDecision?.final_explanation ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-zinc-400">Final suggested fix</p>
                <p className="whitespace-pre-wrap">
                  {parsed.finalDecision?.final_suggested_fix ?? "-"}
                </p>
              </div>

              <div>
                <p className="text-zinc-400">Final suggested patch</p>
                <pre className="overflow-auto rounded bg-zinc-900 p-3 text-xs whitespace-pre-wrap">
                  {parsed.finalDecision?.final_suggested_patch ?? "-"}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}