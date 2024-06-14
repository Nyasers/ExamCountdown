import { applyGeneralProperties } from "./propGeneral.js";
import { applyUserProperties } from "./propUser.js";

export default function () {
  window.wallpaperPropertyListener = {
    applyGeneralProperties: applyGeneralProperties,
    applyUserProperties: applyUserProperties
  };
  if (location.protocol !== 'file:') setTimeout(() => ec.exam.extra.fetch())
}
