"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";

export type SearchEntry = {
  label: string;
  href: string;
  group: string;
};

export function SearchOverlay({ light = false }: { light?: boolean }) {
  const { dict, locale } = useDictionary();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      setResults([]);
      setLoading(false);
      setSearched(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(trimmed)}&locale=${locale}`, {
        signal: controller.signal,
      })
        .then((res) => res.json())
        .then((data: { results: SearchEntry[] }) => {
          setResults(data.results ?? []);
          setLoading(false);
          setSearched(true);
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setResults([]);
            setLoading(false);
            setSearched(true);
          }
        });
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, locale]);

  return (
    <>
      <button
        type="button"
        aria-label={dict.nav.search}
        onClick={() => setOpen(true)}
        className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-accent hover:text-accent ${
          light ? "border-white/40 text-white" : "border-line text-text"
        }`}
      >
        <Search size={16} />
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center bg-ink/70 px-4 pt-24 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-line bg-surface p-4 shadow-2xl">
            <div className="flex items-center gap-3 border-b border-line pb-3">
              <Search size={18} className="text-text-muted" />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={dict.nav.searchPlaceholder}
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-text-muted"
              />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                aria-label={dict.common.close}
                className="text-text-muted hover:text-accent"
              >
                <X size={18} />
              </button>
            </div>
            {results.length > 0 && (
              <ul className="mt-3 max-h-80 overflow-y-auto">
                {results.map((r) => (
                  <li key={r.href + r.label}>
                    <a
                      href={r.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-surface-alt"
                    >
                      <span>{r.label}</span>
                      <span className="text-xs uppercase tracking-wide text-text-muted">{r.group}</span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {!loading && searched && results.length === 0 && (
              <p className="mt-3 px-3 py-2 text-sm text-text-muted">{dict.nav.searchNoResults}</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
