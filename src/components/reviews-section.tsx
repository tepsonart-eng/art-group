"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";
import { TestimonialCarousel } from "@/components/testimonial-carousel";
import { submitReview, type ReviewFormState } from "@/actions/reviews";

export type ReviewEntry = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
};

const initialState: ReviewFormState = { status: "idle" };

export function ReviewsSection({ reviews }: { reviews: ReviewEntry[] }) {
  const { dict } = useDictionary();
  const [state, formAction, isPending] = useActionState(submitReview, initialState);
  const [rating, setRating] = useState(5);

  const asTestimonials = reviews.map((r) => ({
    id: r.id,
    clientName: r.authorName,
    clientRole: "",
    companyName: "",
    colorHex: "#e11d2e",
    quoteFr: r.comment,
    quoteEn: r.comment,
    rating: r.rating,
    verified: false,
  }));

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="title-composite text-center">
        <h2 className="text-3xl sm:text-4xl">
          <span className="accent-serif">{dict.reviews.titleAccent}</span>{" "}
          <span className="accent-bold">{dict.reviews.titleBold}</span>
        </h2>
        <div className="divider-dots" />
      </div>

      {asTestimonials.length > 0 && (
        <div className="mt-12">
          <TestimonialCarousel items={asTestimonials} />
        </div>
      )}

      <div className="mx-auto mt-14 max-w-xl rounded-2xl bg-surface-alt p-6 sm:p-8">
        <h3 className="font-display text-lg font-bold">{dict.reviews.formTitle}</h3>
        <form action={formAction} className="mt-5 space-y-4">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
                {dict.reviews.nameLabel}
              </label>
              <input
                name="authorName"
                required
                className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
                {dict.reviews.emailLabel}
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
              {dict.reviews.ratingLabel}
            </label>
            <input type="hidden" name="rating" value={rating} />
            <div className="flex gap-1 text-accent">
              {Array.from({ length: 5 }).map((_, i) => (
                <button key={i} type="button" onClick={() => setRating(i + 1)} aria-label={`${i + 1}`}>
                  <Star size={22} fill={i < rating ? "currentColor" : "none"} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
              {dict.reviews.commentLabel}
            </label>
            <textarea
              name="comment"
              required
              rows={3}
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <button type="submit" disabled={isPending} className="btn-pill-solid w-full justify-center">
            {isPending ? dict.reviews.submitting : dict.reviews.submit}
          </button>
          {state.status === "success" && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
              {dict.reviews.pendingNotice}
            </p>
          )}
          {state.status === "error" && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
              {dict.reviews.errorNotice}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
