"use client";

import Link from "next/link";
import Image from "next/image";
import { LogoMark } from "@/components/logo";
import { socialIconMap } from "@/components/social-icons";
import { useDictionary } from "@/components/dictionary-provider";
import { useAboutModal } from "@/components/about-modal-provider";

export type FooterSocialLink = {
  platform: keyof typeof socialIconMap;
  url: string;
};

export function Footer({
  socialLinks,
  phone1,
  phone2,
  contactEmail,
  address,
  logoPath,
}: {
  socialLinks: FooterSocialLink[];
  phone1: string;
  phone2: string;
  contactEmail: string;
  address: string;
  logoPath?: string | null;
}) {
  const { dict, locale } = useDictionary();
  const { open } = useAboutModal();

  return (
    <footer className="bg-accent text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              {logoPath ? (
                <Image src={logoPath} alt="TEPSON ART GROUP" width={56} height={56} className="h-14 w-14 object-contain" />
              ) : (
                <LogoMark className="h-14 w-14" color="white" />
              )}
            </div>
            <p className="mt-4 max-w-xs font-serif italic text-lg text-white/90">
              {dict.footer.tagline}
            </p>
            <p className="mt-6 font-display text-6xl font-extrabold uppercase leading-none tracking-tight sm:text-7xl">
              Tepson<br />Art Group
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/70">
              {dict.footer.contactTitle}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/90">
              <li>{address}</li>
              {phone1 && <li>{phone1}</li>}
              {phone2 && <li>{phone2}</li>}
              <li>{contactEmail}</li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/70">
              {dict.footer.linksTitle}
            </h3>
            <ul className="mt-4 space-y-2 text-sm text-white/90">
              <li>
                <a href={`/${locale}#realisations`} className="hover:underline">
                  {dict.portfolio.titleBold}
                </a>
              </li>
              <li>
                <button onClick={open} className="hover:underline">
                  {dict.agency.readMore}
                </button>
              </li>
              <li>
                <a href={`/${locale}#contact`} className="hover:underline">
                  {dict.nav.contact}
                </a>
              </li>
              <li>
                <Link href={`/${locale}/mentions-legales`} className="hover:underline">
                  {dict.footer.legalMentions}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/confidentialite`} className="hover:underline">
                  {dict.footer.privacyPolicy}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white/70">
              {dict.footer.socialTitle}
            </h3>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              {socialLinks.map((link, i) => {
                const Icon = socialIconMap[link.platform];
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={link.platform}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-white/50 text-white transition-colors hover:bg-white hover:text-accent"
                    style={{ marginLeft: i === 0 ? 0 : undefined }}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t border-white/20 pt-6 text-xs text-white/70 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} TEPSON ART GROUP — {dict.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
