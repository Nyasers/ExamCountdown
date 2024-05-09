import $ from 'jquery';
import time from './time.js';
import main from './main.js';
import extension from './extension.js';
import fetchBW from "../base/bingwallpaper.js";
import '../../cache/index.css';

// Expose $ and ec
globalThis.$ = $;
globalThis.ec = {};

// Init
main();
ec.version = new Date(VERSION);
ec.extension = extension;
ec.fetchBW = fetchBW;

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
    if (true/*isConnected()*/) {
        setTimeout(onConnected.bind());
    } else {
        setTimeout(waitter.bind(), 1e4);
    }
}

waitter();