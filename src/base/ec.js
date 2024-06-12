import applyImageUrl from './apply-image.js';
import extension from './extension.js';
import fetchBW from "./bing-wallpaper.js";

export const ec = {
    online: false,
    origin: location.protocol == 'file:' ? 'https://ec.nyase.ru' : location.origin,
    version: new Date(VERSION),
    properties: {
        hitokoto: true,
        finalonly: false,
        bingwallpaper: true,
    },
    background: {
        default: 'file:///C%3A/Windows/Web/Wallpaper/Windows/img0.jpg',
        fetchBW: fetchBW.bind(),
        set: applyImageUrl.bind()
    },
    extension: extension,
    hitokoto: undefined
};
