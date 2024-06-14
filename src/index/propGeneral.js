import { ec } from './ec.js';

export function applyGeneralProperties(properties) {
  if (properties.fps) {
    ec.properties.fps = properties.fps;
  }
}
