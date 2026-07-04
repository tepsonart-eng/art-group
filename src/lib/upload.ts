import { mkdir, writeFile } from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx", ".txt", ".rtf", ".odt"];
const MAX_SIZE_BYTES = 8 * 1024 * 1024;

export class UploadError extends Error {}

export async function saveContactAttachment(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;

  if (file.size > MAX_SIZE_BYTES) {
    throw new UploadError("Le fichier dépasse la taille maximale autorisée (8 Mo).");
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    throw new UploadError("Format de fichier non autorisé (PDF, Word, TXT, RTF, ODT uniquement).");
  }

  const dir = path.join(process.cwd(), "uploads", "contact");
  await mkdir(dir, { recursive: true });

  const safeName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, safeName), buffer);

  return safeName;
}

const SITE_ASSET_EXTENSIONS: Record<string, string[]> = {
  image: [".png", ".jpg", ".jpeg", ".webp", ".svg"],
  video: [".mp4", ".webm"],
  document: [".pdf"],
};
const SITE_ASSET_MAX_SIZE = 40 * 1024 * 1024;

export async function saveSiteAsset(
  file: File,
  kind: "image" | "video" | "document"
): Promise<string> {
  if (file.size > SITE_ASSET_MAX_SIZE) {
    throw new UploadError("Le fichier dépasse la taille maximale autorisée (40 Mo).");
  }
  const ext = path.extname(file.name).toLowerCase();
  if (!SITE_ASSET_EXTENSIONS[kind].includes(ext)) {
    throw new UploadError("Format de fichier non autorisé pour ce champ.");
  }

  const dir = path.join(process.cwd(), "public", "uploads", "site");
  await mkdir(dir, { recursive: true });

  const safeName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, safeName), buffer);

  return `/uploads/site/${safeName}`;
}
