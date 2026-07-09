"use client";

import { useActionState, useState, useTransition } from "react";
import { Heart, BadgeCheck } from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";
import { submitTrainingComment, type TrainingCommentFormState } from "@/actions/training-comments";
import { toggleCommentLike } from "@/actions/comment-likes";
import type { TrainingCommentEntry } from "@/components/trainings/types";

const initialState: TrainingCommentFormState = { status: "idle" };

function LikeButton({
  commentId,
  initialCount,
  initialLiked,
  loggedIn,
  label,
}: {
  commentId: string;
  initialCount: number;
  initialLiked: boolean;
  loggedIn: boolean;
  label: string;
}) {
  const [count, setCount] = useState(initialCount);
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, startTransition] = useTransition();

  if (!loggedIn) {
    return (
      <span className="flex items-center gap-1 text-xs text-text-muted">
        <Heart size={14} /> {count}
      </span>
    );
  }

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        setLiked(!liked);
        setCount((c) => (liked ? c - 1 : c + 1));
        startTransition(() => {
          toggleCommentLike(commentId);
        });
      }}
      aria-label={label}
      className={`flex items-center gap-1 text-xs transition-colors ${
        liked ? "text-accent" : "text-text-muted hover:text-accent"
      }`}
    >
      <Heart size={14} fill={liked ? "currentColor" : "none"} /> {count}
    </button>
  );
}

export function TrainingComments({
  trainingId,
  comments,
  loggedIn,
}: {
  trainingId: string;
  comments: TrainingCommentEntry[];
  loggedIn: boolean;
}) {
  const { dict, locale } = useDictionary();
  const [state, formAction, isPending] = useActionState(submitTrainingComment, initialState);

  return (
    <div>
      {comments.length > 0 && (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl bg-surface-alt p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <p className="font-display text-sm font-semibold">{comment.authorName}</p>
                  {comment.userId && (
                    <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
                      <BadgeCheck size={12} /> {dict.trainings.verifiedBadge}
                    </span>
                  )}
                </div>
                <LikeButton
                  commentId={comment.id}
                  initialCount={comment.likesCount}
                  initialLiked={comment.likedByCurrentUser}
                  loggedIn={loggedIn}
                  label={dict.trainings.likeButton}
                />
              </div>
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
          {!loggedIn && (
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
          )}
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
