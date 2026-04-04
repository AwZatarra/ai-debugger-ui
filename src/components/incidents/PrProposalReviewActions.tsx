"use client";

import { useState } from "react";
import { incidentApi } from "@/src/lib/api";

type Props = {
  proposalId: string;
  status: string;
  initialNotes?: string;
  onReviewed?: () => void | Promise<void>;
};

const REVIEWER = "pool";

export default function PrProposalReviewActions({
  proposalId,
  status,
  initialNotes = "",
  onReviewed,
}: Props) {
  const [notes, setNotes] = useState(initialNotes);
  const [loadingApprove, setLoadingApprove] = useState(false);
  const [loadingReject, setLoadingReject] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  if (!proposalId || status !== "pending_review") {
    return null;
  }

  const handleApprove = async () => {
    try {
      setLoadingApprove(true);
      setMessage(null);

      await incidentApi.approvePrProposal(proposalId, {
        reviewer: REVIEWER,
        notes: notes.trim(),
      });

      setMessage("Proposal aprobada correctamente.");
      await onReviewed?.();
    } catch (error: any) {
      setMessage(`Error aprobando proposal: ${error.message}`);
    } finally {
      setLoadingApprove(false);
    }
  };

  const handleReject = async () => {
    try {
      setLoadingReject(true);
      setMessage(null);

      await incidentApi.rejectPrProposal(proposalId, {
        reviewer: REVIEWER,
        notes: notes.trim(),
      });

      setMessage("Proposal rechazada correctamente.");
      await onReviewed?.();
    } catch (error: any) {
      setMessage(`Error rechazando proposal: ${error.message}`);
    } finally {
      setLoadingReject(false);
    }
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-3 space-y-3">
      <p className="text-zinc-300 font-medium">Human review</p>

      <div className="space-y-2">
        <label className="block text-sm text-zinc-400">Review notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none"
          placeholder="Agrega notas de revisión..."
        />
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleApprove}
          disabled={loadingApprove || loadingReject}
          className="rounded bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loadingApprove ? "Approving..." : "Approve proposal"}
        </button>

        <button
          onClick={handleReject}
          disabled={loadingApprove || loadingReject}
          className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loadingReject ? "Rejecting..." : "Reject proposal"}
        </button>
      </div>

      {message && <p className="text-sm text-zinc-300">{message}</p>}
    </div>
  );
}