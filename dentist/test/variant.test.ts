import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolveVariant, InvalidClinic } from "../src/data/validate.ts";
import { clinic } from "../src/data/clinic.ts";

test("without a variant the page is editorial", () => {
  const { variant, ...rest } = clinic;
  assert.equal(resolveVariant(rest), "editorial");
});

test("the environment override wins over clinic.ts", () => {
  assert.equal(resolveVariant({ ...clinic, variant: "warm" }, "studio"), "studio");
});

test("an empty override falls back to clinic.ts", () => {
  assert.equal(resolveVariant({ ...clinic, variant: "warm" }, "  "), "warm");
});

test("an unknown variant breaks the build instead of picking another look", () => {
  assert.throws(() => resolveVariant(clinic, "brutalist"), InvalidClinic);
});

// Every variant is a full page. A missing Page.astro would only surface as a
// build error for whoever picks that variant, possibly mid-sale.
test("every variant ships its page", () => {
  for (const name of ["editorial", "studio", "warm"]) {
    assert.ok(existsSync(`src/variants/${name}/Page.astro`), `${name} has no Page.astro`);
  }
});
