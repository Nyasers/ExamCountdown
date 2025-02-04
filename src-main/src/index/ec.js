// import { $ } from "jquery";
import { properties } from './property/index.js';
import applyImageUrl from './background-loader/apply-image.js';

export const ec = {
    online: false,
    origin: location.protocol == 'file:' ? 'https://ec.nyase.ru' : location.origin,
    properties: properties,
    background: {
        set: applyImageUrl.bind()
    },
    applyConfig: null,
    plugin: {},
};
