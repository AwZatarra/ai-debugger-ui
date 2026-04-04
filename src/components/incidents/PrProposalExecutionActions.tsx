"use client";

import { useMemo, useState } from "react";
import { incidentApi } from "@/src/lib/api";

type Props = {
  proposalId: string;
  proposalStatus: string;
  actionsData: any;
  onDone?: () => void | Promise<void>;
};

function getActions(actionsData: any) {
  if (Array.isArray(actionsData?.actions)) return actionsData.actions;
  if (Array.isArray(actionsData?.result?.actions)) return actionsData.result.actions;
  if (Array.isArray(actionsData)) return actionsData;
  return [];
}

function getLatestActionByStatus(actions: any[], status: string) {
  let latest: any = null;

  for (const action of actions) {
    if (action?.status === status) {
      latest = action;
    }
  }

  return latest;
}

function hasStatus(actions: any[], statuses: string[]) {
  return actions.some((action) => statuses.includes(action?.status));
}

export default function PrProposalExecutionActions({
  proposalId,
  proposalStatus,
  actionsData,
  onDone,
}: Props) {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const actions = useMemo(() => getActions(actionsData), [actionsData]);

  const preparedAction = getLatestActionByStatus(actions, "prepared");
  const prCreatedAction = getLatestActionByStatus(actions, "pr_created");

  const canPrepare =
    proposalStatus === "approved" &&
    !preparedAction &&
    !prCreatedAction;

  const canGenerate =
    proposalStatus === "approved" &&
    hasStatus(actions, ["prepared"]) &&
    !hasStatus(actions, [
      "edits_generated",
      "edits_regenerated",
      "edits_validated",
      "local_checks_passed",
      "pr_created",
    ]);

  const canRegenerate =
    proposalStatus === "approved" &&
    hasStatus(actions, ["edits_generation_failed", "edits_validation_failed"]);

  const canValidate =
    proposalStatus === "approved" &&
    hasStatus(actions, ["edits_generated", "edits_regenerated"]) &&
    !hasStatus(actions, ["edits_validated", "local_checks_passed", "pr_created"]);

  const canRunLocalChecks =
    proposalStatus === "approved" &&
    hasStatus(actions, ["edits_validated"]) &&
    !hasStatus(actions, [
      "local_checks_passed",
      "local_checks_failed",
      "local_checks_inconclusive",
      "pr_created",
    ]);

  const canCreateGithubPr =
    proposalStatus === "approved" &&
    hasStatus(actions, ["local_checks_passed"]) &&
    !hasStatus(actions, [
      "pr_created",
      "local_checks_failed",
      "local_checks_inconclusive",
    ]);

  const handleAction = async (
    actionName: string,
    fn: () => Promise<any>,
    successMessage: string
  ) => {
    try {
      setLoadingAction(actionName);
      setMessage(null);
      await fn();
      setMessage(successMessage);
      await onDone?.();
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoadingAction(null);
    }
  };

  if (proposalStatus !== "approved" && !prCreatedAction) {
    return null;
  }

  const prPayload = prCreatedAction?.payload ?? {};
  const pullRequest = prPayload?.pull_request ?? {};
  const prUrl = prCreatedAction?.pr_url || pullRequest?.html_url || "";
  const files = Array.isArray(prPayload?.files) ? prPayload.files : [];

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 space-y-3">
      <p className="font-medium text-zinc-300">PR execution pipeline</p>

      <div className="flex flex-wrap gap-3">
        {canPrepare && (
          <button
            onClick={() =>
              handleAction(
                "prepare-execution",
                () => incidentApi.preparePrProposalExecution(proposalId),
                "Execution preparada correctamente."
              )
            }
            disabled={loadingAction !== null}
            className="rounded bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {loadingAction === "prepare-execution" ? "Preparing..." : "Prepare execution"}
          </button>
        )}

        {canGenerate && (
          <button
            onClick={() =>
              handleAction(
                "generate-file-edits",
                () => incidentApi.generatePrProposalFileEdits(proposalId),
                "File edits generados correctamente."
              )
            }
            disabled={loadingAction !== null}
            className="rounded bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {loadingAction === "generate-file-edits" ? "Generating..." : "Generate file edits"}
          </button>
        )}

        {canRegenerate && (
          <button
            onClick={() =>
              handleAction(
                "regenerate-file-edits",
                () => incidentApi.regeneratePrProposalFileEdits(proposalId),
                "File edits regenerados correctamente."
              )
            }
            disabled={loadingAction !== null}
            className="rounded bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {loadingAction === "regenerate-file-edits" ? "Regenerating..." : "Regenerate file edits"}
          </button>
        )}

        {canValidate && (
          <button
            onClick={() =>
              handleAction(
                "validate-file-edits",
                () => incidentApi.validatePrProposalFileEdits(proposalId),
                "File edits validados correctamente."
              )
            }
            disabled={loadingAction !== null}
            className="rounded bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {loadingAction === "validate-file-edits" ? "Validating..." : "Validate file edits"}
          </button>
        )}

        {canRunLocalChecks && (
          <button
            onClick={() =>
              handleAction(
                "run-local-checks",
                () => incidentApi.runPrProposalLocalChecks(proposalId),
                "Local checks ejecutados correctamente."
              )
            }
            disabled={loadingAction !== null}
            className="rounded bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {loadingAction === "run-local-checks" ? "Running..." : "Run local checks"}
          </button>
        )}

        {canCreateGithubPr && (
          <button
            onClick={() =>
              handleAction(
                "create-github-pr",
                () => incidentApi.createGithubPrFromProposal(proposalId),
                "GitHub PR creado correctamente."
              )
            }
            disabled={loadingAction !== null}
            className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {loadingAction === "create-github-pr" ? "Creating PR..." : "Create GitHub PR"}
          </button>
        )}
      </div>

      {message && <p className="text-sm text-zinc-300">{message}</p>}

      {prCreatedAction && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-sm space-y-2">
          <p className="font-medium text-zinc-300">GitHub PR created</p>

          <p>
            <span className="text-zinc-400">Status:</span> {prCreatedAction.status ?? "-"}
          </p>

          <p>
            <span className="text-zinc-400">PR number:</span> {pullRequest?.number ?? "-"}
          </p>

          <p>
            <span className="text-zinc-400">PR title:</span> {pullRequest?.title ?? "-"}
          </p>

          <p>
            <span className="text-zinc-400">State:</span> {pullRequest?.state ?? "-"}
          </p>

          <p>
            <span className="text-zinc-400">Base branch:</span> {pullRequest?.base ?? "-"}
          </p>

          <p>
            <span className="text-zinc-400">Head branch:</span> {pullRequest?.head ?? "-"}
          </p>

          {prUrl && (
            <p>
              <span className="text-zinc-400">PR link:</span>{" "}
              <a
                href={prUrl}
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Open PR
              </a>
            </p>
          )}

          {files.length > 0 && (
            <div>
              <p className="text-zinc-400">Files</p>
              <div className="space-y-2">
                {files.map((file: any, index: number) => (
                  <div
                    key={`${file.path ?? "file"}-${file.commit_sha ?? index}`}
                    className="rounded border border-zinc-800 p-2"
                  >
                    <p>
                      <span className="text-zinc-400">Path:</span> {file.path ?? "-"}
                    </p>
                    <p>
                      <span className="text-zinc-400">Content SHA:</span> {file.content_sha ?? "-"}
                    </p>
                    <p>
                      <span className="text-zinc-400">Commit SHA:</span> {file.commit_sha ?? "-"}
                    </p>
                    {file.commit_url && (
                      <p>
                        <span className="text-zinc-400">Commit link:</span>{" "}
                        <a
                          href={file.commit_url}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          Open commit
                        </a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}