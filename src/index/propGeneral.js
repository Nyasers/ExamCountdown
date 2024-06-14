import { ec } from './ec.js';

export const propGeneral = {
  fps: 0,
}

export function applyGeneralProperties(properties) {
  if (properties.fps) {
    ec.properties.general.fps = properties.fps;
  }
}
