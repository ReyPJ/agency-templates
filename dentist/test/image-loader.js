// clinic.ts imports images so that Astro can read their real dimensions and
// emit optimised formats. Those imports only resolve inside the bundler, so
// the test runner needs to know what a .jpg means. This stubs them with the
// same shape Astro produces, keeping the suite free of a test framework.
import { fileURLToPath } from "node:url";

const IMAGE = /\.(jpe?g|png|webp|avif|gif|svg)$/i;

export async function resolve(specifier, context, next) {
  if (IMAGE.test(specifier)) {
    return {
      url: new URL(specifier, context.parentURL).href,
      format: "module",
      shortCircuit: true,
    };
  }
  return next(specifier, context);
}

export async function load(url, context, next) {
  if (IMAGE.test(url)) {
    // The real file path travels through, so tests can assert the asset the
    // data points at actually exists.
    const path = fileURLToPath(url);
    return {
      format: "module",
      shortCircuit: true,
      source: `export default ${JSON.stringify({
        src: path,
        width: 0,
        height: 0,
        format: path.split(".").pop(),
      })};`,
    };
  }
  return next(url, context);
}
