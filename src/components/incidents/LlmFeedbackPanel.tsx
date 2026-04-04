type Props = {
  data: any;
  loading?: boolean;
  error?: any;
};

export default function LlmFeedbackPanel({ data, loading, error }: Props) {
  const feedbackItems = Array.isArray(data?.feedback)
    ? data.feedback
    : Array.isArray(data?.result?.feedback)
    ? data.result.feedback
    : Array.isArray(data)
    ? data
    : [];

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">LLM feedback</h3>

      {loading && <p>Cargando feedback...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!loading && !error && feedbackItems.length === 0 && (
        <p className="text-zinc-400">No hay feedback registrado.</p>
      )}

      <div className="space-y-4">
        {feedbackItems.map((item: any, index: number) => (
          <article
            key={item.feedback_id ?? index}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-4"
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-zinc-400">Feedback ID:</span>{" "}
                  <span className="break-all">{item.feedback_id ?? "-"}</span>
                </p>

                <p>
                  <span className="text-zinc-400">Reviewer:</span>{" "}
                  {item.reviewer ?? "-"}
                </p>

                <p>
                  <span className="text-zinc-400">Verdict:</span>{" "}
                  {item.verdict ?? "-"}
                </p>

                <p>
                  <span className="text-zinc-400">Selected rank:</span>{" "}
                  {item.selected_rank ?? "-"}
                </p>

                <p>
                  <span className="text-zinc-400">Reviewed at:</span>{" "}
                  {item.reviewed_at ?? "-"}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-zinc-400">Selected cause</p>
                  <p className="whitespace-pre-wrap">
                    {item.selected_cause ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-400">Actual root cause</p>
                  <p className="whitespace-pre-wrap">
                    {item.actual_root_cause ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-400">Actual fix</p>
                  <p className="whitespace-pre-wrap">
                    {item.actual_fix ?? "-"}
                  </p>
                </div>

                <div>
                  <p className="text-zinc-400">Notes</p>
                  <p className="whitespace-pre-wrap">{item.notes ?? "-"}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}