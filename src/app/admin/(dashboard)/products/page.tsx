import { prisma } from "@/lib/prisma";
import { upsertProduct, deleteProduct } from "@/actions/admin/products";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField, TextArea, SelectField } from "@/components/admin/fields";

const typeOptions = [
  { value: "EBOOK", label: "E-book" },
  { value: "TEMPLATE", label: "Template" },
  { value: "PRESET", label: "Preset" },
  { value: "OTHER", label: "Autre" },
];

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({ orderBy: { order: "asc" }, include: { category: true } }),
    prisma.trainingCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.nameFr }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Boutique numérique</h1>
      <p className="mt-1 text-sm text-text-muted">
        Produits numériques vendus à l&apos;unité (e-books, templates, presets). Pensez à créer les catégories de
        formation avant d&apos;ajouter des produits.
      </p>

      <div className="mt-8 space-y-4">
        {products.map((product) => (
          <details key={product.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">
              {product.titleFr} {product.published ? "" : "(brouillon)"}
            </summary>
            <form action={upsertProduct} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={product.id} />
              <TextField name="slug" label="Slug (URL)" defaultValue={product.slug} />
              <SelectField
                name="categoryId"
                label="Catégorie"
                defaultValue={product.categoryId}
                options={categoryOptions}
              />
              <SelectField name="type" label="Type" defaultValue={product.type} options={typeOptions} />
              <TextField name="priceXaf" label="Prix (FCFA)" type="number" defaultValue={String(product.priceXaf)} />
              <TextField name="titleFr" label="Titre (FR)" defaultValue={product.titleFr} />
              <TextField name="titleEn" label="Titre (EN)" defaultValue={product.titleEn} />
              <TextArea name="descriptionFr" label="Description (FR)" defaultValue={product.descriptionFr} full />
              <TextArea name="descriptionEn" label="Description (EN)" defaultValue={product.descriptionEn} full />
              <TextField name="order" label="Ordre" type="number" defaultValue={String(product.order)} />
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Image de couverture (JPG/PNG)
                </label>
                <input
                  type="file"
                  name="coverImage"
                  accept="image/*"
                  className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
                />
                {product.coverImagePath && (
                  <p className="mt-1 truncate text-xs text-text-muted">Actuelle : {product.coverImagePath}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Fichier livré à l&apos;achat (PDF/ZIP, laisser vide pour conserver l&apos;actuel)
                </label>
                <input
                  type="file"
                  name="file"
                  accept=".pdf,.zip"
                  className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
                />
                <p className="mt-1 truncate text-xs text-text-muted">Actuel : {product.filePath}</p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={product.published} />
                Publié
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deleteProduct} id={product.id} />
            </div>
          </details>
        ))}
        {products.length === 0 && <p className="text-sm text-text-muted">Aucun produit pour le moment.</p>}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter un produit</h2>
        <form action={upsertProduct} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField name="slug" label="Slug (URL)" />
          <SelectField name="categoryId" label="Catégorie" options={categoryOptions} />
          <SelectField name="type" label="Type" defaultValue="OTHER" options={typeOptions} />
          <TextField name="priceXaf" label="Prix (FCFA)" type="number" defaultValue="0" />
          <TextField name="titleFr" label="Titre (FR)" />
          <TextField name="titleEn" label="Titre (EN)" />
          <TextArea name="descriptionFr" label="Description (FR)" full />
          <TextArea name="descriptionEn" label="Description (EN)" full />
          <TextField name="order" label="Ordre" type="number" defaultValue="0" />
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Image de couverture (JPG/PNG)
            </label>
            <input
              type="file"
              name="coverImage"
              accept="image/*"
              className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Fichier livré à l&apos;achat (PDF/ZIP)
            </label>
            <input
              type="file"
              name="file"
              accept=".pdf,.zip"
              required
              className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked />
            Publié
          </label>
          <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
