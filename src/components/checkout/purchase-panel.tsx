"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Lock, Smartphone, CheckCircle2, XCircle } from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";
import { initiatePurchase, getOrderStatus, type CheckoutFormState } from "@/actions/checkout";

const initialState: CheckoutFormState = { status: "idle" };
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 2 * 60 * 1000;

export function PurchasePanel({
  kind,
  id,
  priceXaf,
  locale,
  loggedIn,
}: {
  kind: "training" | "product";
  id: string;
  priceXaf: number;
  locale: string;
  loggedIn: boolean;
}) {
  const { dict } = useDictionary();
  const [state, formAction, isPending] = useActionState(initiatePurchase, initialState);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const pollStart = useRef<number | null>(null);

  useEffect(() => {
    if (state.status !== "pending" || !state.orderId) return;
    pollStart.current = Date.now();
    setOrderStatus("PENDING");

    const interval = setInterval(async () => {
      if (!state.orderId) return;
      const status = await getOrderStatus(state.orderId);
      if (status) setOrderStatus(status);
      if (status && status !== "PENDING") {
        clearInterval(interval);
        return;
      }
      if (pollStart.current && Date.now() - pollStart.current > POLL_TIMEOUT_MS) {
        clearInterval(interval);
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [state.status, state.orderId]);

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-alt p-8 text-center">
        <Lock size={28} className="text-accent" />
        <p className="font-display font-semibold">{dict.checkout.loginRequired}</p>
        <a href={`/${locale}/compte/connexion`} className="btn-pill-solid">
          {dict.account.loginTitle}
        </a>
      </div>
    );
  }

  if (orderStatus === "PAID") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-alt p-8 text-center">
        <CheckCircle2 size={28} className="text-green-600 dark:text-green-400" />
        <p className="font-display font-semibold">{dict.checkout.paymentSuccess}</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-pill-solid">
          {dict.checkout.reloadButton}
        </button>
      </div>
    );
  }

  if (orderStatus && ["FAILED", "EXPIRED", "CANCELLED"].includes(orderStatus)) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-alt p-8 text-center">
        <XCircle size={28} className="text-red-600 dark:text-red-400" />
        <p className="font-display font-semibold">{dict.checkout.paymentFailed}</p>
        <button type="button" onClick={() => window.location.reload()} className="btn-pill-solid">
          {dict.checkout.retryButton}
        </button>
      </div>
    );
  }

  if (state.status === "pending" && orderStatus === "PENDING") {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl bg-surface-alt p-8 text-center">
        <Smartphone size={28} className="animate-pulse text-accent" />
        <p className="font-display font-semibold">{dict.checkout.waitingTitle}</p>
        <p className="text-sm text-text-muted">{dict.checkout.waitingText}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-surface-alt p-6 sm:p-8">
      <div className="flex items-center gap-2">
        <Lock size={18} className="text-accent" />
        <p className="font-display font-bold">
          {kind === "training" ? dict.checkout.premiumTitle : dict.checkout.productTitle}
        </p>
      </div>
      <p className="mt-2 text-2xl font-display font-extrabold text-accent">
        {priceXaf.toLocaleString(locale === "fr" ? "fr-FR" : "en-US")} FCFA
      </p>

      <form action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <input type="hidden" name={kind === "training" ? "trainingId" : "productId"} value={id} />
        <div>
          <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
            {dict.checkout.channelLabel}
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
              <input type="radio" name="channel" value="ORANGE_MONEY" defaultChecked />
              Orange Money
            </label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-line px-4 py-3 text-sm has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
              <input type="radio" name="channel" value="MTN_MOMO" />
              MTN MoMo
            </label>
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
            {dict.checkout.phoneLabel}
          </label>
          <div className="flex items-center overflow-hidden rounded-xl border border-line bg-surface focus-within:border-accent">
            <span className="px-3 text-sm text-text-muted">+237</span>
            <input
              type="tel"
              name="phoneNumber"
              required
              pattern="6[0-9]{8}"
              placeholder="6XXXXXXXX"
              className="w-full bg-transparent px-2 py-3 text-sm outline-none"
            />
          </div>
        </div>
        <button type="submit" disabled={isPending} className="btn-pill-solid w-full justify-center">
          {isPending ? dict.checkout.submitting : dict.checkout.submit}
        </button>
        {state.status === "error" && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
