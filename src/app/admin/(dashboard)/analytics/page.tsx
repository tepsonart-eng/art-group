import { prisma } from "@/lib/prisma";
import { BarChart } from "@/components/admin/bar-chart";

type MonthlyRow = { month: string; total: number };

function lastSixMonthLabels(): string[] {
  const labels: string[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    labels.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  }
  return labels;
}

function fillMonths(rows: MonthlyRow[]): { label: string; value: number }[] {
  const map = new Map(rows.map((r) => [r.month, r.total]));
  return lastSixMonthLabels().map((month) => ({ label: month, value: map.get(month) ?? 0 }));
}

const statusLabel: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  FAILED: "Échouée",
  CANCELLED: "Annulée",
  EXPIRED: "Expirée",
};

export default async function AdminAnalyticsPage() {
  const [
    revenueAgg,
    trainingsPublished,
    usersCount,
    certificatesCount,
    commentsApproved,
    ordersByStatus,
    topTrainings,
    topResources,
    topProducts,
    monthlyRevenue,
    monthlyUsers,
  ] = await Promise.all([
    prisma.order.aggregate({ where: { status: "PAID" }, _sum: { amountXaf: true }, _count: true }),
    prisma.training.count({ where: { published: true } }),
    prisma.user.count(),
    prisma.certificate.count(),
    prisma.trainingComment.count({ where: { status: "APPROVED" } }),
    prisma.order.groupBy({ by: ["status"], _count: true }),
    prisma.training.findMany({
      where: { published: true },
      orderBy: { viewCount: "desc" },
      take: 5,
      select: { titleFr: true, viewCount: true },
    }),
    prisma.resource.findMany({
      where: { published: true },
      orderBy: { downloadCount: "desc" },
      take: 5,
      select: { titleFr: true, downloadCount: true },
    }),
    prisma.product.findMany({
      where: { published: true },
      orderBy: { downloadCount: "desc" },
      take: 5,
      select: { titleFr: true, downloadCount: true },
    }),
    prisma.$queryRaw<MonthlyRow[]>`
      SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month, SUM("amountXaf")::int AS total
      FROM "Order"
      WHERE status = 'PAID' AND "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `,
    prisma.$queryRaw<MonthlyRow[]>`
      SELECT to_char(date_trunc('month', "createdAt"), 'YYYY-MM') AS month, COUNT(*)::int AS total
      FROM "User"
      WHERE "createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY month
      ORDER BY month ASC
    `,
  ]);

  const totalRevenue = revenueAgg._sum.amountXaf ?? 0;
  const paidOrders = revenueAgg._count;

  const kpis = [
    { label: "Revenu total", value: `${totalRevenue.toLocaleString("fr-FR")} FCFA` },
    { label: "Commandes payées", value: paidOrders },
    { label: "Formations publiées", value: trainingsPublished },
    { label: "Utilisateurs inscrits", value: usersCount },
    { label: "Certificats délivrés", value: certificatesCount },
    { label: "Commentaires approuvés", value: commentsApproved },
  ];

  const topDownloads = [
    ...topResources.map((r) => ({ label: `${r.titleFr} (Ressource)`, value: r.downloadCount })),
    ...topProducts.map((p) => ({ label: `${p.titleFr} (Produit)`, value: p.downloadCount })),
  ]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Analytique</h1>
      <p className="mt-1 text-sm text-text-muted">
        Vue d&apos;ensemble des performances : revenus, engagement et contenus les plus consultés.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-2xl border border-line bg-surface-alt p-6">
            <p className="text-3xl font-display font-extrabold">{k.value}</p>
            <p className="mt-1 text-sm text-text-muted">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface-alt p-6">
          <h2 className="font-display font-semibold">Revenus (6 derniers mois)</h2>
          <div className="mt-4">
            <BarChart
              data={fillMonths(monthlyRevenue).map((m) => ({
                label: m.label,
                value: m.value,
                formattedValue: `${m.value.toLocaleString("fr-FR")} FCFA`,
              }))}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface-alt p-6">
          <h2 className="font-display font-semibold">Nouveaux utilisateurs (6 derniers mois)</h2>
          <div className="mt-4">
            <BarChart data={fillMonths(monthlyUsers)} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-line bg-surface-alt p-6">
          <h2 className="font-display font-semibold">Top 5 formations par vues</h2>
          <div className="mt-4">
            <BarChart data={topTrainings.map((t) => ({ label: t.titleFr, value: t.viewCount }))} />
          </div>
        </div>
        <div className="rounded-2xl border border-line bg-surface-alt p-6">
          <h2 className="font-display font-semibold">Top 5 téléchargements</h2>
          <div className="mt-4">
            <BarChart data={topDownloads} />
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface-alt p-6">
        <h2 className="font-display font-semibold">Commandes par statut</h2>
        <div className="mt-4">
          <BarChart
            data={ordersByStatus.map((o) => ({
              label: statusLabel[o.status] ?? o.status,
              value: o._count,
            }))}
          />
        </div>
      </div>
    </div>
  );
}
