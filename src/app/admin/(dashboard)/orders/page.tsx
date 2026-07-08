import { prisma } from "@/lib/prisma";

const statusLabel: Record<string, string> = {
  PENDING: "En attente",
  PAID: "Payée",
  FAILED: "Échouée",
  CANCELLED: "Annulée",
  EXPIRED: "Expirée",
};

const channelLabel: Record<string, string> = {
  ORANGE_MONEY: "Orange Money",
  MTN_MOMO: "MTN MoMo",
};

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: true, training: true, product: true },
    take: 200,
  });

  const revenue = orders
    .filter((o) => o.status === "PAID")
    .reduce((sum, o) => sum + o.amountXaf, 0);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Commandes</h1>
      <p className="mt-1 text-sm text-text-muted">
        Historique des achats de formations premium et de produits de la boutique (Orange Money / MTN MoMo).
      </p>

      <div className="mt-6 rounded-xl bg-surface-alt p-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          Revenu total (commandes payées)
        </p>
        <p className="mt-1 font-display text-2xl font-extrabold">
          {revenue.toLocaleString("fr-FR")} FCFA
        </p>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-text-muted">
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Client</th>
              <th className="py-2 pr-4">Type</th>
              <th className="py-2 pr-4">Article</th>
              <th className="py-2 pr-4">Canal</th>
              <th className="py-2 pr-4">Montant</th>
              <th className="py-2 pr-4">Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-line/60">
                <td className="py-2 pr-4 text-text-muted">
                  {order.createdAt.toLocaleDateString("fr-FR")}
                </td>
                <td className="py-2 pr-4">
                  {order.user.name} <span className="text-text-muted">({order.user.email})</span>
                </td>
                <td className="py-2 pr-4 text-text-muted">{order.training ? "Formation" : "Produit"}</td>
                <td className="py-2 pr-4">{order.training?.titleFr ?? order.product?.titleFr ?? "—"}</td>
                <td className="py-2 pr-4">{channelLabel[order.channel]}</td>
                <td className="py-2 pr-4">{order.amountXaf.toLocaleString("fr-FR")} FCFA</td>
                <td className="py-2 pr-4">
                  <span
                    className={
                      order.status === "PAID"
                        ? "font-semibold text-green-700"
                        : order.status === "PENDING"
                          ? "font-semibold text-amber-700"
                          : "font-semibold text-red-700"
                    }
                  >
                    {statusLabel[order.status]}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="mt-4 text-sm text-text-muted">Aucune commande pour le moment.</p>}
      </div>
    </div>
  );
}
