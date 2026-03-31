type Props = {
  data: any;
  loading?: boolean;
  error?: any;
};

export default function ContextPanel({ data, loading, error }: Props) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">Contexto</h3>

      {loading && <p>Cargando contexto...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!loading && !error && (
        <pre className="overflow-auto rounded bg-zinc-950 p-3 text-xs">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </section>
  );
}