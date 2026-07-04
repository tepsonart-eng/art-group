import { isValidLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/settings";

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const settings = await getSiteSettings();
  const isFr = locale === "fr";

  return (
    <div className="mx-auto max-w-3xl px-5 py-32 sm:px-8">
      <h1 className="font-display text-3xl font-extrabold">
        {isFr ? "Politique de confidentialité" : "Privacy policy"}
      </h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-text-muted">
        <p>
          {isFr
            ? "TEPSON ART GROUP collecte les données transmises via le formulaire de contact et le formulaire d'avis (nom, email, téléphone, message) dans le seul but de répondre à votre demande."
            : "TEPSON ART GROUP collects the data submitted via the contact form and the review form (name, email, phone, message) solely to respond to your request."}
        </p>
        <p>
          {isFr
            ? "Ces données ne sont ni vendues ni transmises à des tiers. Elles sont conservées le temps nécessaire au traitement de votre demande."
            : "This data is neither sold nor shared with third parties. It is retained only for as long as necessary to process your request."}
        </p>
        <p>
          {isFr
            ? `Pour exercer vos droits d'accès, de rectification ou de suppression, contactez-nous à ${settings.contactEmail}.`
            : `To exercise your rights of access, rectification or deletion, contact us at ${settings.contactEmail}.`}
        </p>
        <p className="italic">
          {isFr
            ? "Ce contenu est un texte provisoire, à finaliser avec les informations juridiques définitives de l'entreprise."
            : "This is placeholder content, to be finalized with the company's final legal information."}
        </p>
      </div>
    </div>
  );
}
