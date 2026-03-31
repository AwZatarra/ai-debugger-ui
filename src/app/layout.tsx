// import "./globals.css";
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
            <h1 className="text-xl font-semibold">AI Debugger</h1>
            <p className="text-sm text-zinc-400">
              Incidentes, contexto, RCA y conocimiento relacionado
            </p>
          </header>

          <main className="mx-auto max-w-7xl px-6 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}