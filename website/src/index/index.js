import $ from 'jquery';
import { ec } from './ec.js';
import main from './main.js';
import { networkWaiter } from './network-waiter/networkWaiter.js';
import '../../cache/index.css';

import { init as initRenderer } from './renderer.js';
import { init as initBW } from '../plugin/BingWallpaper/index.js';
import { init as initHitokoto } from '../plugin/Hitokoto/index.js';

// Expose
globalThis.$ = $;
globalThis.ec = ec;
globalThis.Time = () => new Date;

// Init
main(globalThis, ec);

// Init renderer
initRenderer(ec);

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
