import { getSiteSettings } from "@/lib/settings";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Paramètres du site</h1>
      <p className="mt-1 text-sm text-text-muted">
        Textes, coordonnées, réglages globaux et médias (logos, vidéo d&apos;accueil, brochure PDF).
      </p>
      <SettingsForm settings={settings} />
    </div>
  );
}
