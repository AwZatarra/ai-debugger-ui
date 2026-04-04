type Props = {
  data: any;
  loading?: boolean;
  error?: any;
};

export default function PrProposalHistoryPanel({
  data,
  loading,
  error,
}: Props) {
  const history = Array.isArray(data?.history)
    ? data.history
    : Array.isArray(data?.result?.history)
    ? data.result.history
    : Array.isArray(data)
    ? data
    : [];

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">PR Proposal History</h3>

      {loading && <p>Cargando PR proposal history...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!loading && !error && history.length === 0 && (
        <p className="text-zinc-400">No hay historial de PR proposals.</p>
      )}

      <div className="space-y-3">
        {history.map((item: any, index: number) => (
          <article
            key={item.proposal_id ?? index}
            className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm"
          >
            <p>
              <span className="text-zinc-400">Proposal ID:</span>{" "}
              <span className="break-all">{item.proposal_id ?? "-"}</span>
            </p>
            <p>
              <span className="text-zinc-400">Title:</span> {item.title ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Status:</span> {item.status ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Created at:</span>{" "}
              {item.created_at ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Risk level:</span>{" "}
              {item.risk_level ?? "-"}
            </p>

            {item.reviewer && (
              <p>
                <span className="text-zinc-400">Reviewer:</span> {item.reviewer}
              </p>
            )}

            {item.reviewed_at && (
              <p>
                <span className="text-zinc-400">Reviewed at:</span>{" "}
                {item.reviewed_at}
              </p>
            )}

            {item.review_notes && (
              <p className="whitespace-pre-wrap">
                <span className="text-zinc-400">Review notes:</span>{" "}
                {item.review_notes}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}