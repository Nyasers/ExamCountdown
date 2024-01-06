import { minify } from 'terser';
import postcss from "postcss";
import cssnano from "cssnano";
import litePreset from "cssnano-preset-lite";
import autoprefixer from "autoprefixer";

export async function minifyJS(code) {
  var opitions = {
    compress: {
      passes: 3,
      unsafe: true,
      unsafe_arrows: true,
      unsafe_regexp: true,
      unsafe_comps: true,
      unsafe_Function: true,
      unsafe_math: true,
      unsafe_proto: true,
    },
    format: {
      ecma: 2016,
      comments: false,
    },
    mangle: {
      reserved: ["ec"],
    },
    module: true,
    toplevel: true,
  };
  var result;
  try {
    result = (await minify(code, opitions)).code;
    console.info(((result.length / code.length) * 100).toFixed(2) + "%js");
  } catch (error) {
    result = code;
    console.error(error);
  }
  return result;
}

export async function minifyCSS(code) {
  var preset = litePreset({ discardComments: true });
  var result;
  try {
    result = postcss([cssnano({ preset, plugins: [autoprefixer] })])
      .process(code)
      .toString()
      .replace("\n", "");
    console.info(((result.length / code.length) * 100).toFixed(2) + "%css");
  } catch (error) {
    result = code;
    console.error(error);
  }
  return result;
}

export async function minifyJSON(code) {
  var result;
  try {
    result = JSON.stringify(JSON.parse(code));
    console.info(((result.length / code.length) * 100).toFixed(2) + "%json");
  } catch (error) {
    result = code;
    console.error(error);
  }
  return result;
}
