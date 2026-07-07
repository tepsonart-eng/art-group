import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { getSiteSettings } from "@/lib/settings";
import { getFaqItems, getCommitmentItems, getVisibleSocialLinks, getProjects, getTrainings } from "@/lib/data";
import { DictionaryProvider } from "@/components/dictionary-provider";
import { AboutModalProvider } from "@/components/about-modal-provider";
import { HtmlLangSync } from "@/components/html-lang-sync";
import { Header } from "@/components/header";
import { Footer, type FooterSocialLink } from "@/components/footer";
import { AboutModal } from "@/components/about-modal";
import type { SearchEntry } from "@/components/search-overlay";

export const dynamic = "force-dynamic";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const [dict, settings, faqItems, commitments, socialLinks, projects, trainings] = await Promise.all([
    getDictionary(locale),
    getSiteSettings(),
    getFaqItems(),
    getCommitmentItems(),
    getVisibleSocialLinks(),
    getProjects(),
    getTrainings(),
  ]);

  const searchEntries: SearchEntry[] = [
    ...projects.map((p) => ({
      label: locale === "fr" ? p.titleFr : p.titleEn,
      href: `/${locale}#realisations`,
      group: dict.portfolio.titleBold,
    })),
    ...trainings.map((t) => ({
      label: locale === "fr" ? t.titleFr : t.titleEn,
      href: `/${locale}/formations/${t.slug}`,
      group: dict.trainings.titleBold,
    })),
    ...faqItems.map((f) => ({
      label: locale === "fr" ? f.questionFr : f.questionEn,
      href: `/${locale}#agence`,
      group: dict.about.faqTitle,
    })),
  ];

  const footerSocialLinks: FooterSocialLink[] = socialLinks.map((s) => ({
    platform: s.platform,
    url: s.url,
  }));

  return (
    <DictionaryProvider dict={dict} locale={locale}>
      <AboutModalProvider>
        <div data-palette={settings.palette === "COBALT_GOLD" ? "cobalt" : "red"} className="flex min-h-screen flex-col">
          <HtmlLangSync locale={locale} />
          <Header
            logoLightPath={settings.logoLightPath}
            logoDarkPath={settings.logoDarkPath}
            searchEntries={searchEntries}
          />
          <main className="flex-1">{children}</main>
          <Footer
            socialLinks={footerSocialLinks}
            phone1={settings.phone1}
            phone2={settings.phone2}
            contactEmail={settings.contactEmail}
            address={locale === "fr" ? settings.addressFr : settings.addressEn}
            logoPath={settings.logoDarkPath || settings.logoLightPath}
          />
          <AboutModal
            aboutTextFr={settings.aboutTextFr}
            aboutTextEn={settings.aboutTextEn}
            teamTextFr={settings.teamTextFr}
            teamTextEn={settings.teamTextEn}
            planetTextFr={settings.planetTextFr}
            planetTextEn={settings.planetTextEn}
            commitments={commitments}
            faqItems={faqItems}
            phone1={settings.phone1}
            contactEmail={settings.contactEmail}
            address={locale === "fr" ? settings.addressFr : settings.addressEn}
          />
        </div>
      </AboutModalProvider>
    </DictionaryProvider>
  );
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }];
}
