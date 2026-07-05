"use client";

import { useState } from "react";
import { uploadPresigned } from "@vercel/blob/client";

export function VideoUploadField({
  name,
  label,
  current,
  folder,
}: {
  name: string;
  label: string;
  current?: string | null;
  folder: string;
}) {
  const [url, setUrl] = useState<string | null>(current ?? null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setProgress(0);
    try {
      const result = await uploadPresigned(`${folder}/${Date.now()}-${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
        onUploadProgress: (p) => setProgress(p.percentage),
      });
      setUrl(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec de l'upload.");
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="sm:col-span-2">
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-text-muted">{label}</label>
      <input type="hidden" name={name} value={url ?? ""} />
      <input
        type="file"
        accept="video/mp4,video/webm,video/quicktime"
        onChange={handleChange}
        className="w-full rounded-lg border border-dashed border-line bg-surface px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-accent-soft file:px-3 file:py-1 file:text-accent"
      />
      {progress !== null && (
        <p className="mt-1 text-xs text-text-muted">Envoi en cours… {progress}%</p>
      )}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {url && progress === null && (
        <p className="mt-1 truncate text-xs text-green-700">Fichier prêt : {url}</p>
      )}
    </div>
  );
}
