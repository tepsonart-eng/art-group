"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useDictionary } from "@/components/dictionary-provider";

export function ThemeToggle({ light = false }: { light?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();
  const { dict } = useDictionary();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? dict.theme.toggleLight : dict.theme.toggleDark}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:border-accent hover:text-accent ${
        light ? "border-white/40 text-white" : "border-line text-text"
      }`}
    >
      {mounted && isDark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
