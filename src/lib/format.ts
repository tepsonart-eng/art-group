export function formatFileSize(bytes: number, locale: "fr" | "en" = "fr"): string {
  if (bytes <= 0) return locale === "fr" ? "0 Ko" : "0 KB";

  const units = locale === "fr" ? ["o", "Ko", "Mo", "Go"] : ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;

  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}
