import applyImageUrl from './apply-image.js';
import extension from './extension.js';
import fetchBW from "./bing-wallpaper.js";

export const ec = {
    online: false,
    origin: location.protocol == 'file:' ? 'https://ec.nyase.ru' : location.origin,
    version: new Date(VERSION),
    properties: {
        background: {
            value: 'file:///C%3A/Windows/Web/Wallpaper/Windows/img0.jpg',
            func: function (value) {
                ec.properties.background.value = value;
                ec.background.set(ec.properties.background.value);
            }
        },
        breakon: {
            value: '高考',
            func: function (value) {
                ec.properties.breakon.value = value;
                ec.exam.build(ec.properties.breakon.value);
            }
        },
        finalonly: {
            value: false,
            func: function (value) {
                ec.properties.finalonly.value = value;
                ec.exam.build();
            }
        },
        hitokoto: {
            value: true,
            func: function (value) {
                ec.properties.hitokoto.value = value;
            }
        },
        bingwallpaper: {
            value: true,
            func: function (value) {
                ec.properties.bingwallpaper.value = value;
                if (ec.online) {
                    if (ec.properties.bingwallpaper.value)
                        ec.background.fetchBW();
                    else
                        ec.background.set(ec.properties.background.value);
                }
            }
        },
        extraexams: {
            value: 'https://ec.nyase.ru/extraexams.json',
            func: function (value) {
                ec.properties.extraexams.value = value;
                if (ec.online)
                    ec.exam.extra.fetch(ec.properties.extraexams.value);
                else
                    ec.exam.extra.url = ec.properties.extraexams.value;
            }
        },
    },
    background: {
        fetchBW: fetchBW.bind(),
        set: applyImageUrl.bind()
    },
    extension: extension,
    hitokoto: undefined
};
