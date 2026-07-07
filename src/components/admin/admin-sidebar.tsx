"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/actions/auth";
import type { CurrentAdmin } from "@/lib/auth";

const links = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/settings", label: "Paramètres du site" },
  { href: "/admin/categories", label: "Compétences" },
  { href: "/admin/projects", label: "Réalisations" },
  { href: "/admin/portfolio-tabs", label: "Filtres réalisations" },
  { href: "/admin/trainings", label: "Formations" },
  { href: "/admin/training-categories", label: "Catégories formations" },
  { href: "/admin/training-comments", label: "Commentaires formations" },
  { href: "/admin/team", label: "Équipe" },
  { href: "/admin/testimonials", label: "Témoignages" },
  { href: "/admin/reviews", label: "Avis clients" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/partners", label: "Logos partenaires" },
  { href: "/admin/why-us", label: "Pourquoi nous choisir" },
  { href: "/admin/commitments", label: "Engagements clients" },
  { href: "/admin/social-links", label: "Réseaux sociaux" },
  { href: "/admin/messages", label: "Messages reçus" },
  { href: "/admin/users", label: "Utilisateurs admin" },
];

export function AdminSidebar({ admin }: { admin: CurrentAdmin }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 shrink-0 flex-col border-r border-line bg-surface-alt p-5">
      <div>
        <p className="font-display text-sm font-extrabold uppercase tracking-wide">TEPSON ART</p>
        <p className="text-xs text-text-muted">Espace admin</p>
      </div>
      <nav className="mt-8 flex-1 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href;
          if (link.href === "/admin/users" && admin.role !== "SUPER_ADMIN") return null;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "bg-accent text-white" : "text-text hover:bg-surface"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-line pt-4">
        <p className="text-xs text-text-muted">{admin.name}</p>
        <p className="text-xs text-text-muted">{admin.role}</p>
        <form action={logout} className="mt-3">
          <button type="submit" className="text-xs font-semibold text-accent hover:underline">
            Se déconnecter
          </button>
        </form>
      </div>
    </aside>
  );
}
