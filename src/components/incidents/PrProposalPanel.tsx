import PrProposalReviewActions from "@/src/components/incidents/PrProposalReviewActions";
import PrProposalExecutionActions from "@/src/components/incidents/PrProposalExecutionActions";

type Props = {
  data: any;
  loading?: boolean;
  error?: any;
  onReviewed?: () => void | Promise<void>;
  onExecutionActionDone?: () => void | Promise<void>;
  proposalActionsData?: any;
};

function normalizePrProposal(data: any) {
  const envelope = data?.result ?? data ?? null;

  if (!envelope) {
    return null;
  }

  const nestedProposal = envelope?.proposal ?? {};
  const nestedReview = nestedProposal?.review ?? {};

  const merged = {
    proposal_id:
      envelope?.proposal_id ??
      nestedProposal?.proposal_id ??
      null,

    title: envelope?.title ?? nestedProposal?.title ?? null,
    status: envelope?.status ?? nestedProposal?.status ?? null,
    repository: envelope?.repository ?? nestedProposal?.repository ?? null,
    target_branch: envelope?.target_branch ?? nestedProposal?.target_branch ?? null,
    risk_level: envelope?.risk_level ?? nestedProposal?.risk_level ?? null,
    summary: envelope?.summary ?? nestedProposal?.summary ?? null,
    allowlisted_paths:
      envelope?.allowlisted_paths ??
      nestedProposal?.allowlisted_paths ??
      [],
    changed_files:
      envelope?.changed_files ??
      nestedProposal?.changed_files ??
      [],
    checks:
      envelope?.checks ??
      nestedProposal?.checks ??
      [],
    guardrails:
      envelope?.guardrails ??
      nestedProposal?.guardrails ??
      null,
    why: envelope?.why ?? nestedProposal?.why ?? null,
    implementation_plan:
      envelope?.implementation_plan ??
      nestedProposal?.implementation_plan ??
      [],
    tests:
      envelope?.tests ??
      nestedProposal?.tests ??
      [],
    created_at: envelope?.created_at ?? nestedProposal?.created_at ?? null,
    llm_model: envelope?.llm_model ?? nestedProposal?.llm_model ?? null,

    reviewed_at:
      envelope?.reviewed_at ??
      nestedReview?.reviewed_at ??
      null,

    reviewer:
      envelope?.reviewer ??
      nestedReview?.reviewer ??
      null,

    review_notes:
      envelope?.review_notes ??
      nestedReview?.notes ??
      null,

    review_decision:
      nestedReview?.decision ??
      null,
  };

  const hasVisibleContent =
    merged.title ||
    merged.summary ||
    merged.status ||
    merged.repository ||
    merged.target_branch ||
    merged.risk_level ||
    merged.proposal_id;

  return hasVisibleContent ? merged : null;
}

