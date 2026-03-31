export default function TestPage() {
  return <div>{process.env.NEXT_PUBLIC_API_BASE_URL || "NO DEFINIDA"}</div>;
}