import { prisma } from "@/lib/prisma";
import {
  setTrainingCommentStatus,
  deleteTrainingComment,
  banTrainingCommentIp,
} from "@/actions/admin/training-comments";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminTrainingCommentsPage() {
  const comments = await prisma.trainingComment.findMany({
    orderBy: { createdAt: "desc" },
    include: { training: { select: { titleFr: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Commentaires formations</h1>
      <p className="mt-1 text-sm text-text-muted">
        Modérez les commentaires soumis publiquement sur les pages de formation. Le bannissement d&apos;IP est
        partagé avec la modération des avis clients.
      </p>

      <div className="mt-8 space-y-3">
        {comments.map((comment) => (
          <div key={comment.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display font-semibold">
                  {comment.authorName} <span className="text-xs text-text-muted">({comment.authorEmail})</span>{" "}
                  <span
                    className={`text-xs font-semibold ${
                      comment.userId ? "text-accent" : "text-text-muted"
                    }`}
                  >
                    {comment.userId ? "Membre" : "Invité"}
                  </span>
                </p>
                <p className="text-xs text-text-muted">
                  Formation : {comment.training.titleFr} · {comment.status} · IP {comment.ipAddress}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <form action={setTrainingCommentStatus}>
                  <input type="hidden" name="id" value={comment.id} />
                  <input type="hidden" name="status" value="APPROVED" />
                  <button type="submit" className="text-xs font-semibold text-green-700 hover:underline">
                    Approuver
                  </button>
                </form>
                <form action={setTrainingCommentStatus}>
                  <input type="hidden" name="id" value={comment.id} />
                  <input type="hidden" name="status" value="HIDDEN" />
                  <button type="submit" className="text-xs font-semibold text-amber-700 hover:underline">
                    Masquer
                  </button>
                </form>
                <form action={banTrainingCommentIp}>
                  <input type="hidden" name="id" value={comment.id} />
                  <button type="submit" className="text-xs font-semibold text-red-700 hover:underline">
                    Bannir l&apos;IP
                  </button>
                </form>
                <DeleteButton action={deleteTrainingComment} id={comment.id} />
              </div>
            </div>
            <p className="mt-3 text-sm text-text-muted">{comment.comment}</p>
          </div>
        ))}
        {comments.length === 0 && <p className="text-sm text-text-muted">Aucun commentaire pour le moment.</p>}
      </div>
    </div>
  );
}
