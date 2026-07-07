"use client";

import { useActionState } from "react";
import { useDictionary } from "@/components/dictionary-provider";
import { submitTrainingComment, type TrainingCommentFormState } from "@/actions/training-comments";
import type { TrainingCommentEntry } from "@/components/trainings/types";

const initialState: TrainingCommentFormState = { status: "idle" };

export function TrainingComments({
  trainingId,
  comments,
}: {
  trainingId: string;
  comments: TrainingCommentEntry[];
}) {
  const { dict, locale } = useDictionary();
  const [state, formAction, isPending] = useActionState(submitTrainingComment, initialState);

  return (
    <div>
      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl bg-surface-alt p-4">
              <p className="font-display text-sm font-semibold">{comment.authorName}</p>
              <p className="mt-1 text-xs text-text-muted">
                {new Date(comment.createdAt).toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")}
              </p>
              <p className="mt-2 text-sm text-text-muted">{comment.comment}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 rounded-2xl bg-surface-alt p-6">
        <h3 className="font-display text-lg font-bold">{dict.trainings.commentFormTitle}</h3>
        <form action={formAction} className="mt-4 space-y-4">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <input type="hidden" name="trainingId" value={trainingId} />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
                {dict.trainings.commentNameLabel}
              </label>
              <input
                name="authorName"
                required
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
                {dict.trainings.commentEmailLabel}
              </label>
              <input
                type="email"
                name="authorEmail"
                required
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
              {dict.trainings.commentLabel}
            </label>
            <textarea
              name="comment"
              required
              rows={3}
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <button type="submit" disabled={isPending} className="btn-pill-solid w-full justify-center">
            {isPending ? dict.reviews.submitting : dict.trainings.commentSubmit}
          </button>
          {state.status === "success" && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
              {dict.trainings.commentPendingNotice}
            </p>
          )}
          {state.status === "error" && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
              {dict.reviews.errorNotice}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
