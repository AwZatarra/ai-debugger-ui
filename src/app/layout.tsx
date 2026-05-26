import Link from "next/link";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Debugger UI",
  description: "Operational UI for AI-assisted incident analysis and PR workflows",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <div className="min-h-screen text-slate-100">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 px-5 py-4 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <Link href="/" className="group flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-lg border border-cyan-300/25 bg-cyan-300/10 text-sm font-black text-cyan-200 shadow-lg shadow-cyan-950/30">
                  AI
                </span>
                <span>
                  <span className="block text-lg font-semibold tracking-wide text-white">
                    AI Debugger
                  </span>
                  <span className="block text-sm text-slate-400">
                    RCA, contexto y PR automation para incidentes reales
                  </span>
                </span>
              </Link>

              <nav className="flex flex-wrap gap-2">
                <Link
                  href="/"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white"
                >
                  Inicio
                </Link>

                <Link
                  href="/incidents"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white"
                >
                  Incidentes
                </Link>

                <Link
                  href="/stats"
                  className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-white"
                >
                  Stats
                </Link>
              </nav>
            </div>
          </header>

          <main className="mx-auto max-w-7xl px-5 py-8 lg:py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
