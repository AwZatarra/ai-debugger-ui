type Props = {
  data: any;
  loading?: boolean;
  error?: any;
};

export default function SummaryPanel({ data, loading, error }: Props) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">Summary final</h3>

      {loading && <p>Cargando summary...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!loading && !error && (
        <div className="space-y-3 text-sm">
          <p>{data?.final_summary ?? data?.summary ?? "Aún no disponible."}</p>
        </div>
      )}
    </section>
  );
}