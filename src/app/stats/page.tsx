import { incidentApi } from "@/src/lib/api";

type RankingStats = {
  total_rankings?: number;
  total_feedback?: number;
  incidents_with_rankings?: number;
  incidents_with_feedback?: number;
  evaluated_rankings?: number;
  top1_matches?: number;
  top1_accuracy?: number;
  verdict_counts?: {
    correct?: number;
    partially_correct?: number;
    incorrect?: number;
  };
};

export default async function StatsPage() {
  let data: { result?: RankingStats } | null = null;
  let error = "";

  try {
    data = await incidentApi.getLlmCauseRankingStats();
  } catch (err: unknown) {
    error = err instanceof Error ? err.message : "Error cargando stats";
  }

  const stats = data?.result ?? null;
  const verdicts = stats?.verdict_counts ?? null;
  const accuracy =
    typeof stats?.top1_accuracy === "number"
      ? Math.round(stats.top1_accuracy * 100)
      : null;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-white/10 bg-slate-950/72 p-6 shadow-2xl shadow-slate-950/25">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
              Model quality
            </p>
            <h1 className="mt-2 text-3xl font-black text-white">
              LLM Cause Ranking Stats
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Metricas globales para evaluar si los rankings de causa raiz
              realmente ayudan a llegar al fix correcto.
            </p>
          </div>

          {accuracy !== null && (
            <div className="rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-5 py-4 text-right">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-200">
                Top 1 accuracy
              </p>
              <p className="mt-1 text-4xl font-black text-white">{accuracy}%</p>
            </div>
          )}
        </div>
      </section>

      {error && (
        <section className="rounded-lg border border-red-300/25 bg-red-950/40 p-5">
          <p className="text-red-200">Error: {error}</p>
        </section>
      )}

      {!error && !stats && (
        <section className="rounded-lg border border-white/10 bg-slate-950/72 p-5">
          <p className="text-slate-400">No hay estadisticas disponibles.</p>
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
            <section className="rounded-lg border border-white/10 bg-slate-950/72 p-5">
              <h2 className="text-lg font-bold text-white">Verdict counts</h2>
              <div className="mt-5 space-y-4">
                <VerdictBar
                  label="Correct"
                  value={verdicts?.correct ?? 0}
                  total={stats.total_feedback}
                  tone="bg-emerald-300"
                />
                <VerdictBar
                  label="Partially correct"
                  value={verdicts?.partially_correct ?? 0}
                  total={stats.total_feedback}
                  tone="bg-cyan-300"
                />
                <VerdictBar
                  label="Incorrect"
                  value={verdicts?.incorrect ?? 0}
                  total={stats.total_feedback}
                  tone="bg-red-300"
                />
              </div>
            </section>

            <section className="rounded-lg border border-white/10 bg-slate-950/72 p-5">
              <h2 className="text-lg font-bold text-white">Accuracy signal</h2>
              <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="text-sm text-slate-400">Top 1 accuracy</p>
                <p className="mt-2 text-5xl font-black text-white">
                  {accuracy !== null ? `${accuracy}%` : "-"}
                </p>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-300"
                    style={{ width: `${accuracy ?? 0}%` }}
                  />
                </div>
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
    <section className="rounded-lg border border-white/10 bg-slate-950/72 p-5 shadow-xl shadow-slate-950/15">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-3 text-4xl font-black text-white">{value ?? "-"}</p>
    </section>
  );
}

function VerdictBar({
  label,
  value,
  total,
  tone,
}: {
  label: string;
  value: number;
  total: number | null | undefined;
  tone: string;
}) {
  const percent = total ? Math.round((value / total) * 100) : 0;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-300">{label}</span>
        <span className="text-slate-400">
          {value} / {total ?? 0}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
