import { prisma } from "@/lib/prisma";
import { updateSocialLink } from "@/actions/admin/content";
import { TextField } from "@/components/admin/fields";

const PLATFORMS = ["FACEBOOK", "INSTAGRAM", "TIKTOK", "YOUTUBE", "LINKEDIN", "WHATSAPP"] as const;

export default async function AdminSocialLinksPage() {
  const links = await prisma.socialLink.findMany();
  const byPlatform = Object.fromEntries(links.map((l) => [l.platform, l]));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Réseaux sociaux</h1>
      <p className="mt-1 text-sm text-text-muted">
        Liens affichés dans le pied de page. Laissez l&apos;URL vide et décochez « Visible » pour masquer un réseau.
      </p>

      <div className="mt-8 space-y-4">
        {PLATFORMS.map((platform) => {
          const existing = byPlatform[platform];
          return (
            <form
              key={platform}
              action={updateSocialLink}
              className="grid gap-3 rounded-xl border border-line bg-surface-alt p-4 sm:grid-cols-[120px_1fr_auto]"
            >
              <input type="hidden" name="platform" value={platform} />
              <p className="self-center font-display text-sm font-semibold">{platform}</p>
              <TextField name="url" label="URL" defaultValue={existing?.url ?? ""} />
              <label className="flex items-center gap-2 self-center text-sm">
                <input type="checkbox" name="visible" defaultChecked={existing?.visible ?? true} />
                Visible
              </label>
              <button type="submit" className="btn-pill-solid sm:col-span-3 w-fit">
                Enregistrer
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
