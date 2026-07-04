import { prisma } from "@/lib/prisma";
import { upsertCategory, deleteCategory } from "@/actions/admin/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField, TextArea } from "@/components/admin/fields";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Compétences (page d&apos;accueil)</h1>
      <p className="mt-1 text-sm text-text-muted">
        Chaque carte affichée dans la section « Nos offres de films et contenus audiovisuels ».
      </p>

      <div className="mt-8 space-y-4">
        {categories.map((cat) => (
          <details key={cat.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">
              {cat.titleFr} <span className="text-xs text-text-muted">/{cat.slug}</span>
            </summary>
            <form action={upsertCategory} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={cat.id} />
              <TextField name="slug" label="Slug" defaultValue={cat.slug} />
              <TextField name="order" label="Ordre" defaultValue={String(cat.order)} type="number" />
              <TextField name="titleFr" label="Titre (FR)" defaultValue={cat.titleFr} />
              <TextField name="titleEn" label="Titre (EN)" defaultValue={cat.titleEn} />
              <TextArea
                name="itemsFr"
                label="Liste des prestations (FR, une par ligne)"
                defaultValue={cat.itemsFr}
                full
              />
              <TextArea
                name="itemsEn"
                label="Liste des prestations (EN, une par ligne)"
                defaultValue={cat.itemsEn}
                full
              />
              <TextField name="colorFrom" label="Couleur dégradé (début)" defaultValue={cat.colorFrom} type="color" />
              <TextField name="colorTo" label="Couleur dégradé (fin)" defaultValue={cat.colorTo} type="color" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="visualOnly" defaultChecked={cat.visualOnly} />
                Visuel uniquement (sans liste, ex. « Vidéos musicales & d&apos;art »)
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deleteCategory} id={cat.id} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter une catégorie</h2>
        <form action={upsertCategory} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField name="slug" label="Slug" />
          <TextField name="order" label="Ordre" type="number" defaultValue="0" />
          <TextField name="titleFr" label="Titre (FR)" />
          <TextField name="titleEn" label="Titre (EN)" />
          <TextArea name="itemsFr" label="Liste des prestations (FR)" full />
          <TextArea name="itemsEn" label="Liste des prestations (EN)" full />
          <TextField name="colorFrom" label="Couleur dégradé (début)" type="color" defaultValue="#e11d2e" />
          <TextField name="colorTo" label="Couleur dégradé (fin)" type="color" defaultValue="#111111" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="visualOnly" />
            Visuel uniquement
          </label>
          <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
