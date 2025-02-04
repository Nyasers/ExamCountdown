// import { $ } from "jquery";
import { propUser } from './property/propUser.js';
import { propGeneral } from './property/propGeneral.js';
import applyImageUrl from './background-loader/apply-image.js';

export const ec = {
    online: false,
    origin: location.protocol == 'file:' ? 'https://ec.nyase.ru' : location.origin,
    properties: {
        user: propUser,
        general: propGeneral
    },
    background: {
        set: applyImageUrl.bind()
    },
    applyConfig: null,
    plugin: {},
};
