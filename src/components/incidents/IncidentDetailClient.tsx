"use client";

import useSWR from "swr";
import { incidentApi } from "@/src/lib/api";

type Props = {
  incidentId: string;
};

export default function IncidentDetailClient({ incidentId }: Props) {
  const contextQuery = useSWR(
    ["context", incidentId],
    () => incidentApi.getContext(incidentId)
  );

  const summaryQuery = useSWR(
    ["summary", incidentId],
    () => incidentApi.getAnalysisSummary(incidentId)
  );

  const similarQuery = useSWR(
    ["similar", incidentId],
    () => incidentApi.getSimilar(incidentId)
  );

  // const knowledgeQuery = useSWR(
  //   ["knowledge", incidentId],
  //   () => incidentApi.getKnowledgeByIncident(incidentId)
  // );

  if (
    contextQuery.isLoading ||
    summaryQuery.isLoading ||
    similarQuery.isLoading //||
    // knowledgeQuery.isLoading
  ) {
    return <div>Cargando detalle...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Incidente {incidentId}</h2>

      <section>
        <h3 className="font-semibold">Contexto</h3>
        <pre>{JSON.stringify(contextQuery.data, null, 2)}</pre>
      </section>

      <section>
        <h3 className="font-semibold">Summary</h3>
        <pre>{JSON.stringify(summaryQuery.data, null, 2)}</pre>
      </section>

      <section>
        <h3 className="font-semibold">Similar incidents</h3>
        <pre>{JSON.stringify(similarQuery.data, null, 2)}</pre>
      </section>

      {/* <section>
        <h3 className="font-semibold">Knowledge</h3>
        <pre>{JSON.stringify(knowledgeQuery.data, null, 2)}</pre>
      </section> */}
    </div>
  );
}