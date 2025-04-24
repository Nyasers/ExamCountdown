// import { $ } from "jquery"
import applyImageUrl from './background-loader/apply-image.js'
import { properties } from './property/index.js'

export const ec = {
    online: false,
    // origin: location.protocol == 'file:' ? 'https://ec.nyase.ru' : location.origin,
    connecttest: 'http://connectivitycheck.gstatic.com/generate_204',
    properties: properties,
    background: {
        set: applyImageUrl.bind(),
        reset: null,
    },
    applyConfig: null,
    plugin: {},
}
