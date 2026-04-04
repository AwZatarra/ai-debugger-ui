import { incidentApi } from "@/src/lib/api";

export default async function StatsPage() {
  let data: any = null;
  let error = "";

  try {
    data = await incidentApi.getLlmCauseRankingStats();
  } catch (err: any) {
    error = err.message ?? "Error cargando stats";
  }

  const stats = data?.result ?? null;
  const verdicts = stats?.verdict_counts ?? null;

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <h2 className="text-2xl font-semibold">LLM Cause Ranking Stats</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Métricas globales de rankings, feedback y precisión top 1.
        </p>
      </section>

      {error && (
        <section className="rounded-xl border border-red-900 bg-red-950/40 p-4">
          <p className="text-red-300">Error: {error}</p>
        </section>
      )}

      {!error && !stats && (
        <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
          <p className="text-zinc-400">No hay estadísticas disponibles.</p>
        </section>
      )}

      {!error && stats && (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <StatCard label="Total rankings" value={stats.total_rankings} />
            <StatCard label="Total feedback" value={stats.total_feedback} />
            <StatCard
              label="Incidents with rankings"
              value={stats.incidents_with_rankings}
            />
            <StatCard
              label="Incidents with feedback"
              value={stats.incidents_with_feedback}
            />
            <StatCard
              label="Evaluated rankings"
              value={stats.evaluated_rankings}
            />
            <StatCard label="Top 1 matches" value={stats.top1_matches} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="mb-3 text-lg font-semibold">Verdict counts</h3>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-zinc-400">Correct:</span>{" "}
                  {verdicts?.correct ?? 0}
                </p>
                <p>
                  <span className="text-zinc-400">Partially correct:</span>{" "}
                  {verdicts?.partially_correct ?? 0}
                </p>
                <p>
                  <span className="text-zinc-400">Incorrect:</span>{" "}
                  {verdicts?.incorrect ?? 0}
                </p>
              </div>
            </section>

            <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="mb-3 text-lg font-semibold">Accuracy</h3>

              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-zinc-400">Top 1 accuracy:</span>{" "}
                  {typeof stats.top1_accuracy === "number"
                    ? `${(stats.top1_accuracy * 100).toFixed(0)}%`
                    : "-"}
                </p>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number | string | null | undefined;
}) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value ?? "-"}</p>
    </section>
  );
}