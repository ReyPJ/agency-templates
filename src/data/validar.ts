import type { Clinica } from "./tipos.ts";

export class ClinicaInvalida extends Error {
  constructor(campo: string, motivo: string) {
    super(`clinica.${campo}: ${motivo}`);
    this.name = "ClinicaInvalida";
  }
}

const DIGITOS = /^\d{10,15}$/;

/** Corre en build time. Un throw aquí revienta el build a propósito:
 *  vale más un deploy fallido que un demo publicado sin vía de contacto. */
export function validarClinica(c: Clinica): Clinica {
  if (!c.marca?.nombre?.trim())
    throw new ClinicaInvalida("marca.nombre", "no puede estar vacío");
  if (!DIGITOS.test(c.contacto?.whatsapp ?? ""))
    throw new ClinicaInvalida(
      "contacto.whatsapp",
      "deben ser 10 a 15 dígitos con lada país, sin + ni espacios (ej. 5215512345678)",
    );
  if (!c.contacto?.mensajeWhatsapp?.trim())
    throw new ClinicaInvalida("contacto.mensajeWhatsapp", "no puede estar vacío");
  if (!DIGITOS.test((c.contacto?.telefono ?? "").replace(/^\+/, "")))
    throw new ClinicaInvalida(
      "contacto.telefono",
      "deben ser 10 a 15 dígitos, opcionalmente con + al inicio",
    );
  if (!c.contacto?.telefonoVisible?.trim())
    throw new ClinicaInvalida("contacto.telefonoVisible", "no puede estar vacío");
  if (!c.hero?.titular?.length)
    throw new ClinicaInvalida("hero.titular", "debe tener al menos una línea");
  if (!c.doctores?.length)
    throw new ClinicaInvalida("doctores", "debe haber al menos un doctor");
  if (!c.especialidades?.length)
    throw new ClinicaInvalida("especialidades", "debe haber al menos una especialidad");
  return c;
}

/** Única fuente del enlace de WhatsApp. Nav y BotonWhatsApp la usan; ninguno
 *  arma la URL por su cuenta. */
export function urlWhatsapp(c: Clinica): string {
  return `https://wa.me/${c.contacto.whatsapp}?text=${encodeURIComponent(c.contacto.mensajeWhatsapp)}`;
}
