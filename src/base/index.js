import $ from 'jquery';
import time from './time.js';
import { applyImageUrl } from './apply-image.js';
import main from './main.js';
import extension from './extension.js';
import fetchBW from "./bing-wallpaper.js";
import '../../cache/index.css';

// Expose $ and ec
globalThis.$ = $;
globalThis.ec = {
    origin: location.protocol == 'file:' ? 'https://ec.nyase.ru' : location.origin,
    version: new Date(VERSION),
    extable: {
        hitokoto: true
    },
    background: {
        default: 'file:///C%3A/Windows/Web/Wallpaper/Windows/img0.jpg',
        fetchBW: fetchBW.bind(),
        set: undefined
    },
    extension: extension,
    hitokoto: undefined
};

// Init
ec.background.set = applyImageUrl.bind()
main();

// wait for online
async function onConnected() {
    setTimeout(ec.extension.fetch.bind());
    setTimeout(ec.exam.extra.fetch.bind());
    if (location.protocol !== 'file:') {
        setTimeout(() => fetchBW(0, '1920x1080.webp'));
    } else if (document.body.style.backgroundImage == ''
    || document.body.style.backgroundImage == `url("${ec.background.default}")`) {
        setTimeout(fetchBW.bind());
    }
    if (location.protocol == 'file:') setTimeout(time.bind(), 1e4);
}

async function waiter() {
    await fetch(ec.origin + '/connect')
        .then(() => setTimeout(onConnected.bind(), 1e3))
        .catch(() => setTimeout(waiter.bind(), 1e4));
}

setTimeout(waiter.bind());
