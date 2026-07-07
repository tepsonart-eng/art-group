"use client";

import { useActionState } from "react";
import { useDictionary } from "@/components/dictionary-provider";
import { updateProfile, type AuthFormState } from "@/actions/user-auth";

const initialState: AuthFormState = { status: "idle" };

export function ProfileForm({ name }: { name: string }) {
  const { dict } = useDictionary();
  const [state, formAction, isPending] = useActionState(updateProfile, initialState);

  return (
    <div className="rounded-2xl bg-surface-alt p-6 sm:p-8">
      <h2 className="font-display text-lg font-bold">{dict.account.profileEditTitle}</h2>
      <form action={formAction} className="mt-5 space-y-4">
        <div>
          <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
            {dict.account.nameLabel}
          </label>
          <input
            name="name"
            defaultValue={name}
            className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
            {dict.account.avatarLabel}
          </label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            className="w-full rounded-xl border border-dashed border-line bg-surface px-4 py-3 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
              {dict.account.currentPasswordLabel}
            </label>
            <input
              type="password"
              name="currentPassword"
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
              {dict.account.newPasswordLabel}
            </label>
            <input
              type="password"
              name="newPassword"
              minLength={8}
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
            />
          </div>
        </div>
        <button type="submit" disabled={isPending} className="btn-pill-solid">
          {isPending ? dict.account.saving : dict.account.saveChanges}
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
