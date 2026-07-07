"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useDictionary } from "@/components/dictionary-provider";
import { signup, type AuthFormState } from "@/actions/user-auth";

const initialState: AuthFormState = { status: "idle" };

export function SignupForm({ locale }: { locale: string }) {
  const { dict } = useDictionary();
  const [state, formAction, isPending] = useActionState(signup, initialState);

  return (
    <div className="mx-auto w-full max-w-sm rounded-2xl bg-surface-alt p-8">
      <h1 className="text-center font-display text-xl font-bold">{dict.account.signupTitle}</h1>
      <form action={formAction} className="mt-6 space-y-4">
        <input type="hidden" name="locale" value={locale} />
        <div>
          <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
            {dict.account.nameLabel}
          </label>
          <input
            name="name"
            required
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
            {dict.account.emailLabel}
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
            {dict.account.passwordLabel}
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
          {isPending ? dict.account.signupSubmitting : dict.account.signupSubmit}
        </button>
        {state.status === "error" && (
          <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
            {state.message}
          </p>
        )}
      </form>
      <p className="mt-5 text-center text-sm text-text-muted">
        {dict.account.alreadyHaveAccount}{" "}
        <Link href={`/${locale}/compte/connexion`} className="font-semibold text-accent hover:underline">
          {dict.account.loginTitle}
        </Link>
      </p>
    </div>
  );
}
