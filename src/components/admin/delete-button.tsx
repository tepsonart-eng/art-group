"use client";

export function DeleteButton({
  action,
  id,
  confirmMessage = "Supprimer cet élément ?",
}: {
  action: (formData: FormData) => void | Promise<void>;
  id: string;
  confirmMessage?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
        Supprimer
      </button>
    </form>
  );
}
