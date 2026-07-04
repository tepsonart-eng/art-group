"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { LogoLockup } from "@/components/logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchOverlay, type SearchEntry } from "@/components/search-overlay";
import { useDictionary } from "@/components/dictionary-provider";
import type { Locale } from "@/lib/i18n";

export function Header({
  logoLightPath,
  logoDarkPath,
  searchEntries,
}: {
  logoLightPath?: string | null;
  logoDarkPath?: string | null;
  searchEntries: SearchEntry[];
}) {
  const { dict, locale } = useDictionary();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems: { href: string; label: string }[] = [
    { href: `/${locale}#competences`, label: dict.skills.titleBold },
    { href: `/${locale}#realisations`, label: dict.portfolio.titleBold },
    { href: `/${locale}#agence`, label: dict.agency.titleBold },
    { href: `/${locale}#contact`, label: dict.nav.contact },
  ];

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
          {logoLightPath || logoDarkPath ? (
            <Image
              src={(logoDarkPath || logoLightPath) as string}
              alt="TEPSON ART GROUP"
              width={140}
              height={40}
              className="h-9 w-auto"
            />
          ) : (
            <LogoLockup />
          )}
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-[13px] font-semibold uppercase tracking-wide text-text transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <SearchOverlay entries={searchEntries} />
          </div>
          <LanguageSwitcher locale={locale as Locale} />
          <ThemeToggle />
          <button
            type="button"
            className="ml-1 flex h-9 w-9 items-center justify-center rounded-full border border-line lg:hidden"
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
