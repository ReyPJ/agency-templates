import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { clinic } from "../src/data/clinic.ts";
import { validateClinic } from "../src/data/validate.ts";

test("carries the seven specialties from the client's own list", () => {
  assert.deepEqual(
    clinic.specialties.map((s) => s.name),
    ["Ortodoncia", "Endodoncia", "Periodoncia", "Odontopediatría",
     "Estética Dental", "Cirugía Oral", "Implantología"],
  );
});

test("every specialty says what it solves, in plain language", () => {
  for (const s of clinic.specialties) {
    assert.ok(s.solves.length > 20, `${s.name} has no description`);
    assert.match(s.solves, /^[A-ZÁÉÍÓÚÑ]/, `${s.name} should read as a sentence`);
  }
});

test("both doctors carry a quote and a personal note", () => {
  assert.equal(clinic.doctors.length, 2);
  for (const d of clinic.doctors) {
    assert.ok(d.quote.length > 40, `${d.name} has no quote`);
    assert.ok(d.personalNote, `${d.name} has no personal note`);
  }
});

test("both doctor portraits point at the processed files, not the originals", () => {
  for (const d of clinic.doctors) {
    assert.ok(d.photo, `${d.name} has no photo`);
    assert.match(d.photo!.src, /^\/doctores\//);
    assert.equal(d.photo!.width, 480);
    assert.equal(d.photo!.height, 600);
    assert.ok(d.photo!.alt.length > 10, `${d.name} has a weak alt text`);
  }
});

// A typo in a path would pass every other assertion here and ship a broken
// image to the prospect, so check the files are actually on disk.
test("every image referenced by the client data exists in public/", () => {
  const paths = [
    clinic.brand.logo?.src,
    ...clinic.doctors.map((d) => d.photo?.src),
  ].filter((s): s is string => Boolean(s));

  assert.ok(paths.length > 0);
  for (const src of paths) {
    assert.ok(existsSync(`public${src}`), `missing file: public${src}`);
  }
});

test("the method keeps its three steps in order", () => {
  assert.deepEqual(
    clinic.method?.steps.map((p) => p.label),
    ["Antes", "Durante", "Después"],
  );
});

// Uppercase is a styling decision, applied with CSS. Storing it in the data
// would bake presentation into content, and some screen readers spell
// all-caps words out letter by letter.
test("step labels are not stored uppercased", () => {
  for (const step of clinic.method!.steps) {
    assert.notEqual(step.label, step.label.toUpperCase());
  }
});

test("the Google rating is 4.9 across 84 reviews", () => {
  assert.equal(clinic.rating?.score, 4.9);
  assert.equal(clinic.rating?.count, 84);
  assert.equal(clinic.rating?.source, "Google");
});

test("the hero headline is split into lines for the staggered reveal", () => {
  assert.ok(clinic.hero.headline.length >= 2);
  assert.match(
    clinic.hero.headline.join(" "),
    /Antes de tocar un diente, escuchamos\./,
  );
});

test("no banned copy anywhere in the client data", () => {
  const all = JSON.stringify(clinic).toLowerCase();
  for (const phrase of [
    "expertos en salud bucal",
    "tu sonrisa es nuestra prioridad",
    "calidad y profesionalismo",
  ]) {
    assert.ok(!all.includes(phrase), `banned copy present: ${phrase}`);
  }
});

// The clinic quotes no fixed prices; the conversion is the first appointment,
// never the treatment.
test("no prices anywhere in the client data", () => {
  assert.ok(!/\$\s?\d/.test(JSON.stringify(clinic)));
});

test("the exported clinic has already passed validation", () => {
  assert.doesNotThrow(() => validateClinic(clinic));
});
