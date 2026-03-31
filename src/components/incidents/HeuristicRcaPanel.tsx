type Props = {
  data: any;
};

export default function HeuristicRcaPanel({ data }: Props) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">RCA heurístico</h3>

      {!data ? (
        <p className="text-zinc-400">Aún no disponible.</p>
      ) : (
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-zinc-400">Probable root cause</p>
            <p>{data.probable_root_cause ?? "-"}</p>
          </div>

          <div>
            <p className="text-zinc-400">Confidence</p>
            <p>{data.confidence ?? "-"}</p>
          </div>

          <div>
            <p className="text-zinc-400">Explanation</p>
            <p>{data.explanation ?? "-"}</p>
          </div>

          {Array.isArray(data.evidence) && data.evidence.length > 0 && (
            <div>
              <p className="text-zinc-400">Evidence</p>
              <ul className="list-disc pl-5">
                {data.evidence.map((item: string, idx: number) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}