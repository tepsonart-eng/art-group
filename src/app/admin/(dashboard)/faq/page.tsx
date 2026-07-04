import { prisma } from "@/lib/prisma";
import { upsertFaqItem, deleteFaqItem } from "@/actions/admin/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField, TextArea } from "@/components/admin/fields";

export default async function AdminFaqPage() {
  const items = await prisma.faqItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">FAQ</h1>
      <p className="mt-1 text-sm text-text-muted">Questions fréquentes affichées dans « En savoir plus ».</p>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <details key={item.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">{item.questionFr}</summary>
            <form action={upsertFaqItem} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={item.id} />
              <TextField name="order" label="Ordre" type="number" defaultValue={String(item.order)} />
              <div />
              <TextField name="questionFr" label="Question (FR)" defaultValue={item.questionFr} />
              <TextField name="questionEn" label="Question (EN)" defaultValue={item.questionEn} />
              <TextArea name="answerFr" label="Réponse (FR)" defaultValue={item.answerFr} full />
              <TextArea name="answerEn" label="Réponse (EN)" defaultValue={item.answerEn} full />
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deleteFaqItem} id={item.id} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter une question</h2>
        <form action={upsertFaqItem} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField name="order" label="Ordre" type="number" defaultValue="0" />
          <div />
          <TextField name="questionFr" label="Question (FR)" />
          <TextField name="questionEn" label="Question (EN)" />
          <TextArea name="answerFr" label="Réponse (FR)" full />
          <TextArea name="answerEn" label="Réponse (EN)" full />
          <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
