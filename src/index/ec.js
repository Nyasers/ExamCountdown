import applyImageUrl from './background-loader/apply-image.js';
import extension from './extension.js';
import fetchBW from "../plugin/BingWallpaper/bing-wallpaper.js";
import { propUser } from './propUser.js';

export const ec = {
    online: false,
    origin: location.protocol == 'file:' ? 'https://ec.nyase.ru' : location.origin,
    version: new Date(VERSION),
    properties: propUser,
    background: {
        set: applyImageUrl.bind()
    },
    extension: extension,
    plugin: {},
};

ec.plugin.bingWallpaper = {
    fetch: fetchBW.bind(),
}