export default function PrProposalPanel({
  data,
  loading,
  error,
  onReviewed,
  onExecutionActionDone,
  proposalActionsData,
}: Props) {
  const proposal = normalizePrProposal(data);

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">PR Proposal</h3>

      {loading && <p>Cargando PR proposal...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!loading && !error && !proposal && (
        <p className="text-zinc-400">No hay PR proposal disponible.</p>
      )}

      {!loading && !error && proposal && (
        <div className="space-y-4 text-sm">
          <div>
            <p className="text-zinc-400">Title</p>
            <p className="whitespace-pre-wrap">{proposal.title ?? "-"}</p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <p className="text-zinc-400">Proposal ID</p>
              <p className="break-all">{proposal.proposal_id ?? "-"}</p>
            </div>

            <div>
              <p className="text-zinc-400">Status</p>
              <p>{proposal.status ?? "-"}</p>
            </div>

            <div>
              <p className="text-zinc-400">Repository</p>
              <p>{proposal.repository ?? "-"}</p>
            </div>

            <div>
              <p className="text-zinc-400">Target branch</p>
              <p>{proposal.target_branch ?? "-"}</p>
            </div>

            <div>
              <p className="text-zinc-400">Risk level</p>
              <p>{proposal.risk_level ?? "-"}</p>
            </div>

            <div>
              <p className="text-zinc-400">LLM model</p>
              <p>{proposal.llm_model ?? "-"}</p>
            </div>

            <div>
              <p className="text-zinc-400">Created at</p>
              <p>{proposal.created_at ?? "-"}</p>
            </div>

            <div>
              <p className="text-zinc-400">Review decision</p>
              <p>{proposal.review_decision ?? "-"}</p>
            </div>

            <div>
              <p className="text-zinc-400">Reviewer</p>
              <p>{proposal.reviewer ?? "-"}</p>
            </div>

            <div>
              <p className="text-zinc-400">Reviewed at</p>
              <p>{proposal.reviewed_at ?? "-"}</p>
            </div>
          </div>

          <div>
            <p className="text-zinc-400">Summary</p>
            <p className="whitespace-pre-wrap">{proposal.summary ?? "-"}</p>
          </div>

          <div>
            <p className="text-zinc-400">Why</p>
            <p className="whitespace-pre-wrap">{proposal.why ?? "-"}</p>
          </div>

          <div>
            <p className="text-zinc-400">Review notes</p>
            <p className="whitespace-pre-wrap">{proposal.review_notes ?? "-"}</p>
          </div>

          <PrProposalReviewActions
            proposalId={proposal.proposal_id}
            status={proposal.status}
            initialNotes={proposal.review_notes ?? ""}
            onReviewed={onReviewed}
          />

          <PrProposalExecutionActions
            proposalId={proposal.proposal_id}
            proposalStatus={proposal.status}
            actionsData={proposalActionsData}
            onDone={onExecutionActionDone}
          />

          <div>
            <p className="text-zinc-400">Allowlisted paths</p>
            {Array.isArray(proposal.allowlisted_paths) &&
            proposal.allowlisted_paths.length > 0 ? (
              <ul className="list-disc pl-5">
                {proposal.allowlisted_paths.map((path: string, index: number) => (
                  <li key={index}>{path}</li>
                ))}
              </ul>
            ) : (
              <p>-</p>
            )}
          </div>

          <div>
            <p className="text-zinc-400">Changed files</p>
            {Array.isArray(proposal.changed_files) &&
            proposal.changed_files.length > 0 ? (
              <div className="space-y-3">
                {proposal.changed_files.map((file: any, index: number) => (
                  <div
                    key={`${file.path ?? "file"}-${index}`}
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                  >
                    <p>
                      <span className="text-zinc-400">Path:</span> {file.path ?? "-"}
                    </p>
                    <p>
                      <span className="text-zinc-400">Change type:</span>{" "}
                      {file.change_type ?? "-"}
                    </p>
                    <p>
                      <span className="text-zinc-400">Purpose:</span>{" "}
                      {file.purpose ?? "-"}
                    </p>
                    <p className="whitespace-pre-wrap">
                      <span className="text-zinc-400">Patch summary:</span>{" "}
                      {file.patch_summary ?? "-"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>-</p>
            )}
          </div>

          <div>
            <p className="text-zinc-400">Checks</p>
            {Array.isArray(proposal.checks) && proposal.checks.length > 0 ? (
              <div className="space-y-3">
                {proposal.checks.map((check: any, index: number) => (
                  <div
                    key={`${check.name ?? "check"}-${index}`}
                    className="rounded-lg border border-zinc-800 bg-zinc-950 p-3"
                  >
                    <p>
                      <span className="text-zinc-400">Name:</span> {check.name ?? "-"}
                    </p>
                    <p>
                      <span className="text-zinc-400">Type:</span> {check.type ?? "-"}
                    </p>
                    <p className="whitespace-pre-wrap">
                      <span className="text-zinc-400">Command or step:</span>{" "}
                      {check.command_or_step ?? "-"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p>-</p>
            )}
          </div>

          <div>
            <p className="text-zinc-400">Implementation plan</p>
            {Array.isArray(proposal.implementation_plan) &&
            proposal.implementation_plan.length > 0 ? (
              <ol className="list-decimal pl-5 space-y-1">
                {proposal.implementation_plan.map((step: string, index: number) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            ) : (
              <p>-</p>
            )}
          </div>

          <div>
            <p className="text-zinc-400">Tests</p>
            {Array.isArray(proposal.tests) && proposal.tests.length > 0 ? (
              <ul className="list-disc pl-5">
                {proposal.tests.map((test: string, index: number) => (
                  <li key={index}>{test}</li>
                ))}
              </ul>
            ) : (
              <p>-</p>
            )}
          </div>

          <div>
            <p className="text-zinc-400">Guardrails</p>
            <pre className="overflow-auto rounded bg-zinc-950 p-3 text-xs whitespace-pre-wrap">
              {proposal.guardrails
                ? JSON.stringify(proposal.guardrails, null, 2)
                : "-"}
            </pre>
          </div>
        </div>
      )}
    </section>
  );
}