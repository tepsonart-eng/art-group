import { notFound } from "next/navigation";
import { isValidLocale, type Locale } from "@/lib/i18n";
import { requireUser } from "@/lib/user-auth";
import { logout } from "@/actions/user-auth";
import { getDictionary } from "@/lib/i18n";
import { ProfileForm } from "@/components/account/profile-form";
import { MyTrainings } from "@/components/account/my-trainings";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isValidLocale(rawLocale)) notFound();
  const locale = rawLocale as Locale;

  const user = await requireUser(locale);
  const dict = await getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl px-5 py-32 sm:px-8">
      <h1 className="font-display text-3xl font-extrabold">{dict.account.dashboardTitle}</h1>

      <div className="mt-6 flex flex-wrap items-center gap-3 rounded-2xl bg-surface-alt p-6">
        <div>
          <p className="font-display font-semibold">{user.name}</p>
          <p className="text-sm text-text-muted">{user.email}</p>
        </div>
        {!user.emailVerifiedAt && (
          <span className="ml-auto rounded-full bg-amber-100 px-3 py-1 text-[11px] font-display font-semibold uppercase tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-300">
            {dict.account.verificationPendingBadge}
          </span>
        )}
      </div>

      <div className="mt-6">
        <MyTrainings
          userId={user.id}
          locale={locale}
          title={dict.account.myTrainingsTitle}
          emptyText={dict.account.noTrainingsYet}
          resumeLabel={dict.trainings.resumeButton}
        />
      </div>

      <div className="mt-6">
        <ProfileForm name={user.name} />
      </div>

      <p className="mt-6 text-sm italic text-text-muted">{dict.account.futurePhasesNotice}</p>

      <form action={logout.bind(null, locale)} className="mt-8">
        <button type="submit" className="text-sm font-semibold text-accent hover:underline">
          {dict.account.logoutButton}
        </button>
      </form>
    </div>
  );
}
