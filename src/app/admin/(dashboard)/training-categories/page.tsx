import { prisma } from "@/lib/prisma";
import { upsertTrainingCategory, deleteTrainingCategory } from "@/actions/admin/trainings";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField } from "@/components/admin/fields";

export default async function AdminTrainingCategoriesPage() {
  const categories = await prisma.trainingCategory.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Catégories formations</h1>
      <p className="mt-1 text-sm text-text-muted">
        Ces catégories servent à classer les formations de la section « Formations & Tutoriels ».
      </p>

      <div className="mt-8 space-y-4">
        {categories.map((cat) => (
          <details key={cat.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">
              {cat.nameFr} <span className="text-xs text-text-muted">/{cat.slug}</span>
            </summary>
            <form action={upsertTrainingCategory} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={cat.id} />
              <TextField name="slug" label="Slug" defaultValue={cat.slug} />
              <TextField name="order" label="Ordre" type="number" defaultValue={String(cat.order)} />
              <TextField name="nameFr" label="Nom (FR)" defaultValue={cat.nameFr} />
              <TextField name="nameEn" label="Nom (EN)" defaultValue={cat.nameEn} />
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deleteTrainingCategory} id={cat.id} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter une catégorie</h2>
        <form action={upsertTrainingCategory} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField name="slug" label="Slug" />
          <TextField name="order" label="Ordre" type="number" defaultValue="0" />
          <TextField name="nameFr" label="Nom (FR)" />
          <TextField name="nameEn" label="Nom (EN)" />
          <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
