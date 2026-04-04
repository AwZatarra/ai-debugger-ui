import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-2xl font-bold">Bienvenido</h2>
        <p className="mt-2 text-zinc-300">
          Esta UI mínima te permite navegar incidentes, revisar el RCA y consultar
          métricas globales del sistema.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/incidents"
            className="inline-block rounded-lg bg-white px-4 py-2 font-medium text-black"
          >
            Ver incidentes
          </Link>

          <Link
            href="/stats"
            className="inline-block rounded-lg border border-zinc-700 bg-zinc-950 px-4 py-2 font-medium text-zinc-100 hover:bg-zinc-800"
          >
            Ver stats
          </Link>
        </div>
      </section>
    </div>
  );
}