import $ from 'jquery';
import { ec } from './ec.js';
import main from './main.js';
import { networkWaiter } from './network-waiter/networkWaiter.js';
import '../../cache/index.css';

import { init as initBW } from '../plugin/BingWallpaper/index.js';
import { init as initHitokoto } from '../plugin/Hitokoto/index.js';

let createTray, attachWallpaper, detachWallpaper;
if (TAURI) ({ createTray, attachWallpaper, detachWallpaper } = await import('./tauri.js'));

// Expose
globalThis.$ = $;
globalThis.ec = ec;
globalThis.Time = () => new Date;

// Event
if (TAURI) window.onclose = detachWallpaper;

// Init
main(globalThis, ec)
    .then(async () => {
        if (TAURI) {
            await attachWallpaper();
            if (!globalThis.tray)
                globalThis.tray = await createTray();
        }
    });

// wait for online
networkWaiter((async function () {
    this.online = true;

    // setTimeout(() => this.updater.fetch());
    // setTimeout(() => this.exam.extra.fetch());

    initBW(this);
    if (location.protocol !== 'file:') {
        setTimeout(async () => this.background.set(await this.plugin.bingWallpaper.fetch(0, '1920x1080.webp')));
    } else if (document.body.style.backgroundImage == ''
        || this.properties.user.bingwallpaper.value == true) {
        setTimeout(async () => this.background.set(await this.plugin.bingWallpaper.fetch()));
    }

    initHitokoto(this);
    // if (location.protocol == 'file:') setTimeout(time.bind(), 10000);
}).bind(ec));
