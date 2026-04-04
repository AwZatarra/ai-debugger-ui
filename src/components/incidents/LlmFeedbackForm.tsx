"use client";

import { useState } from "react";
import { incidentApi } from "@/src/lib/api";

type Props = {
  incidentId: string;
  onSubmitted?: () => void | Promise<void>;
};

export default function LlmFeedbackForm({ incidentId, onSubmitted }: Props) {
  const [reviewer, setReviewer] = useState("pool");
  const [verdict, setVerdict] = useState("correct");
  const [selectedRank, setSelectedRank] = useState("1");
  const [selectedCause, setSelectedCause] = useState("");
  const [actualRootCause, setActualRootCause] = useState("");
  const [actualFix, setActualFix] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage(null);

      await incidentApi.submitLlmCauseRankingFeedback(incidentId, {
        reviewer: reviewer.trim(),
        verdict,
        selected_rank: Number(selectedRank),
        selected_cause: selectedCause.trim(),
        actual_root_cause: actualRootCause.trim(),
        actual_fix: actualFix.trim(),
        notes: notes.trim(),
      });

      setMessage("Feedback guardado correctamente.");

      await onSubmitted?.();
    } catch (error: any) {
      setMessage(`Error guardando feedback: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h3 className="mb-3 text-lg font-semibold">Registrar feedback LLM</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <label className="block text-sm text-zinc-400">Reviewer</label>
            <input
              type="text"
              value={reviewer}
              onChange={(e) => setReviewer(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm text-zinc-400">Verdict</label>
            <select
              value={verdict}
              onChange={(e) => setVerdict(e.target.value)}
              className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
            >
              <option value="correct">correct</option>
              <option value="partially_correct">partially_correct</option>
              <option value="incorrect">incorrect</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">Selected rank</label>
          <input
            type="number"
            min="1"
            value={selectedRank}
            onChange={(e) => setSelectedRank(e.target.value)}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">Selected cause</label>
          <textarea
            value={selectedCause}
            onChange={(e) => setSelectedCause(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">Actual root cause</label>
          <textarea
            value={actualRootCause}
            onChange={(e) => setActualRootCause(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">Actual fix</label>
          <textarea
            value={actualFix}
            onChange={(e) => setActualFix(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm text-zinc-400">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="rounded bg-white px-4 py-2 text-sm font-medium text-black disabled:opacity-50"
          >
            {loading ? "Guardando..." : "Guardar feedback"}
          </button>

          {message && <p className="text-sm text-zinc-300">{message}</p>}
        </div>
      </form>
    </section>
  );
}