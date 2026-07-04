"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin, hashPassword } from "@/lib/auth";

function str(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export type AdminUserFormState = { status: "idle" | "success" | "error"; message?: string };

export async function createAdminUser(
  _prevState: AdminUserFormState,
  formData: FormData
): Promise<AdminUserFormState> {
  await requireAdmin(["SUPER_ADMIN"]);

  const email = str(formData, "email").toLowerCase();
  const name = str(formData, "name");
  const password = str(formData, "password");
  const role = str(formData, "role") as "SUPER_ADMIN" | "EDITOR" | "MODERATOR";

  if (!email || !name || password.length < 8) {
    return { status: "error", message: "Nom, email requis et mot de passe d'au moins 8 caractères." };
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return { status: "error", message: "Un compte existe déjà avec cet email." };
  }

  await prisma.adminUser.create({
    data: { name, email, role, passwordHash: await hashPassword(password) },
  });

  return { status: "success" };
}

export async function deleteAdminUser(formData: FormData) {
  const admin = await requireAdmin(["SUPER_ADMIN"]);
  const id = str(formData, "id");

  if (id === admin.id) {
    throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
  }

  const target = await prisma.adminUser.findUnique({ where: { id } });
  if (target?.role === "SUPER_ADMIN") {
    const superAdminCount = await prisma.adminUser.count({ where: { role: "SUPER_ADMIN" } });
    if (superAdminCount <= 1) {
      throw new Error("Impossible de supprimer le dernier compte Super admin.");
    }
  }

  await prisma.adminUser.delete({ where: { id } });
}
