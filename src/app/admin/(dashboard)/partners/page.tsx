import { prisma } from "@/lib/prisma";
import { upsertPartnerLogo, deletePartnerLogo } from "@/actions/admin/content";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField, SelectField } from "@/components/admin/fields";

const TYPES = [
  { value: "PARTNER", label: "Partenaire" },
  { value: "ARTIST", label: "Artiste" },
];

export default async function AdminPartnersPage() {
  const logos = await prisma.partnerLogo.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Bandeau défilant</h1>
      <p className="mt-1 text-sm text-text-muted">
        Logos de partenaires et photos d&apos;artistes affichés dans le bandeau défilant. Un badge de couleur avec le
        nom sert de repère en attendant les vrais visuels (à téléverser plus tard).
      </p>

      <div className="mt-8 space-y-4">
        {logos.map((logo) => (
          <details key={logo.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">{logo.name}</summary>
            <form action={upsertPartnerLogo} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={logo.id} />
              <TextField name="name" label="Nom" defaultValue={logo.name} />
              <SelectField name="type" label="Type" defaultValue={logo.type} options={TYPES} />
              <TextField name="colorHex" label="Couleur" type="color" defaultValue={logo.colorHex} />
              <TextField name="order" label="Ordre" type="number" defaultValue={String(logo.order)} />
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deletePartnerLogo} id={logo.id} />
            </div>
          </details>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter un logo</h2>
        <form action={upsertPartnerLogo} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField name="name" label="Nom" />
          <SelectField name="type" label="Type" options={TYPES} />
          <TextField name="colorHex" label="Couleur" type="color" defaultValue="#e11d2e" />
          <TextField name="order" label="Ordre" type="number" defaultValue="0" />
          <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
