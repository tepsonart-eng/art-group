import Link from "next/link";
import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { verifyEmail } from "@/actions/user-auth";

export default async function VerifyEmailPage({
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

  const result = token ? await verifyEmail(token) : "invalid";

  const title =
    result === "ok"
      ? dict.account.verificationSuccessTitle
      : result === "expired"
        ? dict.account.verificationExpiredTitle
        : dict.account.verificationInvalidTitle;
  const text = result === "ok" ? dict.account.verificationSuccessText : dict.account.verificationInvalidText;

  return (
    <div className="mx-auto max-w-sm px-5 py-32 text-center sm:px-8">
      <h1 className="font-display text-xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-text-muted">{text}</p>
      <Link href={`/${locale}/compte`} className="mt-6 inline-block font-semibold text-accent hover:underline">
        {dict.account.backToAccount}
      </Link>
    </div>
  );
}
