type Props = {
  data: any;
  loading?: boolean;
  error?: any;
};

export default function KnowledgeMatchesPanel({ data, loading, error }: Props) {
  const items = Array.isArray(data?.result?.matches)
    ? data.result.matches
    : Array.isArray(data?.matches)
    ? data.matches
    : Array.isArray(data)
    ? data
    : [];

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">Knowledge matches</h3>

      {loading && <p>Cargando knowledge...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-zinc-400">No hay knowledge matches.</p>
      )}

      <div className="space-y-3">
        {items.map((item: any, index: number) => (
          <div
            key={item.chunk_id ?? item.id ?? index}
            className="rounded-lg border border-zinc-800 p-3 text-sm"
          >
            <p>
              <span className="text-zinc-400">Source type:</span>{" "}
              {item.source_type ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Source name:</span>{" "}
              {item.source_name ?? item.title ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Service:</span>{" "}
              {item.service ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Route:</span>{" "}
              {item.route ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Error code:</span>{" "}
              {item.error_code ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Match score:</span>{" "}
              {item.match_score ?? item.score ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Reason:</span>{" "}
              {item.match_reason ?? "-"}
            </p>
            <p className="mt-2 whitespace-pre-wrap">
              {item.text ?? item.chunk ?? "-"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}