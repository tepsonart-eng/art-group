"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Menu, X, User } from "lucide-react";
import { LogoLockup } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchOverlay, type SearchEntry } from "@/components/search-overlay";
import { useDictionary } from "@/components/dictionary-provider";
import type { Locale } from "@/lib/i18n";
import type { CurrentUser } from "@/lib/user-auth";

export function Header({
  logoLightPath,
  logoDarkPath,
  searchEntries,
  currentUser,
}: {
  logoLightPath?: string | null;
  logoDarkPath?: string | null;
  searchEntries: SearchEntry[];
  currentUser: CurrentUser | null;
}) {
  const { dict, locale } = useDictionary();
  const { resolvedTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // The hero behind a transparent header is always dark, so white content is
  // needed there regardless of the site's light/dark theme. Once scrolled,
  // the header gets a solid background matching the current theme.
  const overDarkBackground = !scrolled || (mounted && resolvedTheme === "dark");
  const useWhiteLogo = !scrolled || (mounted && resolvedTheme === "dark");

  const navItems: { href: string; label: string }[] = [
    { href: `/${locale}#competences`, label: dict.skills.titleBold },
    { href: `/${locale}#realisations`, label: dict.portfolio.titleBold },
    { href: `/${locale}/formations`, label: dict.trainings.navLabel },
    { href: `/${locale}#agence`, label: dict.agency.titleBold },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

  const logoSrc = useWhiteLogo ? logoDarkPath || logoLightPath : logoLightPath || logoDarkPath;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? "border-b border-line bg-surface/95 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 sm:px-8">
        <Link href={`/${locale}`} aria-label="TEPSON ART GROUP">
          {logoSrc ? (
            <Image
              src={logoSrc}
              alt="TEPSON ART GROUP"
              width={140}
              height={40}
              className="h-9 w-auto"
            />
          ) : (
            <LogoLockup color={overDarkBackground ? "#ffffff" : "var(--text)"} />
          )}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`font-display text-[13px] font-semibold uppercase tracking-wide transition-colors hover:text-accent ${
                overDarkBackground ? "text-white" : "text-text"
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <SearchOverlay entries={searchEntries} light={overDarkBackground} />
          </div>
          <LanguageSwitcher locale={locale as Locale} light={overDarkBackground} />
          <ThemeToggle light={overDarkBackground} />
          <Link
            href={currentUser ? `/${locale}/compte` : `/${locale}/compte/connexion`}
            aria-label={dict.account.navLabel}
            className={`flex h-9 w-9 items-center justify-center rounded-full border ${
              overDarkBackground ? "border-white/40 text-white" : "border-line text-text"
            }`}
          >
            <User size={16} />
          </Link>
          <button
            type="button"
            className={`ml-1 flex h-9 w-9 items-center justify-center rounded-full border lg:hidden ${
              overDarkBackground ? "border-white/40 text-white" : "border-line text-text"
            }`}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Menu"
          >
            {mobileOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-surface px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="font-display text-sm font-semibold uppercase tracking-wide text-text hover:text-accent"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
