type Props = {
  data: any;
};

function normalizeHeuristicData(data: any) {
  const base = data?.result?.report ?? data?.result ?? data ?? null;

  if (!base) {
    return null;
  }

  return {
    probableRootCause: base.probable_root_cause ?? "-",
    confidence: base.confidence ?? "-",
    explanation: base.explanation ?? "-",
    suggestedFix: base.suggested_fix ?? "-",
    suggestedPatch: base.suggested_patch ?? "-",
    relatedIncidents: base.related_incidents ?? "-",
    llmModel: base.llm_model ?? "-",
    analyzedAt: base.analyzed_at ?? "-",
    evidence: Array.isArray(base.evidence) ? base.evidence : [],
  };
}

export default function HeuristicRcaPanel({ data }: Props) {
  const parsed = normalizeHeuristicData(data);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">RCA heurístico</h3>

      {!parsed ? (
        <p className="text-zinc-400">Aún no disponible.</p>
      ) : (
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-zinc-400">Probable root cause</p>
            <p>{parsed.probableRootCause}</p>
          </div>

          <div>
            <p className="text-zinc-400">Confidence</p>
            <p>{parsed.confidence}</p>
          </div>

          <div>
            <p className="text-zinc-400">Explanation</p>
            <p className="whitespace-pre-wrap">{parsed.explanation}</p>
          </div>

          <div>
            <p className="text-zinc-400">Suggested fix</p>
            <p className="whitespace-pre-wrap">{parsed.suggestedFix}</p>
          </div>

          <div>
            <p className="text-zinc-400">Suggested patch</p>
            <p className="whitespace-pre-wrap">{parsed.suggestedPatch}</p>
          </div>

          <div>
            <p className="text-zinc-400">Related incidents</p>
            <pre className="overflow-auto rounded bg-zinc-950 p-3 text-xs whitespace-pre-wrap">
              {typeof parsed.relatedIncidents === "string"
                ? parsed.relatedIncidents
                : JSON.stringify(parsed.relatedIncidents, null, 2)}
            </pre>
          </div>

          <div>
            <p className="text-zinc-400">Model</p>
            <p>{parsed.llmModel}</p>
          </div>

          <div>
            <p className="text-zinc-400">Analyzed at</p>
            <p>{parsed.analyzedAt}</p>
          </div>

          {parsed.evidence.length > 0 && (
            <div>
              <p className="text-zinc-400">Evidence</p>
              <ul className="list-disc pl-5">
                {parsed.evidence.map((item: any, idx: number) => (
                  <li key={idx}>
                    {typeof item === "string" ? item : JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}