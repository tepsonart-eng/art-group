import { prisma } from "@/lib/prisma";
import { upsertPortfolioTab, deletePortfolioTab } from "@/actions/admin/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField } from "@/components/admin/fields";

export default async function AdminPortfolioTabsPage() {
  const tabs = await prisma.portfolioTab.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Filtres des réalisations</h1>
      <p className="mt-1 text-sm text-text-muted">
        Onglets de catégories affichés au-dessus de la grille « Nos réalisations ». Le slug doit correspondre à la
        catégorie renseignée sur chaque projet.
      </p>

      <div className="mt-8 space-y-4">
        {tabs.map((tab) => (
          <details key={tab.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">{tab.labelFr}</summary>
            <form action={upsertPortfolioTab} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={tab.id} />
              <TextField name="slug" label="Slug" defaultValue={tab.slug} />
              <TextField name="order" label="Ordre" type="number" defaultValue={String(tab.order)} />
              <TextField name="labelFr" label="Libellé (FR)" defaultValue={tab.labelFr} />
              <TextField name="labelEn" label="Libellé (EN)" defaultValue={tab.labelEn} />
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deletePortfolioTab} id={tab.id} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter un filtre</h2>
        <form action={upsertPortfolioTab} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField name="slug" label="Slug" />
          <TextField name="order" label="Ordre" type="number" defaultValue="0" />
          <TextField name="labelFr" label="Libellé (FR)" />
          <TextField name="labelEn" label="Libellé (EN)" />
          <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
