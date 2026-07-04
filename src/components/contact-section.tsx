"use client";

import { MessageCircle } from "lucide-react";
import { useDictionary } from "@/components/dictionary-provider";
import { ContactForm } from "@/components/contact-form";

export function ContactSection({
  phone1,
  phone2,
  contactEmail,
  address,
  whatsappNumber,
  mapEmbedUrl,
  quoteFr,
  quoteEn,
}: {
  phone1: string;
  phone2: string;
  contactEmail: string;
  address: string;
  whatsappNumber: string;
  mapEmbedUrl: string;
  quoteFr: string;
  quoteEn: string;
}) {
  const { dict, locale } = useDictionary();
  const quote = locale === "fr" ? quoteFr : quoteEn;

  return (
    <section id="contact" className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
      <div className="title-composite text-center">
        <h2 className="text-3xl sm:text-4xl">
          <span className="accent-serif">{dict.contact.titleAccent}</span>{" "}
          <span className="accent-bold">{dict.contact.titleBold}</span>
        </h2>
        <div className="divider-dots" />
      </div>

      <div className="mx-auto mt-12 max-w-2xl rounded-2xl bg-surface-alt p-6 sm:p-8">
        <h3 className="font-display text-lg font-bold">{dict.contact.formTitle}</h3>
        <div className="mt-5">
          <ContactForm />
        </div>
      </div>

      <div className="mt-14 grid gap-8 overflow-hidden rounded-3xl bg-surface-alt lg:grid-cols-2">
        <div className="min-h-[320px]">
          {mapEmbedUrl && (
            <iframe
              src={mapEmbedUrl}
              className="h-full min-h-[320px] w-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Maps"
            />
          )}
        </div>
        <div className="flex flex-col justify-center gap-8 p-8 sm:p-10">
          <div className="space-y-4">
            <div className="timeline-item">
              <p className="text-sm text-text-muted">{address}</p>
            </div>
            {phone1 && (
              <div className="timeline-item">
                <p className="text-sm text-text-muted">{phone1}</p>
              </div>
            )}
            {phone2 && (
              <div className="timeline-item">
                <p className="text-sm text-text-muted">{phone2}</p>
              </div>
            )}
            <div className="timeline-item">
              <p className="text-sm text-text-muted">{contactEmail}</p>
            </div>
          </div>

          {quote && <p className="font-serif text-2xl italic leading-snug text-text">{quote}</p>}

          {whatsappNumber && (
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-pill-solid w-fit bg-[#25D366] shadow-[#25D366]/30 hover:bg-[#1ea952]"
            >
              <MessageCircle size={16} /> {dict.contact.whatsapp}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
