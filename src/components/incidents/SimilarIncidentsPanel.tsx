type Props = {
  data: any;
  loading?: boolean;
  error?: any;
};

export default function SimilarIncidentsPanel({ data, loading, error }: Props) {
  const items = Array.isArray(data?.result?.similar_incidents)
    ? data.result.similar_incidents
    : Array.isArray(data?.similar_incidents)
    ? data.similar_incidents
    : Array.isArray(data)
    ? data
    : [];

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">Similar incidents</h3>

      {loading && <p>Cargando similares...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!loading && !error && items.length === 0 && (
        <p className="text-zinc-400">No hay incidentes similares.</p>
      )}

      <div className="space-y-3">
        {items.map((item: any, index: number) => (
          <div
            key={item.incident_id ?? index}
            className="rounded-lg border border-zinc-800 p-3 text-sm"
          >
            <p>
              <span className="text-zinc-400">ID:</span>{" "}
              {item.incident_id ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Title:</span>{" "}
              {item.title ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Service:</span>{" "}
              {item.primary_service ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Severity:</span>{" "}
              {item.severity ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Similarity score:</span>{" "}
              {item.similarity_score ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Reason:</span>{" "}
              {item.similarity_reason ?? "-"}
            </p>
            <p>
              <span className="text-zinc-400">Created at:</span>{" "}
              {item.created_at ?? "-"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}