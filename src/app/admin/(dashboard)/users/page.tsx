import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";
import { deleteAdminUser } from "@/actions/admin/users";
import { DeleteButton } from "@/components/admin/delete-button";
import { CreateAdminUserForm } from "@/components/admin/create-admin-user-form";

export default async function AdminUsersPage() {
  const admin = await getCurrentAdmin();
  if (admin?.role !== "SUPER_ADMIN") redirect("/admin");

  const users = await prisma.adminUser.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Utilisateurs administrateurs</h1>
      <p className="mt-1 text-sm text-text-muted">
        Réservé au rôle Super admin. Trois rôles disponibles : Super admin, Éditeur, Modérateur.
      </p>

      <div className="mt-8 space-y-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between rounded-xl border border-line bg-surface-alt p-4"
          >
            <div>
              <p className="font-display font-semibold">{user.name}</p>
              <p className="text-xs text-text-muted">
                {user.email} · {user.role}
              </p>
            </div>
            {user.id !== admin.id && <DeleteButton action={deleteAdminUser} id={user.id} />}
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-dashed border-line p-4">
        <h2 className="font-display font-semibold">Ajouter un administrateur</h2>
        <CreateAdminUserForm />
      </div>
    </div>
  );
}
