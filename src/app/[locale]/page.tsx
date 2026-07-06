import type { Metadata } from "next";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { getSiteSettings } from "@/lib/settings";
import { getVisibleSocialLinks } from "@/lib/data";
import {
  getCategories,
  getProjects,
  getPortfolioTabs,
  getTestimonials,
  getApprovedReviews,
  getPartnerLogos,
  getWhyChooseUsItems,
  getTeamMembers,
} from "@/lib/data";
import { Hero } from "@/components/hero";
import { SkillsSection } from "@/components/skills-section";
import { AgencySection } from "@/components/agency-section";
import { WhyChooseUsSection } from "@/components/why-choose-us-section";
import { AdSpace } from "@/components/ad-space";
import { LogoMarquee } from "@/components/logo-marquee";
import { PortfolioSection } from "@/components/portfolio-section";
import { TrustSection } from "@/components/trust-section";
import { ReviewsSection } from "@/components/reviews-section";
import { CTASection } from "@/components/cta-section";
import { ContactSection } from "@/components/contact-section";
import { TeamSection } from "@/components/team-section";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = isValidLocale(rawLocale) ? (rawLocale as Locale) : "fr";
  const settings = await getSiteSettings();
  const isFr = locale === "fr";
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const title = isFr
    ? "TEPSON ART GROUP — Agence de production audiovisuelle à Yaoundé"
    : "TEPSON ART GROUP — Audiovisual production agency in Yaoundé";
  const description = isFr ? settings.agencyIntroFr : settings.agencyIntroEn;

  return {
    title,
    description,
    alternates: {
      canonical: `${base}/${locale}`,
      languages: { fr: `${base}/fr`, en: `${base}/en` },
    },
    openGraph: {
      title,
      description,
      url: `${base}/${locale}`,
      siteName: "TEPSON ART GROUP",
      locale: isFr ? "fr_FR" : "en_US",
      type: "website",
    },
  };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const [settings, categories, projects, tabs, testimonials, reviews, logos, whyItems, socialLinks, teamMembers] =
    await Promise.all([
      getSiteSettings(),
      getCategories(),
      getProjects(),
      getPortfolioTabs(),
      getTestimonials(),
      getApprovedReviews(),
      getPartnerLogos(),
      getWhyChooseUsItems(),
      getVisibleSocialLinks(),
      getTeamMembers(),
    ]);

  const taglinesFr = settings.heroTaglinesFr.split("\n").map((s) => s.trim()).filter(Boolean);
  const taglinesEn = settings.heroTaglinesEn.split("\n").map((s) => s.trim()).filter(Boolean);

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "TEPSON ART GROUP",
    url: `${base}/${locale}`,
    description: locale === "fr" ? settings.agencyIntroFr : settings.agencyIntroEn,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Yaoundé",
      addressCountry: "CM",
    },
    email: settings.contactEmail,
    telephone: settings.phone1,
    sameAs: socialLinks.map((s) => s.url).filter(Boolean),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero taglinesFr={taglinesFr} taglinesEn={taglinesEn} videoPath={settings.heroVideoPath} />
      <SkillsSection categories={categories} />
      <AgencySection introFr={settings.agencyIntroFr} introEn={settings.agencyIntroEn} />
      <WhyChooseUsSection items={whyItems} imagePath={settings.whyUsImagePath} />
      <AdSpace
        titleFr={settings.adSpaceTitleFr}
        titleEn={settings.adSpaceTitleEn}
        textFr={settings.adSpaceTextFr}
        textEn={settings.adSpaceTextEn}
        mediaPath={settings.adSpaceMediaPath}
        mediaType={settings.adSpaceMediaType}
      />
      <LogoMarquee logos={logos} />
      <PortfolioSection projects={projects} tabs={tabs} />
      <TrustSection testimonials={testimonials} />
      <ReviewsSection reviews={reviews} />
      <CTASection />
      <ContactSection
        phone1={settings.phone1}
        phone2={settings.phone2}
        contactEmail={settings.contactEmail}
        address={locale === "fr" ? settings.addressFr : settings.addressEn}
        whatsappNumber={settings.whatsappNumber}
        mapEmbedUrl={settings.mapEmbedUrl}
        quoteFr={settings.contactQuoteFr}
        quoteEn={settings.contactQuoteEn}
      />
      <TeamSection members={teamMembers} />
    </>
  );
}
