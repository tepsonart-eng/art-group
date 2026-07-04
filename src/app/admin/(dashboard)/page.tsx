import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminOverviewPage() {
  const [projects, messages, unreadMessages, pendingReviews, testimonials] = await Promise.all([
    prisma.project.count(),
    prisma.contactMessage.count(),
    prisma.contactMessage.count({ where: { read: false } }),
    prisma.review.count({ where: { status: "PENDING" } }),
    prisma.testimonial.count(),
  ]);

  const stats = [
    { label: "Projets publiés", value: projects, href: "/admin/projects" },
    { label: "Messages reçus", value: messages, href: "/admin/messages" },
    { label: "Messages non lus", value: unreadMessages, href: "/admin/messages" },
    { label: "Avis en attente", value: pendingReviews, href: "/admin/reviews" },
    { label: "Témoignages", value: testimonials, href: "/admin/testimonials" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Vue d&apos;ensemble</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-line bg-surface-alt p-6 transition-colors hover:border-accent"
          >
            <p className="text-3xl font-display font-extrabold">{s.value}</p>
            <p className="mt-1 text-sm text-text-muted">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
