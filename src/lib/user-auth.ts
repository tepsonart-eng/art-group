import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth";

export { hashPassword, verifyPassword };

const USER_SESSION_COOKIE = "tag_user_session";
const USER_SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export async function createUserSession(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + USER_SESSION_DURATION_MS);

  await prisma.userSession.create({ data: { token, userId, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(USER_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function destroyUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;
  if (token) {
    await prisma.userSession.deleteMany({ where: { token } });
  }
  cookieStore.delete(USER_SESSION_COOKIE);
}

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  emailVerifiedAt: Date | null;
  avatarPath: string | null;
};

export async function getCurrentUser(): Promise<CurrentUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(USER_SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.userSession.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date()) {
    if (session) await prisma.userSession.delete({ where: { id: session.id } });
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    emailVerifiedAt: session.user.emailVerifiedAt,
    avatarPath: session.user.avatarPath,
  };
}

export async function requireUser(locale: string) {
  const user = await getCurrentUser();
  if (!user) redirect(`/${locale}/compte/connexion`);
  return user;
}
