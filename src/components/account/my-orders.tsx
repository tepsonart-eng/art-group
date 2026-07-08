import type { Locale } from "@/lib/i18n";
import { getUserOrders } from "@/lib/data";

const statusLabel: Record<string, { fr: string; en: string }> = {
  PENDING: { fr: "En attente", en: "Pending" },
  PAID: { fr: "Payée", en: "Paid" },
  FAILED: { fr: "Échouée", en: "Failed" },
  CANCELLED: { fr: "Annulée", en: "Cancelled" },
  EXPIRED: { fr: "Expirée", en: "Expired" },
};

export async function MyOrders({
  userId,
  locale,
  title,
  emptyText,
}: {
  userId: string;
  locale: Locale;
  title: string;
  emptyText: string;
}) {
  const orders = await getUserOrders(userId);

  return (
    <div>
      <h2 className="font-display text-lg font-bold">{title}</h2>
      {orders.length === 0 ? (
        <p className="mt-3 text-sm text-text-muted">{emptyText}</p>
      ) : (
        <div className="mt-4 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center gap-4 rounded-xl bg-surface-alt p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm font-semibold">
                  {locale === "fr" ? order.training.titleFr : order.training.titleEn}
                </p>
                <p className="text-xs text-text-muted">
                  {order.createdAt.toLocaleDateString(locale === "fr" ? "fr-FR" : "en-US")} ·{" "}
                  {order.amountXaf.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} FCFA
                </p>
              </div>
              <span
                className={`shrink-0 text-xs font-semibold ${
                  order.status === "PAID"
                    ? "text-green-600 dark:text-green-400"
                    : order.status === "PENDING"
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-red-600 dark:text-red-400"
                }`}
              >
                {statusLabel[order.status][locale]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
