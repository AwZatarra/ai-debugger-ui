import IncidentDetailClient from "@/src/components/incidents/IncidentDetailClient";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function IncidentDetailPage({ params }: PageProps) {
  const { id } = await params;

  return <IncidentDetailClient incidentId={id} />;
}