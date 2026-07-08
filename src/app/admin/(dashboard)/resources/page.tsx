import { prisma } from "@/lib/prisma";
import { upsertResource, deleteResource } from "@/actions/admin/resources";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField, TextArea, SelectField } from "@/components/admin/fields";
import { formatFileSize } from "@/lib/format";

const typeOptions = [
  { value: "EBOOK", label: "E-book" },
  { value: "GUIDE", label: "Guide pratique" },
  { value: "COURSE_MATERIAL", label: "Support de cours" },
  { value: "CHECKLIST", label: "Checklist" },
  { value: "TECHNICAL_SHEET", label: "Fiche technique" },
  { value: "EDUCATIONAL_DOCUMENT", label: "Document pédagogique" },
  { value: "OTHER", label: "Ressource téléchargeable" },
];

export default async function AdminResourcesPage() {
  const [resources, categories] = await Promise.all([
    prisma.resource.findMany({ orderBy: { order: "asc" }, include: { category: true } }),
    prisma.trainingCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.nameFr }));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Ressources PDF</h1>
      <p className="mt-1 text-sm text-text-muted">
        Bibliothèque de documents téléchargeables (e-books, guides, checklists...). Pensez à créer les catégories
        de formation avant d&apos;ajouter des ressources.
      </p>

      <div className="mt-8 space-y-4">
        {resources.map((resource) => (
          <details key={resource.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">
              {resource.titleFr} {resource.published ? "" : "(brouillon)"}
            </summary>
            <form action={upsertResource} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={resource.id} />
              <SelectField
                name="categoryId"
                label="Catégorie"
                defaultValue={resource.categoryId}
                options={categoryOptions}
              />
              <SelectField name="type" label="Type" defaultValue={resource.type} options={typeOptions} />
              <TextField name="titleFr" label="Titre (FR)" defaultValue={resource.titleFr} />
              <TextField name="titleEn" label="Titre (EN)" defaultValue={resource.titleEn} />
              <TextArea name="descriptionFr" label="Description (FR)" defaultValue={resource.descriptionFr} full />
              <TextArea name="descriptionEn" label="Description (EN)" defaultValue={resource.descriptionEn} full />
              <TextField name="order" label="Ordre" type="number" defaultValue={String(resource.order)} />
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
                {resource.coverImagePath && (
                  <p className="mt-1 truncate text-xs text-text-muted">Actuelle : {resource.coverImagePath}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Fichier PDF (laisser vide pour conserver l&apos;actuel)
                </label>
                <input
                  type="file"
                  name="file"
                  accept="application/pdf"
                  className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
                />
                <p className="mt-1 truncate text-xs text-text-muted">
                  Actuel : {resource.filePath} ({formatFileSize(resource.fileSizeBytes)})
                </p>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={resource.published} />
                Publiée
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deleteResource} id={resource.id} />
            </div>
          </details>
        ))}
        {resources.length === 0 && <p className="text-sm text-text-muted">Aucune ressource pour le moment.</p>}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter une ressource</h2>
        <form action={upsertResource} className="mt-4 grid gap-3 sm:grid-cols-2">
          <SelectField name="categoryId" label="Catégorie" options={categoryOptions} />
          <SelectField name="type" label="Type" defaultValue="OTHER" options={typeOptions} />
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
              Fichier PDF
            </label>
            <input
              type="file"
              name="file"
              accept="application/pdf"
              required
              className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked />
            Publiée
          </label>
          <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
