"use client";

import { useEffect, useState } from "react";
import { incidentApi } from "../../lib/api";

export default function IncidentsPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    async function load() {
      try {
        const res = await incidentApi.getIncidents();
        console.log("INCIDENTS RESPONSE =", res);
        setData(res);
      } catch (err: any) {
        console.error("ERROR =", err);
        setError(err.message);
      }
    }

    load();
  }, []);

  return (
    <div>
      <h1>Incidents</h1>

      {error && <p>Error: {error}</p>}

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}