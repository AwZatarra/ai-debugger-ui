"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import useSWR from "swr";
import { incidentApi } from "@/src/lib/api";

type IncidentListItem = {
  incident_id?: string;
  title?: string;
  primary_service?: string;
  severity?: string;
  status?: string;
  error_type?: string;
  error_message?: string;
  trace_id?: string;
  fingerprint?: string;
  created_at?: string;
};

function badgeClass(value: unknown) {
  const normalized = String(value ?? "").toLowerCase();

  if (normalized.includes("sev-1") || normalized.includes("critical")) {
    return "border-red-300/30 bg-red-300/10 text-red-200";
  }

  if (normalized.includes("sev-2") || normalized.includes("high")) {
    return "border-amber-300/30 bg-amber-300/10 text-amber-200";
  }

  if (normalized.includes("open") || normalized.includes("active")) {
    return "border-cyan-300/30 bg-cyan-300/10 text-cyan-200";
  }

  if (normalized.includes("resolved") || normalized.includes("closed")) {
    return "border-emerald-300/30 bg-emerald-300/10 text-emerald-200";
  }

  return "border-white/10 bg-white/5 text-slate-300";
}

export default function IncidentList() {
  const [search, setSearch] = useState("");

  const { data, error, isLoading, mutate, isValidating } = useSWR(
    "incidents",
    () => incidentApi.getIncidents(),
    {
      refreshInterval: 10000,
    }
  );

  const incidents = useMemo<IncidentListItem[]>(() => {
    if (Array.isArray(data?.incidents)) return data.incidents;
    if (Array.isArray(data)) return data;
    return [];
  }, [data]);

  const filteredIncidents = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return incidents;

    return incidents.filter((incident) => {
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

  const servicesCount = new Set(
    incidents.map((incident) => incident.primary_service).filter(Boolean)
  ).size;

  const activeCount = incidents.filter((incident) => {
    const status = String(incident.status ?? "").toLowerCase();
    return status.includes("open") || status.includes("active");
  }).length;

  if (isLoading) {
    return (
      <section className="rounded-lg border border-white/10 bg-slate-950/70 p-6">
        <p className="text-slate-300">Cargando incidentes...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-lg border border-red-300/25 bg-red-950/40 p-6">
        <div className="space-y-4">
          <p className="text-red-200">Error cargando incidentes: {error.message}</p>
          <button
            onClick={() => mutate()}
            className="rounded-lg bg-red-200 px-4 py-2 text-sm font-bold text-red-950"
          >
            Reintentar
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-5">
      <div className="rounded-lg border border-white/10 bg-slate-950/72 p-5 shadow-2xl shadow-slate-950/25">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-2">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-200">
              Incident command center
            </p>
            <h1 className="text-3xl font-black text-white">Incidentes</h1>
            <p className="text-sm leading-6 text-slate-400">
              Explora senales de produccion, revisa severidad y entra al RCA
              sin perder el contexto operativo.
            </p>
          </div>

          <button
            onClick={() => mutate()}
            className="w-full rounded-lg bg-cyan-300 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-cyan-950/25 hover:bg-cyan-200 sm:w-auto"
          >
            {isValidating ? "Refrescando..." : "Refrescar"}
          </button>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <SummaryStat label="Total" value={incidents.length} />
          <SummaryStat label="Activos" value={activeCount} />
          <SummaryStat label="Servicios" value={servicesCount} />
        </div>

        <div className="mt-5 grid gap-3 lg:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por ID, titulo, servicio, severity, status, error o trace"
            className="w-full rounded-lg border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/50 focus:ring-2 focus:ring-cyan-300/15"
          />

          <div className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300">
            {filteredIncidents.length} resultado
            {filteredIncidents.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {filteredIncidents.length === 0 ? (
        <div className="rounded-lg border border-white/10 bg-slate-950/72 p-6 text-slate-400">
          {search.trim()
            ? "No se encontraron incidentes con ese criterio."
            : "No hay incidentes."}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredIncidents.map((incident) => (
            <article
              key={incident.incident_id}
              className="rounded-lg border border-white/10 bg-slate-950/68 p-5 shadow-xl shadow-slate-950/20 hover:border-cyan-300/30"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`rounded-lg border px-3 py-1 text-xs font-bold ${badgeClass(
                        incident.severity
                      )}`}
                    >
                      {incident.severity ?? "Sin severity"}
                    </span>
                    <span
                      className={`rounded-lg border px-3 py-1 text-xs font-bold ${badgeClass(
                        incident.status
                      )}`}
                    >
                      {incident.status ?? "Sin status"}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-white">
                      {incident.title ?? "Sin titulo"}
                    </h2>
                    <p className="mt-2 break-all text-xs text-slate-500">
                      {incident.incident_id ?? "-"}
                    </p>
                  </div>

                  <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-3">
                    <Field label="Service" value={incident.primary_service} />
                    <Field label="Error type" value={incident.error_type} />
                    <Field label="Created" value={incident.created_at} />
                  </div>

                  <p className="line-clamp-2 text-sm leading-6 text-slate-400">
                    {incident.error_message ?? "Sin mensaje de error registrado."}
                  </p>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-56 lg:items-end">
                  <div className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm lg:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Trace ID
                    </p>
                    <p className="mt-1 break-all text-slate-300">
                      {incident.trace_id ?? "-"}
                    </p>
                  </div>

                  <Link
                    href={`/incidents/${incident.incident_id}`}
                    className="w-full rounded-lg bg-white px-4 py-3 text-center text-sm font-bold text-slate-950 hover:bg-cyan-200 lg:w-auto"
                  >
                    Ver detalle
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-black text-white">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 break-words text-slate-200">{value ?? "-"}</p>
    </div>
  );
}
