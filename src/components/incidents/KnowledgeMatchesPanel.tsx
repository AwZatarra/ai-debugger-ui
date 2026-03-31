type Props = {
  data: any;
  loading?: boolean;
  error?: any;
};

export default function KnowledgeMatchesPanel({ data, loading, error }: Props) {
  const items = Array.isArray(data?.matches)
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
          <div key={item.id ?? index} className="rounded-lg border border-zinc-800 p-3 text-sm">
            <p><span className="text-zinc-400">Title:</span> {item.title ?? "-"}</p>
            <p><span className="text-zinc-400">Score:</span> {item.score ?? "-"}</p>
            <p><span className="text-zinc-400">Source:</span> {item.source ?? "-"}</p>
            <p className="mt-2 whitespace-pre-wrap">{item.chunk ?? "-"}</p>
          </div>
        ))}
      </div>
    </section>
  );
}