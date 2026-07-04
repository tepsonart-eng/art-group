import { isValidLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/settings";

export default async function LegalNoticePage({
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
        {isFr ? "Mentions légales" : "Legal notice"}
      </h1>
      <div className="mt-8 space-y-4 text-sm leading-relaxed text-text-muted">
        <p>
          {isFr
            ? "Le présent site est édité par TEPSON ART GROUP, agence de production audiovisuelle basée à Yaoundé, Cameroun."
            : "This website is published by TEPSON ART GROUP, an audiovisual production agency based in Yaoundé, Cameroon."}
        </p>
        <p>
          {isFr ? "Adresse : " : "Address: "}
          {settings.legalAddress || (isFr ? settings.addressFr : settings.addressEn)}
        </p>
        <p>
          {isFr ? "Numéro RCCM : " : "Trade register number: "}
          {settings.rccm || (isFr ? "à compléter" : "to be completed")}
        </p>
        <p>
          {isFr ? "Contact : " : "Contact: "}
          {settings.contactEmail}
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
