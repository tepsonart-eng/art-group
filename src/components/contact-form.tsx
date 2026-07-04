"use client";

import { useActionState } from "react";
import { submitContactMessage, type ContactFormState } from "@/actions/contact";
import { useDictionary } from "@/components/dictionary-provider";

const initialState: ContactFormState = { status: "idle" };

export function ContactForm({ compact = false }: { compact?: boolean }) {
  const { dict } = useDictionary();
  const [state, formAction, isPending] = useActionState(submitContactMessage, initialState);

  return (
    <form action={formAction} className="space-y-4">
      {/* Honeypot field, hidden from real users */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={dict.form.name} name="name" required />
        <Field label={dict.form.company} name="company" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={dict.form.email} name="email" type="email" required />
        <Field label={dict.form.phone} name="phone" type="tel" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={dict.form.budget} name="budget" />
        <Field label={dict.form.subject} name="subject" required />
      </div>
      <div>
        <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
          {dict.form.message}
        </label>
        <textarea
          name="message"
          required
          rows={compact ? 3 : 5}
          className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
          {dict.form.attachment}
        </label>
        <input
          type="file"
          name="attachment"
          accept=".pdf,.doc,.docx,.txt,.rtf,.odt"
          className="w-full rounded-xl border border-dashed border-line bg-surface px-4 py-3 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
        />
      </div>

      <button type="submit" disabled={isPending} className="btn-pill-solid w-full justify-center sm:w-auto">
        {isPending ? dict.form.submitting : dict.form.submit}
      </button>

      {state.status === "success" && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800 dark:bg-green-950 dark:text-green-300">
          {dict.form.success}
        </p>
      )}
      {state.status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950 dark:text-red-300">
          {state.message && state.message !== "invalid" ? state.message : dict.form.error}
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-display font-semibold uppercase tracking-wide text-text-muted">
        {label}
      </label>
      <input
        type={type}
        name={name}
        required={required}
        className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm outline-none focus:border-accent"
      />
    </div>
  );
}
