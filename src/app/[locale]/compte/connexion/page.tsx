import { notFound, redirect } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getCurrentUser } from "@/lib/user-auth";
import { LoginForm } from "@/components/account/login-form";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const user = await getCurrentUser();
  if (user) redirect(`/${locale}/compte`);

  return (
    <div className="mx-auto max-w-sm px-5 py-32 sm:px-8">
      <LoginForm locale={locale} />
    </div>
  );
}
