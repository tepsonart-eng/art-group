import { prisma } from "@/lib/prisma";
import { upsertTestimonial, deleteTestimonial } from "@/actions/admin/testimonials";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField, TextArea } from "@/components/admin/fields";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Témoignages</h1>
      <p className="mt-1 text-sm text-text-muted">Carrousel « Comme eux, faites-nous confiance ».</p>

      <div className="mt-8 space-y-4">
        {testimonials.map((t) => (
          <details key={t.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">
              {t.clientName} {t.companyName ? `— ${t.companyName}` : ""}
            </summary>
            <form action={upsertTestimonial} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={t.id} />
              <TextField name="clientName" label="Nom" defaultValue={t.clientName} />
              <TextField name="clientRole" label="Fonction" defaultValue={t.clientRole} />
              <TextField name="companyName" label="Entreprise" defaultValue={t.companyName} />
              <TextField name="colorHex" label="Couleur badge" type="color" defaultValue={t.colorHex} />
              <TextArea name="quoteFr" label="Citation (FR)" defaultValue={t.quoteFr} full />
              <TextArea name="quoteEn" label="Citation (EN)" defaultValue={t.quoteEn} full />
              <TextField name="rating" label="Note (1-5)" type="number" defaultValue={String(t.rating)} />
              <TextField name="order" label="Ordre" type="number" defaultValue={String(t.order)} />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="verified" defaultChecked={t.verified} />
                Client vérifié
              </label>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deleteTestimonial} id={t.id} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter un témoignage</h2>
        <form action={upsertTestimonial} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField name="clientName" label="Nom" />
          <TextField name="clientRole" label="Fonction" />
          <TextField name="companyName" label="Entreprise" />
          <TextField name="colorHex" label="Couleur badge" type="color" defaultValue="#e11d2e" />
          <TextArea name="quoteFr" label="Citation (FR)" full />
          <TextArea name="quoteEn" label="Citation (EN)" full />
          <TextField name="rating" label="Note (1-5)" type="number" defaultValue="5" />
          <TextField name="order" label="Ordre" type="number" defaultValue="0" />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="verified" defaultChecked />
            Client vérifié
          </label>
          <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
