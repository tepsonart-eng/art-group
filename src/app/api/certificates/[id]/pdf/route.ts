import { createElement, type ReactElement } from "react";
import { NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/user-auth";
import { CertificatePdf } from "@/components/certificate/certificate-pdf";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const certificate = await prisma.certificate.findUnique({
    where: { id },
    include: { training: true, user: true },
  });

  if (!certificate || certificate.userId !== user.id) {
    return NextResponse.json({ error: "Certificat introuvable" }, { status: 404 });
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const document = createElement(CertificatePdf, {
    participantName: certificate.user.name,
    trainingTitle: certificate.training.titleFr,
    issuedAt: certificate.issuedAt,
    certificateNumber: certificate.certificateNumber,
    verificationUrl: `${base}/fr/certificats/verifier?code=${certificate.certificateNumber}`,
  }) as ReactElement<DocumentProps>;
  const buffer = await renderToBuffer(document);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="certificat-${certificate.certificateNumber}.pdf"`,
    },
  });
}
