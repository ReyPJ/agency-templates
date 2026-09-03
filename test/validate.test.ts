import { test } from "node:test";
import assert from "node:assert/strict";
import { validateClinic, whatsappUrl, InvalidClinic } from "../src/data/validate.ts";
import type { Clinic } from "../src/data/types.ts";

function base(): Clinic {
  return {
    brand: { name: "Clínica Ejemplo", kind: "Clínica dental" },
    contact: {
      whatsapp: "5215512345678",
      whatsappMessage: "Hola, quiero agendar una valoración.",
      phone: "+525512345678",
      phoneDisplay: "55 1234 5678",
    },
    theme: {
      background: "#FFF", surface: "#EEE", ink: "#000", inkSoft: "#555",
      line: "#DDD", accent: "#0A0", accentInk: "#FFF",
      invertedBackground: "#001", invertedInk: "#EEF", invertedInkSoft: "#88A",
      accentLight: "#AFA",
    },
    seo: { title: "t", description: "d", url: "https://ejemplo.mx" },
    hero: { headline: ["Una línea"], subhead: "b", cta: "Agendar" },
    doctors: {
      title: "Doctores",
      people: [{ name: "Dra. N", role: "r", duties: "f", quote: "c" }],
    },
    specialties: {
      title: "Especialidades",
      items: [{ name: "Ortodoncia", solves: "r" }],
    },
    closing: { headline: "Una frase de cierre.", cta: "Agendar" },
  };
}

test("accepts a complete clinic", () => {
  assert.doesNotThrow(() => validateClinic(base()));
});

// One test per required rule. Each must fail if its rule is deleted.

test("rejects an empty brand name", () => {
  const c = base(); c.brand.name = "";
  assert.throws(() => validateClinic(c), /clinic\.brand\.name/);
});

test("rejects a whitespace-only brand name", () => {
  const c = base(); c.brand.name = "   ";
  assert.throws(() => validateClinic(c), /clinic\.brand\.name/);
});

test("rejects an empty whatsapp number", () => {
  const c = base(); c.contact.whatsapp = "";
  assert.throws(() => validateClinic(c), InvalidClinic);
});

test('rejects a whatsapp number carrying "+" or spaces', () => {
  const c = base(); c.contact.whatsapp = "+52 155 1234 5678";
  assert.throws(() => validateClinic(c), /contact\.whatsapp/);
});

test("rejects an empty whatsapp message", () => {
  const c = base(); c.contact.whatsappMessage = "";
  assert.throws(() => validateClinic(c), /clinic\.contact\.whatsappMessage/);
});

test("rejects an empty phone", () => {
  const c = base(); c.contact.phone = "";
  assert.throws(() => validateClinic(c), /contact\.phone/);
});

test("rejects a malformed but non-empty phone", () => {
  const c = base(); c.contact.phone = "55 1234 5678";
  assert.throws(() => validateClinic(c), /contact\.phone/);
});

test('accepts a phone with a single leading "+"', () => {
  const c = base(); c.contact.phone = "+525512345678";
  assert.doesNotThrow(() => validateClinic(c));
});

test("rejects an empty phone display", () => {
  const c = base(); c.contact.phoneDisplay = "";
  assert.throws(() => validateClinic(c), /clinic\.contact\.phoneDisplay/);
});

test("rejects a hero with no headline lines", () => {
  const c = base(); c.hero.headline = [];
  assert.throws(() => validateClinic(c), /hero\.headline/);
});

test("rejects zero doctors", () => {
  const c = base(); c.doctors.people = [];
  assert.throws(() => validateClinic(c), /doctors\.people/);
});

test("rejects an empty closing headline", () => {
  const c = base(); c.closing.headline = "";
  assert.throws(() => validateClinic(c), /clinic\.closing\.headline/);
});

test("rejects an empty closing cta", () => {
  const c = base(); c.closing.cta = "";
  assert.throws(() => validateClinic(c), /clinic\.closing\.cta/);
});

test("rejects zero specialties", () => {
  const c = base(); c.specialties.items = [];
  assert.throws(() => validateClinic(c), /specialties\.items/);
});

// Digit-count boundaries, checked on both phone-ish fields.

test("rejects a whatsapp number below 10 digits", () => {
  const c = base(); c.contact.whatsapp = "123456789";
  assert.throws(() => validateClinic(c), /contact\.whatsapp/);
});

test("rejects a whatsapp number above 15 digits", () => {
  const c = base(); c.contact.whatsapp = "1234567890123456";
  assert.throws(() => validateClinic(c), /contact\.whatsapp/);
});

test("accepts whatsapp numbers at both ends of the range", () => {
  const low = base(); low.contact.whatsapp = "1234567890";
  assert.doesNotThrow(() => validateClinic(low));
  const high = base(); high.contact.whatsapp = "123456789012345";
  assert.doesNotThrow(() => validateClinic(high));
});

test("optional sections may be absent", () => {
  const c = base();
  assert.equal(c.method, undefined);
  assert.equal(c.reviews, undefined);
  assert.equal(c.location, undefined);
  assert.equal(c.rating, undefined);
  assert.doesNotThrow(() => validateClinic(c));
});

test("the error message names the exact field path", () => {
  const c = base(); c.contact.whatsapp = "";
  assert.throws(() => validateClinic(c), /clinic\.contact\.whatsapp/);
});

test("whatsappUrl builds the wa.me link with the message encoded", () => {
  assert.equal(
    whatsappUrl(base()),
    "https://wa.me/5215512345678?text=Hola%2C%20quiero%20agendar%20una%20valoraci%C3%B3n.",
  );
});
