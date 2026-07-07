import { prisma } from "@/lib/prisma";
import {
  upsertTraining,
  deleteTraining,
  upsertTrainingLesson,
  deleteTrainingLesson,
  upsertTrainingResource,
  deleteTrainingResource,
  upsertTrainingFaqItem,
  deleteTrainingFaqItem,
} from "@/actions/admin/trainings";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField, TextArea, SelectField } from "@/components/admin/fields";
import { VideoUploadField } from "@/components/admin/video-upload-field";

export default async function AdminTrainingsPage() {
  const [trainings, categories] = await Promise.all([
    prisma.training.findMany({
      orderBy: { order: "asc" },
      include: {
        category: true,
        lessons: { orderBy: { order: "asc" } },
        resources: { orderBy: { order: "asc" } },
        faqItems: { orderBy: { order: "asc" } },
      },
    }),
    prisma.trainingCategory.findMany({ orderBy: { order: "asc" } }),
  ]);

  const categoryOptions = categories.map((c) => ({ value: c.id, label: c.nameFr }));
  const levelOptions = [
    { value: "BEGINNER", label: "Débutant" },
    { value: "INTERMEDIATE", label: "Intermédiaire" },
    { value: "ADVANCED", label: "Avancé" },
  ];
  const sourceOptions = [
    { value: "UPLOAD", label: "Vidéo uploadée" },
    { value: "YOUTUBE", label: "YouTube" },
    { value: "VIMEO", label: "Vimeo" },
    { value: "EXTERNAL", label: "URL externe" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Formations</h1>
      <p className="mt-1 text-sm text-text-muted">
        Créez des formations avec plusieurs leçons vidéo, des ressources PDF et une FAQ dédiée. Pensez à créer les
        catégories de formation avant d&apos;ajouter des formations.
      </p>

      <div className="mt-8 space-y-6">
        {trainings.map((training) => (
          <details key={training.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">
              {training.titleFr} {training.published ? "" : "(brouillon)"}
            </summary>

            <form action={upsertTraining} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={training.id} />
              <TextField name="slug" label="Slug" defaultValue={training.slug} />
              <SelectField
                name="categoryId"
                label="Catégorie"
                defaultValue={training.categoryId}
                options={categoryOptions}
              />
              <TextField name="titleFr" label="Titre (FR)" defaultValue={training.titleFr} />
              <TextField name="titleEn" label="Titre (EN)" defaultValue={training.titleEn} />
              <TextArea name="shortDescFr" label="Description courte (FR)" defaultValue={training.shortDescFr} />
              <TextArea name="shortDescEn" label="Description courte (EN)" defaultValue={training.shortDescEn} />
              <SelectField name="level" label="Niveau" defaultValue={training.level} options={levelOptions} />
              <TextField
                name="durationMinutes"
                label="Durée (minutes)"
                type="number"
                defaultValue={String(training.durationMinutes)}
              />
              <TextField name="order" label="Ordre" type="number" defaultValue={String(training.order)} />
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Miniature (JPG/PNG)
                </label>
                <input
                  type="file"
                  name="thumbnail"
                  accept="image/*"
                  className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
                />
                {training.thumbnailPath && (
                  <p className="mt-1 truncate text-xs text-text-muted">Actuelle : {training.thumbnailPath}</p>
                )}
              </div>
              <TextArea name="presentationFr" label="Présentation (FR)" defaultValue={training.presentationFr} full />
              <TextArea name="presentationEn" label="Présentation (EN)" defaultValue={training.presentationEn} full />
              <TextArea name="objectivesFr" label="Objectifs (FR)" defaultValue={training.objectivesFr} full />
              <TextArea name="objectivesEn" label="Objectifs (EN)" defaultValue={training.objectivesEn} full />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="published" defaultChecked={training.published} />
                Publiée
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer la formation</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deleteTraining} id={training.id} confirmMessage="Supprimer cette formation et tout son contenu (leçons, ressources, FAQ) ?" />
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-accent">Leçons / vidéos</h3>
              <div className="mt-3 space-y-3">
                {training.lessons.map((lesson) => (
                  <details key={lesson.id} className="rounded-lg border border-line bg-surface p-3">
                    <summary className="cursor-pointer text-sm font-semibold">{lesson.titleFr}</summary>
                    <form action={upsertTrainingLesson} className="mt-3 grid gap-3 sm:grid-cols-2">
                      <input type="hidden" name="id" value={lesson.id} />
                      <input type="hidden" name="trainingId" value={training.id} />
                      <TextField name="titleFr" label="Titre (FR)" defaultValue={lesson.titleFr} />
                      <TextField name="titleEn" label="Titre (EN)" defaultValue={lesson.titleEn} />
                      <TextField name="order" label="Ordre" type="number" defaultValue={String(lesson.order)} />
                      <TextField
                        name="durationMinutes"
                        label="Durée (minutes)"
                        type="number"
                        defaultValue={String(lesson.durationMinutes)}
                      />
                      <SelectField
                        name="videoSourceType"
                        label="Source vidéo"
                        defaultValue={lesson.videoSourceType}
                        options={sourceOptions}
                      />
                      <VideoUploadField
                        name="videoFilePath"
                        label="Vidéo uploadée (si source = Vidéo uploadée)"
                        current={lesson.videoFilePath}
                        folder="trainings"
                      />
                      <TextField name="youtubeUrl" label="URL YouTube" defaultValue={lesson.youtubeUrl ?? ""} />
                      <TextField name="vimeoUrl" label="URL Vimeo" defaultValue={lesson.vimeoUrl ?? ""} />
                      <TextField name="externalUrl" label="URL externe" defaultValue={lesson.externalUrl ?? ""} />
                      <div className="sm:col-span-2">
                        <button type="submit" className="btn-pill-solid">Enregistrer la leçon</button>
                      </div>
                    </form>
                    <div className="mt-2">
                      <DeleteButton action={deleteTrainingLesson} id={lesson.id} />
                    </div>
                  </details>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-line p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Ajouter une leçon</p>
                <form action={upsertTrainingLesson} className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="trainingId" value={training.id} />
                  <TextField name="titleFr" label="Titre (FR)" />
                  <TextField name="titleEn" label="Titre (EN)" />
                  <TextField name="order" label="Ordre" type="number" defaultValue="0" />
                  <TextField name="durationMinutes" label="Durée (minutes)" type="number" defaultValue="0" />
                  <SelectField name="videoSourceType" label="Source vidéo" defaultValue="UPLOAD" options={sourceOptions} />
                  <VideoUploadField name="videoFilePath" label="Vidéo uploadée" folder="trainings" />
                  <TextField name="youtubeUrl" label="URL YouTube" />
                  <TextField name="vimeoUrl" label="URL Vimeo" />
                  <TextField name="externalUrl" label="URL externe" />
                  <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter la leçon</button>
                </form>
              </div>
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-accent">Ressources PDF</h3>
              <div className="mt-3 space-y-3">
                {training.resources.map((resource) => (
                  <details key={resource.id} className="rounded-lg border border-line bg-surface p-3">
                    <summary className="cursor-pointer text-sm font-semibold">{resource.titleFr}</summary>
                    <form action={upsertTrainingResource} className="mt-3 grid gap-3 sm:grid-cols-2">
                      <input type="hidden" name="id" value={resource.id} />
                      <input type="hidden" name="trainingId" value={training.id} />
                      <TextField name="titleFr" label="Titre (FR)" defaultValue={resource.titleFr} />
                      <TextField name="titleEn" label="Titre (EN)" defaultValue={resource.titleEn} />
                      <TextField name="order" label="Ordre" type="number" defaultValue={String(resource.order)} />
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
                        <p className="mt-1 truncate text-xs text-text-muted">Actuel : {resource.filePath}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <button type="submit" className="btn-pill-solid">Enregistrer la ressource</button>
                      </div>
                    </form>
                    <div className="mt-2">
                      <DeleteButton action={deleteTrainingResource} id={resource.id} />
                    </div>
                  </details>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-line p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Ajouter une ressource</p>
                <form action={upsertTrainingResource} className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="trainingId" value={training.id} />
                  <TextField name="titleFr" label="Titre (FR)" />
                  <TextField name="titleEn" label="Titre (EN)" />
                  <TextField name="order" label="Ordre" type="number" defaultValue="0" />
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                      Fichier PDF
                    </label>
                    <input
                      type="file"
                      name="file"
                      accept="application/pdf"
                      className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
                    />
                  </div>
                  <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter la ressource</button>
                </form>
              </div>
            </div>

            <div className="mt-6 border-t border-line pt-4">
              <h3 className="font-display text-sm font-bold uppercase tracking-wide text-accent">FAQ de la formation</h3>
              <div className="mt-3 space-y-3">
                {training.faqItems.map((faq) => (
                  <details key={faq.id} className="rounded-lg border border-line bg-surface p-3">
                    <summary className="cursor-pointer text-sm font-semibold">{faq.questionFr}</summary>
                    <form action={upsertTrainingFaqItem} className="mt-3 grid gap-3 sm:grid-cols-2">
                      <input type="hidden" name="id" value={faq.id} />
                      <input type="hidden" name="trainingId" value={training.id} />
                      <TextField name="order" label="Ordre" type="number" defaultValue={String(faq.order)} />
                      <div />
                      <TextField name="questionFr" label="Question (FR)" defaultValue={faq.questionFr} />
                      <TextField name="questionEn" label="Question (EN)" defaultValue={faq.questionEn} />
                      <TextArea name="answerFr" label="Réponse (FR)" defaultValue={faq.answerFr} full />
                      <TextArea name="answerEn" label="Réponse (EN)" defaultValue={faq.answerEn} full />
                      <div className="sm:col-span-2">
                        <button type="submit" className="btn-pill-solid">Enregistrer la question</button>
                      </div>
                    </form>
                    <div className="mt-2">
                      <DeleteButton action={deleteTrainingFaqItem} id={faq.id} />
                    </div>
                  </details>
                ))}
              </div>
              <div className="mt-4 rounded-lg border border-dashed border-line p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">Ajouter une question</p>
                <form action={upsertTrainingFaqItem} className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input type="hidden" name="trainingId" value={training.id} />
                  <TextField name="order" label="Ordre" type="number" defaultValue="0" />
                  <div />
                  <TextField name="questionFr" label="Question (FR)" />
                  <TextField name="questionEn" label="Question (EN)" />
                  <TextArea name="answerFr" label="Réponse (FR)" full />
                  <TextArea name="answerEn" label="Réponse (EN)" full />
                  <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter la question</button>
                </form>
              </div>
            </div>
          </details>
        ))}
        {trainings.length === 0 && (
          <p className="text-sm text-text-muted">Aucune formation pour le moment.</p>
        )}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter une formation</h2>
        <p className="mt-1 text-xs text-text-muted">
          Une fois la formation créée, ouvrez-la ci-dessus pour ajouter ses leçons, ressources et FAQ.
        </p>
        <form action={upsertTraining} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField name="slug" label="Slug" />
          <SelectField name="categoryId" label="Catégorie" options={categoryOptions} />
          <TextField name="titleFr" label="Titre (FR)" />
          <TextField name="titleEn" label="Titre (EN)" />
          <TextArea name="shortDescFr" label="Description courte (FR)" />
          <TextArea name="shortDescEn" label="Description courte (EN)" />
          <SelectField name="level" label="Niveau" defaultValue="BEGINNER" options={levelOptions} />
          <TextField name="durationMinutes" label="Durée (minutes)" type="number" defaultValue="0" />
          <TextField name="order" label="Ordre" type="number" defaultValue="0" />
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Miniature (JPG/PNG)
            </label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
            />
          </div>
          <TextArea name="presentationFr" label="Présentation (FR)" full />
          <TextArea name="presentationEn" label="Présentation (EN)" full />
          <TextArea name="objectivesFr" label="Objectifs (FR)" full />
          <TextArea name="objectivesEn" label="Objectifs (EN)" full />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="published" defaultChecked />
            Publiée
          </label>
          <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter la formation</button>
        </form>
      </div>
    </div>
  );
}
