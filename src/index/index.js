import $ from 'jquery';
import main from './main.js';
import '../../cache/index.css';
import { ec } from './ec.js';
import fetchBW from "../plugin/BingWallpaper/bing-wallpaper.js";
import time from "./time.js";
import { networkWaiter } from './network-waiter/networkWaiter.js';

// Expose $ and ec
globalThis.$ = $;
globalThis.ec = ec

// Init
main();

// wait for online
networkWaiter((async function() {
    ec.online = true;
    setTimeout(ec.extension.fetch.bind());
    setTimeout(() => ec.exam.extra.fetch());
    if (location.protocol !== 'file:') {
        setTimeout(() => fetchBW(0, '1920x1080.webp'));
    } else if (document.body.style.backgroundImage == ''
        || ec.properties.bingwallpaper.value == true) {
        setTimeout(fetchBW.bind());
    }
    if (location.protocol == 'file:') setTimeout(time.bind(), 10000);
}));
