type Props = {
  data: any;
  loading?: boolean;
  error?: any;
};

function getActions(data: any) {
  if (Array.isArray(data?.actions)) return data.actions;
  if (Array.isArray(data?.result?.actions)) return data.result.actions;
  if (Array.isArray(data)) return data;
  return [];
}

function renderStringArray(items: any[]) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p>-</p>;
  }

  return (
    <ul className="list-disc pl-5">
      {items.map((item, index) => (
        <li key={`${String(item)}-${index}`}>{String(item)}</li>
      ))}
    </ul>
  );
}

export default function PrActionsPanel({ data, loading, error }: Props) {
  const actions = getActions(data);

  const sortedActions = [...actions].sort((a, b) =>
    String(b?.created_at ?? "").localeCompare(String(a?.created_at ?? ""))
  );

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">PR Actions</h3>

      {loading && <p>Cargando PR actions...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      {!loading && !error && sortedActions.length === 0 && (
        <p className="text-zinc-400">No hay acciones de PR registradas.</p>
      )}

      <div className="space-y-4">
        {sortedActions.map((action: any, index: number) => {
          const key = [
            action?.action_id ?? "no-action-id",
            action?.status ?? "no-status",
            action?.created_at ?? "no-created-at",
            index,
          ].join("-");

          const payload = action?.payload ?? {};
          const pullRequest = payload?.pull_request ?? {};
          const prUrl = action?.pr_url || payload?.pr_url || pullRequest?.html_url || "";

          return (
            <article
              key={key}
              className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 text-sm space-y-3"
            >
              <div className="grid gap-3 lg:grid-cols-2">
                <p>
                  <span className="text-zinc-400">Action ID:</span>{" "}
                  <span className="break-all">{action?.action_id ?? "-"}</span>
                </p>

                <p>
                  <span className="text-zinc-400">Status:</span> {action?.status ?? "-"}
                </p>

                <p>
                  <span className="text-zinc-400">Created at:</span>{" "}
                  {action?.created_at ?? "-"}
                </p>

                <p>
                  <span className="text-zinc-400">Branch name:</span>{" "}
                  {action?.branch_name ?? payload?.branch_name ?? "-"}
                </p>
              </div>

              {prUrl && (
                <p>
                  <span className="text-zinc-400">PR URL:</span>{" "}
                  <a href={prUrl} target="_blank" rel="noreferrer" className="underline">
                    Open PR
                  </a>
                </p>
              )}

              {payload?.stage && (
                <p>
                  <span className="text-zinc-400">Stage:</span> {payload.stage}
                </p>
              )}

              {payload?.error && (
                <p className="whitespace-pre-wrap">
                  <span className="text-zinc-400">Error:</span> {payload.error}
                </p>
              )}

              {payload?.workspace_path && (
                <p className="break-all">
                  <span className="text-zinc-400">Workspace path:</span>{" "}
                  {payload.workspace_path}
                </p>
              )}

              {Array.isArray(payload?.applied_files) && payload.applied_files.length > 0 && (
                <div>
                  <p className="text-zinc-400">Applied files</p>
                  {renderStringArray(payload.applied_files)}
                </div>
              )}

              {typeof payload?.has_real_checks !== "undefined" && (
                <p>
                  <span className="text-zinc-400">Has real checks:</span>{" "}
                  {payload.has_real_checks ? "Sí" : "No"}
                </p>
              )}

              {typeof payload?.executed_checks_count !== "undefined" && (
                <p>
                  <span className="text-zinc-400">Executed checks count:</span>{" "}
                  {payload.executed_checks_count}
                </p>
              )}

              {(action?.status === "prepared" || action?.status === "prepare_failed") && (
                <div className="space-y-2">
                  <p>
                    <span className="text-zinc-400">Ready:</span>{" "}
                    {typeof payload?.ready === "boolean" ? (payload.ready ? "Sí" : "No") : "-"}
                  </p>

                  {payload?.suggested_branch_name && (
                    <p>
                      <span className="text-zinc-400">Suggested branch name:</span>{" "}
                      {payload.suggested_branch_name}
                    </p>
                  )}

                  {Array.isArray(payload?.reasons) && payload.reasons.length > 0 && (
                    <div>
                      <p className="text-zinc-400">Reasons</p>
                      {renderStringArray(payload.reasons)}
                    </div>
                  )}

                  {Array.isArray(payload?.execution_plan?.files) &&
                    payload.execution_plan.files.length > 0 && (
                      <div>
                        <p className="text-zinc-400">Execution plan files</p>
                        <div className="space-y-2">
                          {payload.execution_plan.files.map((file: any, fileIndex: number) => (
                            <div
                              key={`${file?.path ?? "file"}-${fileIndex}`}
                              className="rounded border border-zinc-800 p-2"
                            >
                              <p>
                                <span className="text-zinc-400">Path:</span> {file?.path ?? "-"}
                              </p>
                              <p>
                                <span className="text-zinc-400">Change type:</span>{" "}
                                {file?.change_type ?? "-"}
                              </p>
                              <p className="whitespace-pre-wrap">
                                <span className="text-zinc-400">Purpose:</span>{" "}
                                {file?.purpose ?? "-"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {(action?.status === "edits_generated" ||
                action?.status === "edits_regenerated" ||
                action?.status === "edits_generation_failed" ||
                action?.status === "edits_regeneration_failed") && (
                <div className="space-y-2">
                  <p className="text-zinc-400">File edits summary</p>
                  <p className="whitespace-pre-wrap">{payload?.summary ?? "-"}</p>

                  {Array.isArray(payload?.edits) && payload.edits.length > 0 && (
                    <div className="space-y-2">
                      {payload.edits.map((edit: any, editIndex: number) => (
                        <div
                          key={`${edit?.path ?? "edit"}-${editIndex}`}
                          className="rounded border border-zinc-800 p-2"
                        >
                          <p>
                            <span className="text-zinc-400">Path:</span> {edit?.path ?? "-"}
                          </p>
                          <p>
                            <span className="text-zinc-400">Purpose:</span> {edit?.purpose ?? "-"}
                          </p>
                          <p className="whitespace-pre-wrap">
                            <span className="text-zinc-400">Change summary:</span>{" "}
                            {edit?.change_summary ?? "-"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {(action?.status === "edits_validated" ||
                action?.status === "edits_validation_failed") && (
                <div className="space-y-2">
                  <p>
                    <span className="text-zinc-400">Validation valid:</span>{" "}
                    {typeof payload?.valid === "boolean"
                      ? payload.valid
                        ? "Sí"
                        : "No"
                      : payload?.validation?.valid === true
                      ? "Sí"
                      : payload?.validation?.valid === false
                      ? "No"
                      : "-"}
                  </p>

                  {Array.isArray(payload?.reasons) && payload.reasons.length > 0 && (
                    <div>
                      <p className="text-zinc-400">Validation reasons</p>
                      {renderStringArray(payload.reasons)}
                    </div>
                  )}

                  {payload?.source_action_status && (
                    <p>
                      <span className="text-zinc-400">Source action status:</span>{" "}
                      {payload.source_action_status}
                    </p>
                  )}

                  {Array.isArray(payload?.file_validations) &&
                    payload.file_validations.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-zinc-400">File validations</p>
                        {payload.file_validations.map((fv: any, fvIndex: number) => (
                          <div
                            key={`${fv?.path ?? "fv"}-${fvIndex}`}
                            className="rounded border border-zinc-800 p-2"
                          >
                            <p>
                              <span className="text-zinc-400">Path:</span> {fv?.path ?? "-"}
                            </p>
                            <p>
                              <span className="text-zinc-400">Valid:</span>{" "}
                              {typeof fv?.valid === "boolean" ? (fv.valid ? "Sí" : "No") : "-"}
                            </p>
                            {Array.isArray(fv?.reasons) && fv.reasons.length > 0 && (
                              <div>
                                <p className="text-zinc-400">Reasons</p>
                                {renderStringArray(fv.reasons)}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              )}

              {(action?.status === "local_checks_passed" ||
                action?.status === "local_checks_failed" ||
                action?.status === "local_checks_inconclusive") && (
                <div className="space-y-2">
                  {Array.isArray(payload?.checks) && payload.checks.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-zinc-400">Checks</p>
                      {payload.checks.map((check: any, checkIndex: number) => (
                        <div
                          key={`${check?.name ?? "check"}-${checkIndex}`}
                          className="rounded border border-zinc-800 p-2"
                        >
                          <p>
                            <span className="text-zinc-400">Name:</span> {check?.name ?? "-"}
                          </p>
                          <p>
                            <span className="text-zinc-400">Command:</span>{" "}
                            {check?.command ?? "-"}
                          </p>
                          <p>
                            <span className="text-zinc-400">Ok:</span>{" "}
                            {typeof check?.ok === "boolean" ? (check.ok ? "Sí" : "No") : "-"}
                          </p>
                          <p>
                            <span className="text-zinc-400">Skipped:</span>{" "}
                            {typeof check?.skipped === "boolean"
                              ? check.skipped
                                ? "Sí"
                                : "No"
                              : "-"}
                          </p>
                          <p>
                            <span className="text-zinc-400">Exit code:</span>{" "}
                            {check?.exit_code ?? "-"}
                          </p>
                          {check?.stdout && (
                            <pre className="overflow-auto rounded bg-zinc-900 p-2 text-xs whitespace-pre-wrap">
                              {check.stdout}
                            </pre>
                          )}
                          {check?.stderr && (
                            <pre className="overflow-auto rounded bg-zinc-900 p-2 text-xs whitespace-pre-wrap">
                              {check.stderr}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {action?.status === "pr_created" && (
                <div className="space-y-2">
                  <p>
                    <span className="text-zinc-400">PR number:</span>{" "}
                    {pullRequest?.number ?? "-"}
                  </p>
                  <p>
                    <span className="text-zinc-400">PR title:</span>{" "}
                    {pullRequest?.title ?? "-"}
                  </p>
                  <p>
                    <span className="text-zinc-400">PR state:</span>{" "}
                    {pullRequest?.state ?? "-"}
                  </p>
                  <p>
                    <span className="text-zinc-400">Base:</span>{" "}
                    {pullRequest?.base ?? "-"}
                  </p>
                  <p>
                    <span className="text-zinc-400">Head:</span>{" "}
                    {pullRequest?.head ?? "-"}
                  </p>

                  {Array.isArray(payload?.files) && payload.files.length > 0 && (
                    <div>
                      <p className="text-zinc-400">Files</p>
                      <div className="space-y-2">
                        {payload.files.map((file: any, fileIndex: number) => (
                          <div
                            key={`${file?.path ?? "file"}-${file?.commit_sha ?? fileIndex}`}
                            className="rounded border border-zinc-800 p-2"
                          >
                            <p>
                              <span className="text-zinc-400">Path:</span> {file?.path ?? "-"}
                            </p>
                            <p>
                              <span className="text-zinc-400">Content SHA:</span>{" "}
                              {file?.content_sha ?? "-"}
                            </p>
                            <p>
                              <span className="text-zinc-400">Commit SHA:</span>{" "}
                              {file?.commit_sha ?? "-"}
                            </p>
                            {file?.commit_url && (
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

              {action?.status === "pr_failed" && (
                <div className="space-y-2">
                  {payload?.stage && (
                    <p>
                      <span className="text-zinc-400">Stage:</span> {payload.stage}
                    </p>
                  )}
                  {payload?.error && (
                    <p className="whitespace-pre-wrap">
                      <span className="text-zinc-400">Error:</span> {payload.error}
                    </p>
                  )}
                  {Array.isArray(payload?.partial_files) && payload.partial_files.length > 0 && (
                    <div>
                      <p className="text-zinc-400">Partial files</p>
                      {renderStringArray(payload.partial_files)}
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}