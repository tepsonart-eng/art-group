import { prisma } from "@/lib/prisma";
import { upsertCommitmentItem, deleteCommitmentItem } from "@/actions/admin/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField, TextArea, SelectField } from "@/components/admin/fields";

const ICONS = [
  { value: "sparkles", label: "Étincelles" },
  { value: "shield", label: "Bouclier" },
  { value: "gauge", label: "Jauge" },
  { value: "leaf", label: "Feuille" },
];

export default async function AdminCommitmentsPage() {
  const items = await prisma.commitmentItem.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Nos engagements clients</h1>
      <p className="mt-1 text-sm text-text-muted">
        Les 3 rubriques (ex. Agilité, Exigence, Flexibilité) affichées dans « En savoir plus ».
      </p>

      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <details key={item.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">{item.titleFr}</summary>
            <form action={upsertCommitmentItem} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={item.id} />
              <SelectField name="iconKey" label="Icône" defaultValue={item.iconKey} options={ICONS} />
              <TextField name="order" label="Ordre" type="number" defaultValue={String(item.order)} />
              <TextField name="titleFr" label="Titre (FR)" defaultValue={item.titleFr} />
              <TextField name="titleEn" label="Titre (EN)" defaultValue={item.titleEn} />
              <TextArea name="textFr" label="Texte (FR)" defaultValue={item.textFr} full />
              <TextArea name="textEn" label="Texte (EN)" defaultValue={item.textEn} full />
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deleteCommitmentItem} id={item.id} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter un engagement</h2>
        <form action={upsertCommitmentItem} className="mt-4 grid gap-3 sm:grid-cols-2">
          <SelectField name="iconKey" label="Icône" options={ICONS} />
          <TextField name="order" label="Ordre" type="number" defaultValue="0" />
          <TextField name="titleFr" label="Titre (FR)" />
          <TextField name="titleEn" label="Titre (EN)" />
          <TextArea name="textFr" label="Texte (FR)" full />
          <TextArea name="textEn" label="Texte (EN)" full />
          <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
