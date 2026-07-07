import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { RequestResetForm } from "@/components/account/request-reset-form";

export default async function RequestResetPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  return (
    <div className="mx-auto max-w-sm px-5 py-32 sm:px-8">
      <RequestResetForm locale={locale} />
    </div>
  );
}
