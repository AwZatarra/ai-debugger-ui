"use client";

import Link from "next/link";
import useSWR from "swr";
import { incidentApi } from "@/lib/api";

export default function IncidentList() {
  const { data, error, isLoading, mutate } = useSWR(
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

  if (isLoading) {
    return <div>Cargando incidentes...</div>;
  }

  if (error) {
    return (
      <div>
        <p>Error cargando incidentes: {error.message}</p>
        <button onClick={() => mutate()}>Reintentar</button>
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Incidentes</h2>
        <button onClick={() => mutate()}>Refrescar</button>
      </div>

      {incidents.length === 0 ? (
        <div>No hay incidentes.</div>
      ) : (
        <div className="space-y-3">
          {incidents.map((incident: any) => (
            <div key={incident.incident_id} className="border p-3 rounded">
              <div><strong>ID:</strong> {incident.incident_id}</div>
              <div><strong>Service:</strong> {incident.service ?? "-"}</div>
              <div><strong>Endpoint:</strong> {incident.endpoint ?? "-"}</div>
              <div><strong>Error:</strong> {incident.error_code ?? "-"}</div>
              <div className="mt-2">
                <Link href={`/incidents/${incident.incident_id}`}>Ver detalle</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}