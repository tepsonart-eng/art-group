"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";

export function LanguageSwitcher({ locale, light = false }: { locale: Locale; light?: boolean }) {
  const pathname = usePathname();
  const router = useRouter();

  function switchTo(next: Locale) {
    if (next === locale) return;
    const rest = pathname.split("/").slice(2).join("/");
    router.push(`/${next}${rest ? `/${rest}` : ""}`);
  }

  return (
    <div className="flex items-center gap-1 text-xs font-display font-semibold tracking-wide">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => switchTo(l)}
          aria-current={l === locale}
          className={`rounded-full px-2 py-1 uppercase transition-colors ${
            l === locale
              ? "bg-accent text-white"
              : light
                ? "text-white/70 hover:text-white"
                : "text-text-muted hover:text-accent"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
