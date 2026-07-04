"use client";

import { useActionState } from "react";
import { createAdminUser, type AdminUserFormState } from "@/actions/admin/users";

const initialState: AdminUserFormState = { status: "idle" };

export function CreateAdminUserForm() {
  const [state, formAction, isPending] = useActionState(createAdminUser, initialState);

  return (
    <form action={formAction} className="mt-4 grid gap-3 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">Nom</label>
        <input
          name="name"
          required
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">Email</label>
        <input
          type="email"
          name="email"
          required
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">
          Mot de passe (8 caractères min.)
        </label>
        <input
          type="password"
          name="password"
          required
          minLength={8}
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">Rôle</label>
        <select
          name="role"
          defaultValue="EDITOR"
          className="w-full rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
        >
          <option value="SUPER_ADMIN">Super admin</option>
          <option value="EDITOR">Éditeur</option>
          <option value="MODERATOR">Modérateur</option>
        </select>
      </div>
      <button type="submit" disabled={isPending} className="btn-pill-solid sm:col-span-2">
        {isPending ? "Création..." : "Créer le compte"}
      </button>
      {state.status === "success" && (
        <p className="text-sm text-green-700 sm:col-span-2">Compte créé avec succès.</p>
      )}
      {state.status === "error" && <p className="text-sm text-red-700 sm:col-span-2">{state.message}</p>}
    </form>
  );
}
