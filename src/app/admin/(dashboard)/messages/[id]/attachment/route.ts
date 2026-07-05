import { NextResponse } from "next/server";
import path from "path";
import { readFile } from "fs/promises";
import { prisma } from "@/lib/prisma";
import { getCurrentAdmin } from "@/lib/auth";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await context.params;
  const message = await prisma.contactMessage.findUnique({ where: { id } });
  if (!message?.attachmentPath) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  const fileName = message.attachmentPath.split("/").pop() ?? "piece-jointe";

  try {
    if (message.attachmentPath.startsWith("http")) {
      const response = await fetch(message.attachmentPath);
      if (!response.ok) throw new Error("fetch failed");
      const buffer = Buffer.from(await response.arrayBuffer());
      return new NextResponse(new Uint8Array(buffer), {
        headers: {
          "Content-Disposition": `attachment; filename="${fileName}"`,
          "Content-Type": "application/octet-stream",
        },
      });
    }

    const filePath = path.join(process.cwd(), "uploads", "contact", message.attachmentPath);
    const buffer = await readFile(filePath);
    return new NextResponse(new Uint8Array(buffer), {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }
}
