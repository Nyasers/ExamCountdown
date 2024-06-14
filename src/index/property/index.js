import { applyGeneralProperties } from "./propGeneral.js";
import { applyUserProperties } from "./propUser.js";

export default function (window) {
  window.wallpaperPropertyListener = {
    applyGeneralProperties: applyGeneralProperties,
    applyUserProperties: applyUserProperties
  };
}
