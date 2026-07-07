"use client";

import { useActionState } from "react";
import { useDictionary } from "@/components/dictionary-provider";
import { resetPassword, type AuthFormState } from "@/actions/user-auth";

const initialState: AuthFormState = { status: "idle" };

export function ResetPasswordForm({ token }: { token: string }) {
  const { dict } = useDictionary();
  const [state, formAction, isPending] = useActionState(resetPassword, initialState);

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-surface-alt p-8">
      <h1 className="text-center font-display text-xl font-bold">{dict.account.resetPasswordTitle}</h1>
      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="token" value={token} />
        <div>
          <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
            {dict.account.newPasswordLabel}
          </label>
          <input
            type="password"
            name="password"
            required
            minLength={8}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
            {dict.account.passwordConfirmLabel}
          </label>
          <input
            type="password"
            name="passwordConfirm"
            required
            minLength={8}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <button type="submit" disabled={isPending} className="btn-pill-solid w-full justify-center">
          {isPending ? dict.account.resetPasswordSubmitting : dict.account.resetPasswordSubmit}
        </button>
        {state.status === "success" && (
          <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
            {state.message}
          </p>
        )}
        {state.status === "error" && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
            {state.message}
          </p>
        )}
      </form>
    </div>
  );
}
