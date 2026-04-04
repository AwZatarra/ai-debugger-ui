import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Debugger UI",
  description: "Minimal UI for incidents and RCA visualization",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen bg-zinc-950 text-zinc-100">
          <header className="border-b border-zinc-800 px-6 py-4">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-xl font-semibold">AI Debugger</h1>
                <p className="text-sm text-zinc-400">
                  Incidentes, contexto, RCA y conocimiento relacionado
                </p>
              </div>

              <nav className="flex flex-wrap gap-3">
                <Link
                  href="/"
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
                >
                  Inicio
                </Link>

                <Link
                  href="/incidents"
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
                >
                  Incidents
                </Link>

                <Link
                  href="/stats"
                  className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
                >
                  Stats
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}