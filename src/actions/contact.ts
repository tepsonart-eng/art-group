"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { saveContactAttachment, UploadError } from "@/lib/upload";

const contactSchema = z.object({
  name: z.string().trim().min(1),
  company: z.string().trim().optional().default(""),
  email: z.string().trim().email(),
  phone: z.string().trim().optional().default(""),
  budget: z.string().trim().optional().default(""),
  subject: z.string().trim().min(1),
  message: z.string().trim().min(1),
});

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message?: string;
};

export async function submitContactMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  // Honeypot: hidden field only bots fill. Pretend success without doing anything.
  if (formData.get("website")) {
    return { status: "success" };
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    company: formData.get("company"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    budget: formData.get("budget"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { status: "error", message: "invalid" };
  }

  let attachmentPath: string | null = null;
  const file = formData.get("attachment");
  if (file instanceof File && file.size > 0) {
    try {
      attachmentPath = await saveContactAttachment(file);
    } catch (err) {
      if (err instanceof UploadError) {
        return { status: "error", message: err.message };
      }
      throw err;
    }
  }

  await prisma.contactMessage.create({
    data: {
      name: parsed.data.name,
      company: parsed.data.company,
      email: parsed.data.email,
      phone: parsed.data.phone,
      budget: parsed.data.budget,
      subject: parsed.data.subject,
      message: parsed.data.message,
      attachmentPath,
    },
  });

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: "TEPSON ART GROUP <onboarding@resend.dev>",
        to: process.env.CONTACT_NOTIFICATION_EMAIL || "tepsonart@gmail.com",
        replyTo: parsed.data.email,
        subject: `[Site web] ${parsed.data.subject}`,
        text: [
          `Nom: ${parsed.data.name}`,
          `Entreprise: ${parsed.data.company}`,
          `Email: ${parsed.data.email}`,
          `Téléphone: ${parsed.data.phone}`,
          `Budget: ${parsed.data.budget}`,
          "",
          parsed.data.message,
        ].join("\n"),
      });
    } catch (err) {
      console.error("[contact] échec de l'envoi de l'email de notification", err);
    }
  }

  return { status: "success" };
}
