"use client";

import { useActionState } from "react";
import { updateSiteSettings, type SettingsFormState } from "@/actions/admin/settings";
import type { SiteSettings } from "@/lib/settings";
import { TextField, TextArea } from "@/components/admin/fields";

const initialState: SettingsFormState = { status: "idle" };

export function SettingsForm({ settings }: { settings: SiteSettings }) {
  const [state, formAction, isPending] = useActionState(updateSiteSettings, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-10">
      <Section title="Palette & modération">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
            Palette de couleurs
          </label>
          <select
            name="palette"
            defaultValue={settings.palette}
            className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="RED_BLACK">Noir profond + rouge vif</option>
            <option value="COBALT_GOLD">Bleu cobalt + or</option>
          </select>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="reviewModeration" defaultChecked={settings.reviewModeration} />
          Valider les avis avant publication
        </label>
      </Section>

      <Section title="Médias (logo, vidéo, brochure)">
        <FileField name="logoLight" label="Logo — fond clair" current={settings.logoLightPath} accept="image/*" />
        <FileField name="logoDark" label="Logo — fond sombre" current={settings.logoDarkPath} accept="image/*" />
        <FileField name="heroVideo" label="Vidéo d'accueil (boucle)" current={settings.heroVideoPath} accept="video/*" />
        <FileField name="brochurePdf" label="Brochure PDF de présentation" current={settings.brochurePdfPath} accept=".pdf" />
      </Section>

      <Section title="Hero — phrases d'accroche">
        <TextArea name="heroTaglinesFr" label="Accroches (FR, une par ligne)" defaultValue={settings.heroTaglinesFr} full rows={4} />
        <TextArea name="heroTaglinesEn" label="Accroches (EN, une par ligne)" defaultValue={settings.heroTaglinesEn} full rows={4} />
      </Section>

      <Section title="Présentation de l'agence">
        <TextArea name="agencyIntroFr" label="Introduction agence (FR)" defaultValue={settings.agencyIntroFr} full rows={4} />
        <TextArea name="agencyIntroEn" label="Introduction agence (EN)" defaultValue={settings.agencyIntroEn} full rows={4} />
        <TextArea name="aboutTextFr" label="Texte « En savoir plus » (FR)" defaultValue={settings.aboutTextFr} full rows={3} />
        <TextArea name="aboutTextEn" label="Texte « En savoir plus » (EN)" defaultValue={settings.aboutTextEn} full rows={3} />
        <TextArea name="teamTextFr" label="Équipe créative (FR)" defaultValue={settings.teamTextFr} full rows={3} />
        <TextArea name="teamTextEn" label="Équipe créative (EN)" defaultValue={settings.teamTextEn} full rows={3} />
        <TextArea name="planetTextFr" label="Engagements planète (FR)" defaultValue={settings.planetTextFr} full rows={3} />
        <TextArea name="planetTextEn" label="Engagements planète (EN)" defaultValue={settings.planetTextEn} full rows={3} />
      </Section>

      <Section title="Espace publicitaire">
        <TextField name="adSpaceTitleFr" label="Titre (FR)" defaultValue={settings.adSpaceTitleFr} />
        <TextField name="adSpaceTitleEn" label="Titre (EN)" defaultValue={settings.adSpaceTitleEn} />
        <TextArea name="adSpaceTextFr" label="Texte (FR)" defaultValue={settings.adSpaceTextFr} full />
        <TextArea name="adSpaceTextEn" label="Texte (EN)" defaultValue={settings.adSpaceTextEn} full />
      </Section>

      <Section title="Appel à l'action & contact">
        <TextField name="ctaTitleFr" label="Titre CTA (FR, optionnel)" defaultValue={settings.ctaTitleFr} />
        <TextField name="ctaTitleEn" label="Titre CTA (EN, optionnel)" defaultValue={settings.ctaTitleEn} />
        <TextField name="contactQuoteFr" label="Citation contact (FR)" defaultValue={settings.contactQuoteFr} />
        <TextField name="contactQuoteEn" label="Citation contact (EN)" defaultValue={settings.contactQuoteEn} />
        <TextField name="phone1" label="Téléphone 1" defaultValue={settings.phone1} />
        <TextField name="phone2" label="Téléphone 2" defaultValue={settings.phone2} />
        <TextField name="contactEmail" label="Email de contact" defaultValue={settings.contactEmail} />
        <TextField name="whatsappNumber" label="Numéro WhatsApp (format international, sans +)" defaultValue={settings.whatsappNumber} />
        <TextField name="addressFr" label="Adresse (FR)" defaultValue={settings.addressFr} />
        <TextField name="addressEn" label="Adresse (EN)" defaultValue={settings.addressEn} />
        <TextArea name="mapEmbedUrl" label="URL d'intégration Google Maps (src de l'iframe)" defaultValue={settings.mapEmbedUrl} full />
      </Section>

      <Section title="Informations légales">
        <TextField name="rccm" label="Numéro RCCM" defaultValue={settings.rccm} />
        <TextField name="legalAddress" label="Adresse légale (siège)" defaultValue={settings.legalAddress} />
      </Section>

      <div>
        <button type="submit" disabled={isPending} className="btn-pill-solid">
          {isPending ? "Enregistrement..." : "Enregistrer les paramètres"}
        </button>
        {state.status === "success" && (
          <p className="mt-3 text-sm text-green-700">Paramètres mis à jour avec succès.</p>
        )}
        {state.status === "error" && <p className="mt-3 text-sm text-red-700">{state.message}</p>}
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-line bg-surface-alt p-6">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

function FileField({
  name,
  label,
  current,
  accept,
}: {
  name: string;
  label: string;
  current?: string | null;
  accept: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</label>
      <input
        type="file"
        name={name}
        accept={accept}
        className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
      />
      {current && <p className="mt-1 truncate text-xs text-text-muted">Actuel : {current}</p>}
    </div>
  );
}
