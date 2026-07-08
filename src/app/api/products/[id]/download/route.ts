import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";
import { hasAccessToProduct } from "@/lib/access";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) {
    return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
  }

  const owns = await hasAccessToProduct(user.id, product.id);
  if (!owns) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  await prisma.product
    .update({ where: { id }, data: { downloadCount: { increment: 1 } } })
    .catch(() => {});

  const fileUrl = product.filePath.startsWith("http")
    ? product.filePath
    : new URL(product.filePath, request.url).toString();
  return NextResponse.redirect(fileUrl, { status: 307 });
}
