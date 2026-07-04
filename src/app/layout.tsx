import type { Metadata } from "next";
import { fraunces, poppins, inter } from "@/lib/fonts";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "TEPSON ART GROUP — Agence de production audiovisuelle",
  description:
    "TEPSON ART GROUP, agence de production audiovisuelle à Yaoundé, Cameroun : films d'entreprise, clips musicaux, motion design, captation live et studio de tournage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      suppressHydrationWarning
      className={`${fraunces.variable} ${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-surface text-text">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
