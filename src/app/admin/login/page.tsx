"use client";

import { useActionState } from "react";
import { login, type LoginFormState } from "@/actions/auth";
import { LogoLockup } from "@/components/logo";

const initialState: LoginFormState = { status: "idle" };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(login, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink px-4 text-white">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-8 text-text shadow-2xl">
        <div className="flex justify-center">
          <LogoLockup />
        </div>
        <h1 className="mt-6 text-center font-display text-xl font-bold">Espace administrateur</h1>
        <form action={formAction} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
              Mot de passe
            </label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <button type="submit" disabled={isPending} className="btn-pill-solid w-full justify-center">
            {isPending ? "Connexion..." : "Se connecter"}
          </button>
          {state.status === "error" && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">{state.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
