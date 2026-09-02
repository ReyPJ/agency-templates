import { test } from "node:test";
import assert from "node:assert/strict";
import { validarClinica, urlWhatsapp, ClinicaInvalida } from "../src/data/validar.ts";
import type { Clinica } from "../src/data/tipos.ts";

function base(): Clinica {
  return {
    marca: { nombre: "Clínica Ejemplo", tipo: "Clínica dental" },
    contacto: {
      whatsapp: "5215512345678",
      mensajeWhatsapp: "Hola, quiero agendar una valoración.",
      telefono: "+525512345678",
      telefonoVisible: "55 1234 5678",
    },
    tema: {
      fondo: "#FFF", superficie: "#EEE", tinta: "#000", tintaSuave: "#555",
      borde: "#DDD", acento: "#0A0", acentoTinta: "#FFF",
      inversoFondo: "#001", inversoTinta: "#EEF", inversoTintaSuave: "#88A",
      acentoClaro: "#AFA",
    },
    seo: { titulo: "t", descripcion: "d", url: "https://ejemplo.mx" },
    hero: { titular: ["Una línea"], bajada: "b", cta: "Agendar" },
    doctores: [{ nombre: "Dra. N", rol: "r", funcion: "f", cita: "c" }],
    especialidades: [{ nombre: "Ortodoncia", resuelve: "r" }],
  };
}

test("acepta una clínica completa", () => {
  assert.doesNotThrow(() => validarClinica(base()));
});

test("rechaza whatsapp vacío", () => {
  const c = base(); c.contacto.whatsapp = "";
  assert.throws(() => validarClinica(c), ClinicaInvalida);
});

test("rechaza whatsapp con + o espacios", () => {
  const c = base(); c.contacto.whatsapp = "+52 155 1234 5678";
  assert.throws(() => validarClinica(c), /whatsapp/);
});

test("rechaza teléfono vacío", () => {
  const c = base(); c.contacto.telefono = "";
  assert.throws(() => validarClinica(c), /telefono/);
});

test("rechaza cero doctores", () => {
  const c = base(); c.doctores = [];
  assert.throws(() => validarClinica(c), /doctores/);
});

test("rechaza cero especialidades", () => {
  const c = base(); c.especialidades = [];
  assert.throws(() => validarClinica(c), /especialidades/);
});

test("rechaza hero sin líneas de titular", () => {
  const c = base(); c.hero.titular = [];
  assert.throws(() => validarClinica(c), /titular/);
});

test("las secciones opcionales pueden faltar sin error", () => {
  const c = base();
  assert.equal(c.metodo, undefined);
  assert.equal(c.resenas, undefined);
  assert.equal(c.ubicacion, undefined);
  assert.equal(c.calificacion, undefined);
  assert.doesNotThrow(() => validarClinica(c));
});

test("el mensaje de error nombra el campo exacto", () => {
  const c = base(); c.contacto.whatsapp = "";
  assert.throws(() => validarClinica(c), /clinica\.contacto\.whatsapp/);
});

test("urlWhatsapp arma el wa.me con el mensaje codificado", () => {
  assert.equal(
    urlWhatsapp(base()),
    "https://wa.me/5215512345678?text=Hola%2C%20quiero%20agendar%20una%20valoraci%C3%B3n.",
  );
});
