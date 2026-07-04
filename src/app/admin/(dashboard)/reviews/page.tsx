import { prisma } from "@/lib/prisma";
import { setReviewStatus, deleteReview, banReviewIp, unbanIp } from "@/actions/admin/reviews";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminReviewsPage() {
  const [reviews, bannedIps] = await Promise.all([
    prisma.review.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.bannedIp.findMany({ orderBy: { createdAt: "desc" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Avis clients</h1>
      <p className="mt-1 text-sm text-text-muted">
        Modérez les avis soumis publiquement. Les avis approuvés apparaissent dans la section « Avis clients ».
      </p>

      <div className="mt-8 space-y-3">
        {reviews.map((review) => (
          <div key={review.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display font-semibold">
                  {review.authorName} <span className="text-xs text-text-muted">({review.authorEmail})</span>
                </p>
                <p className="text-xs text-text-muted">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)} · {review.status} · IP {review.ipAddress}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <form action={setReviewStatus}>
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="status" value="APPROVED" />
                  <button type="submit" className="text-xs font-semibold text-green-700 hover:underline">
                    Approuver
                  </button>
                </form>
                <form action={setReviewStatus}>
                  <input type="hidden" name="id" value={review.id} />
                  <input type="hidden" name="status" value="HIDDEN" />
                  <button type="submit" className="text-xs font-semibold text-amber-700 hover:underline">
                    Masquer
                  </button>
                </form>
                <form action={banReviewIp}>
                  <input type="hidden" name="id" value={review.id} />
                  <button type="submit" className="text-xs font-semibold text-red-700 hover:underline">
                    Bannir l&apos;IP
                  </button>
                </form>
                <DeleteButton action={deleteReview} id={review.id} />
              </div>
            </div>
            <p className="mt-3 text-sm text-text-muted">{review.comment}</p>
          </div>
        ))}
        {reviews.length === 0 && <p className="text-sm text-text-muted">Aucun avis pour le moment.</p>}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-semibold">IP bannies</h2>
        <div className="mt-3 space-y-2">
          {bannedIps.map((banned) => (
            <div
              key={banned.id}
              className="flex items-center justify-between rounded-lg border border-line bg-surface-alt px-4 py-2 text-sm"
            >
              <span>
                {banned.ip} — {banned.reason}
              </span>
              <form action={unbanIp}>
                <input type="hidden" name="id" value={banned.id} />
                <button type="submit" className="text-xs font-semibold text-accent hover:underline">
                  Débannir
                </button>
              </form>
            </div>
          ))}
          {bannedIps.length === 0 && <p className="text-sm text-text-muted">Aucune IP bannie.</p>}
        </div>
      </div>
    </div>
  );
}
