import { prisma } from "@/lib/prisma";
import { upsertTeamMember, deleteTeamMember } from "@/actions/admin/team";
import { DeleteButton } from "@/components/admin/delete-button";
import { TextField } from "@/components/admin/fields";

export default async function AdminTeamPage() {
  const members = await prisma.teamMember.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Équipe</h1>
      <p className="mt-1 text-sm text-text-muted">
        Membres affichés dans la section « Notre équipe » du site public, juste avant le pied de page. La note (1 à
        5) s&apos;affiche sous forme d&apos;étoiles sous le nom et le rôle de chaque membre.
      </p>

      <div className="mt-8 space-y-4">
        {members.map((member) => (
          <details key={member.id} className="rounded-xl border border-line bg-surface-alt p-4">
            <summary className="cursor-pointer font-display font-semibold">{member.name}</summary>
            <form action={upsertTeamMember} className="mt-4 grid gap-3 sm:grid-cols-2">
              <input type="hidden" name="id" value={member.id} />
              <TextField name="name" label="Nom" defaultValue={member.name} />
              <TextField name="order" label="Ordre" type="number" defaultValue={String(member.order)} />
              <TextField name="roleFr" label="Rôle (FR)" defaultValue={member.roleFr} />
              <TextField name="roleEn" label="Rôle (EN)" defaultValue={member.roleEn} />
              <TextField
                name="rating"
                label="Note (1 à 5 étoiles)"
                type="number"
                defaultValue={String(member.rating)}
              />
              <div>
                <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
                  Photo (JPG/PNG)
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
                />
                {member.photoPath && (
                  <p className="mt-1 truncate text-xs text-text-muted">Actuelle : {member.photoPath}</p>
                )}
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="btn-pill-solid">Enregistrer</button>
              </div>
            </form>
            <div className="mt-3">
              <DeleteButton action={deleteTeamMember} id={member.id} />
            </div>
          </details>
        ))}
        {members.length === 0 && <p className="text-sm text-text-muted">Aucun membre pour le moment.</p>}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter un membre</h2>
        <form action={upsertTeamMember} className="mt-4 grid gap-3 sm:grid-cols-2">
          <TextField name="name" label="Nom" />
          <TextField name="order" label="Ordre" type="number" defaultValue="0" />
          <TextField name="roleFr" label="Rôle (FR)" />
          <TextField name="roleEn" label="Rôle (EN)" />
          <TextField name="rating" label="Note (1 à 5 étoiles)" type="number" defaultValue="5" />
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
              Photo (JPG/PNG)
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
            />
          </div>
          <button type="submit" className="btn-pill-solid sm:col-span-2">Ajouter</button>
        </form>
      </div>
    </div>
  );
}
