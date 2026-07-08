import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const resource = await prisma.resource.findUnique({ where: { id } });
  if (!resource) {
    return NextResponse.json({ error: "Ressource introuvable" }, { status: 404 });
  }

  await prisma.resource
    .update({ where: { id }, data: { downloadCount: { increment: 1 } } })
    .catch(() => {});

  const fileUrl = resource.filePath.startsWith("http")
    ? resource.filePath
    : new URL(resource.filePath, request.url).toString();

  return NextResponse.redirect(fileUrl, { status: 307 });
}
