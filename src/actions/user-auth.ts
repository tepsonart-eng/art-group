"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import {
  hashPassword,
  verifyPassword,
  createUserSession,
  destroyUserSession,
  getCurrentUser,
} from "@/lib/user-auth";
import { sendEmail } from "@/lib/email";
import { saveSiteAsset, UploadError } from "@/lib/upload";

const USER_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 heure, pour les deux types de token

export type AuthFormState = { status: "idle" | "success" | "error"; message?: string };

// --- Inscription ---
const signupSchema = z
  .object({
    name: z.string().trim().min(1),
    email: z.string().trim().email(),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["passwordConfirm"],
  });

export async function signup(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const locale = String(formData.get("locale") || "fr");
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  const email = parsed.data.email.toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { status: "error", message: "Un compte existe déjà avec cet email." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  const user = await prisma.user.create({
    data: { name: parsed.data.name, email, passwordHash },
  });

  // Email de vérification envoyé en best-effort — ne bloque jamais la création du compte.
  const token = crypto.randomBytes(32).toString("hex");
  await prisma.userToken.create({
    data: {
      token,
      type: "EMAIL_VERIFICATION",
      userId: user.id,
      expiresAt: new Date(Date.now() + USER_TOKEN_TTL_MS),
    },
  });
  const verifyUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/${locale}/compte/verification?token=${token}`;
  await sendEmail({
    to: email,
    subject: locale === "fr" ? "Vérifiez votre email" : "Verify your email",
    html: `<p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
  });

  await createUserSession(user.id);
  redirect(`/${locale}/compte`);
}

// --- Connexion ---
export async function login(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const locale = String(formData.get("locale") || "fr");
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    return { status: "error", message: "Merci de renseigner votre email et votre mot de passe." };
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { status: "error", message: "Identifiants incorrects." };

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return { status: "error", message: "Identifiants incorrects." };

  await createUserSession(user.id);
  redirect(`/${locale}/compte`);
}

// --- Déconnexion ---
export async function logout(locale: string) {
  await destroyUserSession();
  redirect(`/${locale}/compte/connexion`);
}

// --- Demande de réinitialisation de mot de passe ---
const requestResetSchema = z.object({ email: z.string().trim().email() });

export async function requestPasswordReset(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const locale = String(formData.get("locale") || "fr");
  const parsed = requestResetSchema.safeParse({ email: formData.get("email") });
  const generic: AuthFormState = {
    status: "success",
    message:
      locale === "fr"
        ? "Si un compte existe avec cet email, un lien de réinitialisation a été envoyé."
        : "If an account exists with this email, a reset link has been sent.",
  };
  if (!parsed.success) return generic;

  const email = parsed.data.email.toLowerCase();
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.userToken.create({
      data: {
        token,
        type: "PASSWORD_RESET",
        userId: user.id,
        expiresAt: new Date(Date.now() + USER_TOKEN_TTL_MS),
      },
    });
    const resetUrl = `${process.env.NEXT_PUBLIC_SITE_URL || ""}/${locale}/compte/reinitialiser-mot-de-passe?token=${token}`;
    await sendEmail({
      to: email,
      subject: locale === "fr" ? "Réinitialisation de mot de passe" : "Password reset",
      html: `<p><a href="${resetUrl}">${resetUrl}</a></p>`,
    });
  }
  // Toujours le même message générique, que l'email existe ou non (anti-énumération).
  return generic;
}

// --- Réinitialisation du mot de passe ---
const resetPasswordSchema = z
  .object({
    token: z.string().min(1),
    password: z.string().min(8),
    passwordConfirm: z.string().min(8),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["passwordConfirm"],
  });

export async function resetPassword(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    passwordConfirm: formData.get("passwordConfirm"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message || "Formulaire invalide." };
  }

  const tokenRow = await prisma.userToken.findUnique({ where: { token: parsed.data.token } });
  if (
    !tokenRow ||
    tokenRow.type !== "PASSWORD_RESET" ||
    tokenRow.consumedAt ||
    tokenRow.expiresAt < new Date()
  ) {
    return { status: "error", message: "Lien invalide ou expiré." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: tokenRow.userId }, data: { passwordHash } }),
    prisma.userToken.update({ where: { id: tokenRow.id }, data: { consumedAt: new Date() } }),
  ]);

  return { status: "success", message: "Mot de passe mis à jour, vous pouvez vous connecter." };
}

// --- Vérification d'email (lien GET, pas un formulaire) ---
export async function verifyEmail(token: string): Promise<"ok" | "invalid" | "expired"> {
  const tokenRow = await prisma.userToken.findUnique({ where: { token } });
  if (!tokenRow || tokenRow.type !== "EMAIL_VERIFICATION" || tokenRow.consumedAt) return "invalid";
  if (tokenRow.expiresAt < new Date()) return "expired";

  await prisma.$transaction([
    prisma.user.update({ where: { id: tokenRow.userId }, data: { emailVerifiedAt: new Date() } }),
    prisma.userToken.update({ where: { id: tokenRow.id }, data: { consumedAt: new Date() } }),
  ]);
  return "ok";
}

// --- Mise à jour du profil ---
export async function updateProfile(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const current = await getCurrentUser();
  if (!current) return { status: "error", message: "Non connecté." };

  const name = String(formData.get("name") || "").trim();
  const data: Record<string, unknown> = {};
  if (name) data.name = name;

  const avatar = formData.get("avatar");
  if (avatar instanceof File && avatar.size > 0) {
    try {
      data.avatarPath = await saveSiteAsset(avatar, "image");
    } catch (err) {
      if (err instanceof UploadError) {
        return { status: "error", message: err.message };
      }
      throw err;
    }
  }

  const currentPassword = String(formData.get("currentPassword") || "");
  const newPassword = String(formData.get("newPassword") || "");
  if (newPassword) {
    if (newPassword.length < 8) {
      return { status: "error", message: "Le nouveau mot de passe doit contenir au moins 8 caractères." };
    }
    const user = await prisma.user.findUnique({ where: { id: current.id } });
    if (!user || !(await verifyPassword(currentPassword, user.passwordHash))) {
      return { status: "error", message: "Mot de passe actuel incorrect." };
    }
    data.passwordHash = await hashPassword(newPassword);
  }

  await prisma.user.update({ where: { id: current.id }, data });
  return { status: "success", message: "Profil mis à jour." };
}
