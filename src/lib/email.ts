import { Resend } from "resend";

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log(`[email:dev] to=${to} subject="${subject}"\n${html}`);
    return;
  }

  try {
    const resend = new Resend(apiKey);
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "TEPSON ART GROUP <no-reply@tepsonartgroup.com>",
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error("[email] send failed:", err);
  }
}
