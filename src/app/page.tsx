import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Bienvenido</h2>
      <p className="text-zinc-300">
        Esta UI mínima te permite navegar incidentes y revisar el RCA.
      </p>

      <Link
        href="/incidents"
        className="inline-block rounded-lg bg-white px-4 py-2 text-black font-medium"
      >
        Ver incidentes
      </Link>
    </div>
  );
}