import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { ResetPasswordForm } from "@/components/account/reset-password-form";

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;
  const { token } = await searchParams;
  const dict = await getDictionary(locale);

  if (!token) {
    return (
      <div className="mx-auto max-w-sm px-5 py-32 text-center sm:px-8">
        <h1 className="font-display text-xl font-bold">{dict.account.verificationInvalidTitle}</h1>
        <p className="mt-2 text-sm text-text-muted">{dict.account.verificationInvalidText}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-32 sm:px-8">
      <ResetPasswordForm token={token} />
    </div>
  );
}
