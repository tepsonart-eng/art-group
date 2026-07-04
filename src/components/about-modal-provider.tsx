"use client";

import { createContext, useContext, useState, useCallback } from "react";

type AboutModalContextValue = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

const AboutModalContext = createContext<AboutModalContextValue | null>(null);

export function AboutModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <AboutModalContext.Provider value={{ isOpen, open, close }}>
      {children}
    </AboutModalContext.Provider>
  );
}

export function useAboutModal() {
  const ctx = useContext(AboutModalContext);
  if (!ctx) {
    throw new Error("useAboutModal must be used within an AboutModalProvider");
  }
  return ctx;
}
