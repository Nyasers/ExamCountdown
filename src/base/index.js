import $ from 'jquery';
import time from './time.js';
import { applyImageUrl } from './applyImage.js';
import main from './main.js';
import extension from './extension.js';
import fetchBW from "../base/bingwallpaper.js";
import '../../cache/index.css';

// Expose $ and ec
globalThis.$ = $;
globalThis.ec = {
    origin: location.protocol == 'file:' ? 'https://ec.nyaser.top' : location.origin,
    version: new Date(VERSION),
    extable: {
        hitokoto: true
    },
    background: {
        set: applyImageUrl.bind()
    },
    extension: extension,
    fetchBW: fetchBW.bind(),
    hitokoto: undefined
};

// Init
main();

// wait for online
async function onConnected() {
    if (location.protocol == 'file:') setTimeout(time.bind());
    setTimeout(ec.extension.fetch.bind());
    if (location.protocol !== 'file:') {
        setTimeout(() => fetchBW(0, '1920x1080.webp'));
    } else if (document.body.style.backgroundImage == ''
        || document.body.style.backgroundImage == 'url("file:///C%3A/Windows/Web/Wallpaper/Windows/img0.jpg")') {
        setTimeout(fetchBW.bind());
    }
}

async function waitter() {
    await fetch(ec.origin + '/connect')
        .then(() => setTimeout(onConnected.bind(), 1e3))
        .catch(() => setTimeout(waitter.bind(), 1e4));
}

setTimeout(waitter.bind(), 1e4);
