"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, verifyPassword } from "@/lib/auth";

export type LoginFormState = {
  status: "idle" | "error";
  message?: string;
};

export async function login(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { status: "error", message: "Merci de renseigner votre email et votre mot de passe." };
  }

  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return { status: "error", message: "Identifiants incorrects." };
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return { status: "error", message: "Identifiants incorrects." };
  }

  await createSession(admin.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}
