import Link from "next/link";

const highlights = [
  {
    label: "RCA dual",
    value: "Heuristico + LLM",
    detail: "Compara evidencia deterministica con analisis asistido por IA.",
  },
  {
    label: "Knowledge",
    value: "Matches y similares",
    detail: "Conecta el incidente con contexto historico y documentacion.",
  },
  {
    label: "PR flow",
    value: "Propuesta a PR",
    detail: "Sigue el pipeline desde recomendacion hasta pull request real.",
  },
];

const workflow = [
  "Detectar incidente",
  "Enriquecer contexto",
  "Rankear causas",
  "Proponer fix",
  "Crear PR",
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/72 shadow-2xl shadow-slate-950/40">
        <div className="grid gap-8 p-6 lg:grid-cols-[1.25fr_0.75fr] lg:p-8">
          <div className="flex min-h-[360px] flex-col justify-between gap-8">
            <div className="space-y-5">
              <div className="inline-flex rounded-lg border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                Portfolio-ready operational tool
              </div>

              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-black leading-tight text-white lg:text-6xl">
                  AI Debugger convierte incidentes en RCA, evidencia y PRs accionables.
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-300 lg:text-lg">
                  Una interfaz de debugging asistido por IA para mostrar criterio
                  de producto, integracion frontend-backend y automatizacion de
                  flujos tecnicos complejos.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/incidents"
                  className="rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/30 hover:bg-cyan-200"
                >
                  Ver incidentes
                </Link>

                <Link
                  href="/stats"
                  className="rounded-lg border border-white/15 bg-white/5 px-5 py-3 text-sm font-bold text-white hover:border-cyan-300/40 hover:bg-white/10"
                >
                  Revisar metricas
                </Link>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {highlights.map((item) => (
                <article
                  key={item.label}
                  className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
                >
                  <p className="text-xs font-semibold uppercase tracking-wide text-cyan-200">
                    {item.label}
                  </p>
                  <p className="mt-2 text-lg font-bold text-white">{item.value}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    {item.detail}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/10 bg-slate-900/80 p-5">
            <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-sm font-semibold text-white">Live incident</p>
                <p className="text-xs text-slate-400">checkout-api latency spike</p>
              </div>
              <span className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-bold text-amber-200">
                SEV-2
              </span>
            </div>

            <div className="space-y-4">
              <MetricRow label="Confidence" value="87%" tone="cyan" />
              <MetricRow label="Similar incidents" value="14" tone="emerald" />
              <MetricRow label="PR checks" value="5/6" tone="amber" />
            </div>

            <div className="mt-6 rounded-lg border border-white/10 bg-slate-950/80 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Root cause
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-200">
                Timeout regression introduced in payment retry path. Suggested fix
                generated with guarded file edits and validation steps.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
            End-to-end workflow
          </p>
          <h2 className="mt-3 text-2xl font-bold text-white">
            Pensado para que un reclutador entienda el valor en segundos.
          </h2>
        </div>

        <div className="grid gap-3 sm:grid-cols-5">
          {workflow.map((step, index) => (
            <div
              key={step}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-4"
            >
              <p className="text-xs font-bold text-cyan-200">
                {String(index + 1).padStart(2, "0")}
              </p>
              <p className="mt-3 text-sm font-semibold text-white">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricRow({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "cyan" | "emerald" | "amber";
}) {
  const tones = {
    cyan: "bg-cyan-300",
    emerald: "bg-emerald-300",
    amber: "bg-amber-300",
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-sm">
        <span className="text-slate-400">{label}</span>
        <span className="font-bold text-white">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full w-4/5 rounded-full ${tones[tone]}`} />
      </div>
    </div>
  );
}
