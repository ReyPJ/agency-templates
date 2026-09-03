import { test } from "node:test";
import assert from "node:assert/strict";
import { validateClinic } from "../src/data/validate.ts";
import { clinic } from "../src/data/clinic.ts";
import type { Clinic } from "../src/data/types.ts";

// The product's central promise: a new client is resolved by editing
// clinic.ts and nothing else. That only holds if dropping a field is a
// supported way to remove a section — no component may require it.

test("a clinic with no method is still valid", () => {
  const { method, ...rest } = clinic;
  assert.doesNotThrow(() => validateClinic(rest as Clinic));
});

test("a clinic with no reviews, location or rating is still valid", () => {
  const { reviews, location, rating, ...rest } = clinic;
  assert.doesNotThrow(() => validateClinic(rest as Clinic));
});

test("every optional section can be dropped at once", () => {
  const { method, reviews, location, rating, ...rest } = clinic;
  assert.doesNotThrow(() => validateClinic(rest as Clinic));
});

test("a clinic with a single doctor is still valid", () => {
  assert.doesNotThrow(() =>
    validateClinic({ ...clinic, doctors: [clinic.doctors[0]] }));
});

test("a clinic with four specialties is still valid", () => {
  assert.doesNotThrow(() =>
    validateClinic({ ...clinic, specialties: clinic.specialties.slice(0, 4) }));
});

test("doctors render without a photo", () => {
  const withoutPhotos = clinic.doctors.map(({ photo, ...d }) => d);
  assert.doesNotThrow(() => validateClinic({ ...clinic, doctors: withoutPhotos }));
  assert.ok(withoutPhotos.every((d) => d.photo === undefined));
});

test("a brand with no logo and no tagline is still valid", () => {
  const { logo, tagline, ...brand } = clinic.brand;
  assert.doesNotThrow(() => validateClinic({ ...clinic, brand }));
});
