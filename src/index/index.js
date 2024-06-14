import $ from 'jquery';
import { ec } from './ec.js';
import main from './main.js';
import '../../cache/index.css';
import { init as initHitokoto } from '../plugin/Hitokoto/index.js';
import { init as initBW } from '../plugin/BingWallpaper/index.js';
//import time from "./time.js";
import { networkWaiter } from './network-waiter/networkWaiter.js';

// Expose
globalThis.$ = $;
globalThis.ec = ec
globalThis.Time = () => new Date;

// Init
main();

// wait for online
networkWaiter((async function () {
    ec.online = true;
    setTimeout(() => ec.updater.fetch());
    setTimeout(() => ec.exam.extra.fetch());

    initHitokoto();

    initBW(ec);
    if (location.protocol !== 'file:') {
        setTimeout(async () => ec.background.set(await ec.plugin.bingWallpaper.fetch(0, '1920x1080.webp')));
    } else if (document.body.style.backgroundImage == ''
        || ec.properties.user.bingwallpaper.value == true) {
        setTimeout(async () => ec.background.set(await ec.plugin.bingWallpaper.fetch()));
    }

    // if (location.protocol == 'file:') setTimeout(time.bind(), 10000);
}));
