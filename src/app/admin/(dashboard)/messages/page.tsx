import { prisma } from "@/lib/prisma";
import { markMessageRead, deleteMessage } from "@/actions/admin/messages";
import { DeleteButton } from "@/components/admin/delete-button";

export default async function AdminMessagesPage() {
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Messages reçus</h1>
      <p className="mt-1 text-sm text-text-muted">Messages envoyés depuis le formulaire de contact du site.</p>

      <div className="mt-8 space-y-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`rounded-xl border p-4 ${
              message.read ? "border-line bg-surface-alt" : "border-accent bg-accent-soft"
            }`}
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="font-display font-semibold">
                  {message.name} {message.company ? `— ${message.company}` : ""}
                </p>
                <p className="text-xs text-text-muted">
                  {message.email} · {message.phone} · Budget : {message.budget || "non précisé"}
                </p>
                <p className="mt-1 text-xs text-text-muted">
                  {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(
                    message.createdAt
                  )}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {!message.read && (
                  <form action={markMessageRead}>
                    <input type="hidden" name="id" value={message.id} />
                    <button type="submit" className="text-xs font-semibold text-accent hover:underline">
                      Marquer comme lu
                    </button>
                  </form>
                )}
                {message.attachmentPath && (
                  <a
                    href={`/admin/messages/${message.id}/attachment`}
                    className="text-xs font-semibold text-accent hover:underline"
                  >
                    Télécharger la pièce jointe
                  </a>
                )}
                <DeleteButton action={deleteMessage} id={message.id} />
              </div>
            </div>
            <p className="mt-3 text-sm font-semibold">{message.subject}</p>
            <p className="mt-1 text-sm text-text-muted whitespace-pre-line">{message.message}</p>
          </div>
        ))}
        {messages.length === 0 && <p className="text-sm text-text-muted">Aucun message pour le moment.</p>}
      </div>
    </div>
  );
}
