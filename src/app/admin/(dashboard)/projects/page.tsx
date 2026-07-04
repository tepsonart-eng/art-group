import { prisma } from "@/lib/prisma";
import { upsertProject, deleteProject } from "@/actions/admin/projects";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField, TextArea } from "@/components/admin/fields";

export default async function AdminProjectsPage() {
  const [projects, tabs] = await Promise.all([
    prisma.project.findMany({ orderBy: { order: "asc" } }),
    prisma.portfolioTab.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Réalisations</h1>
      <p className="mt-1 text-sm text-text-muted">
        Le champ « Catégorie » doit correspondre au slug d&apos;un des filtres définis dans « Filtres réalisations »
        (
        {tabs.map((t) => t.slug).join(", ") || "aucun filtre défini pour le moment"}
        ).
      </p>

      <div className="mt-8 space-y-4">
        {projects.map((project) => (
          <details key={project.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">
              {project.titleFr} {project.published ? "" : "(brouillon)"}
            </summary>
            <form action={upsertProject} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={project.id} />
              <TextField name="slug" label="Slug" defaultValue={project.slug} />
              <TextField name="category" label="Catégorie (slug filtre)" defaultValue={project.category} />
              <TextField name="titleFr" label="Titre (FR)" defaultValue={project.titleFr} />
              <TextField name="titleEn" label="Titre (EN)" defaultValue={project.titleEn} />
              <TextField name="colorFrom" label="Couleur (début)" type="color" defaultValue={project.colorFrom} />
              <TextField name="colorTo" label="Couleur (fin)" type="color" defaultValue={project.colorTo} />
              <TextField name="youtubeUrl" label="URL YouTube" defaultValue={project.youtubeUrl ?? ""} />
              <TextField name="location" label="Lieu" defaultValue={project.location} />
              <TextField name="projectDate" label="Date" defaultValue={project.projectDate} />
              <TextField name="order" label="Ordre" type="number" defaultValue={String(project.order)} />
              <TextArea name="contextFr" label="Contexte (FR)" defaultValue={project.contextFr} full />
              <TextArea name="contextEn" label="Contexte (EN)" defaultValue={project.contextEn} full />
              <TextArea name="objectivesFr" label="Objectifs (FR)" defaultValue={project.objectivesFr} full />
              <TextArea name="objectivesEn" label="Objectifs (EN)" defaultValue={project.objectivesEn} full />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={project.published} />
                Publié
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deleteProject} id={project.id} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter une réalisation</h2>
        <form action={upsertProject} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField name="slug" label="Slug" />
          <TextField name="category" label="Catégorie (slug filtre)" />
          <TextField name="titleFr" label="Titre (FR)" />
          <TextField name="titleEn" label="Titre (EN)" />
          <TextField name="colorFrom" label="Couleur (début)" type="color" defaultValue="#e11d2e" />
          <TextField name="colorTo" label="Couleur (fin)" type="color" defaultValue="#111111" />
          <TextField name="youtubeUrl" label="URL YouTube" />
          <TextField name="location" label="Lieu" />
          <TextField name="projectDate" label="Date" />
          <TextField name="order" label="Ordre" type="number" defaultValue="0" />
          <TextArea name="contextFr" label="Contexte (FR)" full />
          <TextArea name="contextEn" label="Contexte (EN)" full />
          <TextArea name="objectivesFr" label="Objectifs (FR)" full />
          <TextArea name="objectivesEn" label="Objectifs (EN)" full />
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
