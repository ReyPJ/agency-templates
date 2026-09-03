import type { Clinic } from "./types.ts";

export class InvalidClinic extends Error {
  constructor(field: string, reason: string) {
    super(`clinic.${field}: ${reason}`);
    this.name = "InvalidClinic";
  }
}

const DIGITS = /^\d{10,15}$/;

/** Runs at build time. A throw here breaks the build on purpose: a failed
 *  deploy beats a published demo with no way to contact the clinic. */
export function validateClinic(c: Clinic): Clinic {
  if (!c.brand?.name?.trim())
    throw new InvalidClinic("brand.name", "cannot be empty");
  if (!DIGITS.test(c.contact?.whatsapp ?? ""))
    throw new InvalidClinic(
      "contact.whatsapp",
      'must be 10 to 15 digits including country code, no "+" and no spaces (e.g. 5215512345678)',
    );
  if (!c.contact?.whatsappMessage?.trim())
    throw new InvalidClinic("contact.whatsappMessage", "cannot be empty");
  if (!DIGITS.test((c.contact?.phone ?? "").replace(/^\+/, "")))
    throw new InvalidClinic(
      "contact.phone",
      'must be 10 to 15 digits, optionally prefixed with "+"',
    );
  if (!c.contact?.phoneDisplay?.trim())
    throw new InvalidClinic("contact.phoneDisplay", "cannot be empty");
  if (!c.hero?.headline?.length)
    throw new InvalidClinic("hero.headline", "needs at least one line");
  if (!c.doctors?.length)
    throw new InvalidClinic("doctors", "needs at least one doctor");
  if (!c.specialties?.length)
    throw new InvalidClinic("specialties", "needs at least one specialty");
  return c;
}

/** The single source of the WhatsApp link. Nav and WhatsAppButton both call
 *  this; neither builds the URL on its own. */
export function whatsappUrl(c: Clinic): string {
  return `https://wa.me/${c.contact.whatsapp}?text=${encodeURIComponent(c.contact.whatsappMessage)}`;
}
