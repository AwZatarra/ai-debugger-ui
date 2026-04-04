"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { incidentApi } from "@/src/lib/api";

export default function IncidentList() {
  const [search, setSearch] = useState("");

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    "incidents",
    () => incidentApi.getIncidents(),
    {
      refreshInterval: 10000,
    }
  );

  const incidents = Array.isArray(data?.incidents)
    ? data.incidents
    : Array.isArray(data)
    ? data
    : [];

  const filteredIncidents = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return incidents;

    return incidents.filter((incident: any) => {
      const values = [
        incident.incident_id,
        incident.title,
        incident.primary_service,
        incident.severity,
        incident.status,
        incident.error_type,
        incident.error_message,
        incident.trace_id,
        incident.fingerprint,
      ];

      return values.some((value) =>
        String(value ?? "").toLowerCase().includes(term)
      );
    });
  }, [incidents, search]);

  if (isLoading) {
    return (
      <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <p>Cargando incidentes...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-xl border border-red-900 bg-red-950/40 p-4">
        <div className="space-y-3">
          <p className="text-red-300">
            Error cargando incidentes: {error.message}
          </p>
          <button
            onClick={() => mutate()}
            className="rounded bg-white px-4 py-2 text-black"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold">Incidentes</h2>
            <p className="text-sm text-zinc-400">
              Explora incidentes y entra al detalle sin escribir rutas manualmente.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => mutate()}
              className="rounded bg-white px-4 py-2 text-black"
            >
              {isValidating ? "Refrescando..." : "Refrescar"}
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID, título, servicio, severity, status, error o trace"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
          />

          <div className="rounded-lg border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-300">
            {filteredIncidents.length} resultado
            {filteredIncidents.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {filteredIncidents.length === 0 ? (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-zinc-400">
          {search.trim()
            ? "No se encontraron incidentes con ese criterio."
            : "No hay incidentes."}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIncidents.map((incident: any) => (
            <article
              key={incident.incident_id}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-2">
                  <p className="text-base font-semibold text-zinc-100">
                    {incident.title ?? "Sin título"}
                  </p>

                  <p className="text-sm">
                    <span className="text-zinc-400">ID:</span>{" "}
                    <span className="break-all">{incident.incident_id ?? "-"}</span>
                  </p>

                  <p className="text-sm">
                    <span className="text-zinc-400">Service:</span>{" "}
                    {incident.primary_service ?? "-"}
                  </p>

                  <p className="text-sm">
                    <span className="text-zinc-400">Error type:</span>{" "}
                    {incident.error_type ?? "-"}
                  </p>

                  <p className="text-sm">
                    <span className="text-zinc-400">Error message:</span>{" "}
                    {incident.error_message ?? "-"}
                  </p>
                </div>

                <div className="space-y-2 text-sm lg:text-right">
                  <p>
                    <span className="text-zinc-400">Severity:</span>{" "}
                    {incident.severity ?? "-"}
                  </p>

                  <p>
                    <span className="text-zinc-400">Status:</span>{" "}
                    {incident.status ?? "-"}
                  </p>

                  <p>
                    <span className="text-zinc-400">Created at:</span>{" "}
                    {incident.created_at ?? "-"}
                  </p>

                  <p>
                    <span className="text-zinc-400">Trace ID:</span>{" "}
                    <span className="break-all">{incident.trace_id ?? "-"}</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <Link
                  href={`/incidents/${incident.incident_id}`}
                  className="rounded bg-white px-4 py-2 text-sm font-medium text-black"
                >
                  Ver detalle
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}