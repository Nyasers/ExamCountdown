import time from './time.js';
import fetchBW from "./bing-wallpaper.js";

export function networkWaiter() {
    async function onConnected() {
        ec.online = true;
        setTimeout(ec.extension.fetch.bind());
        setTimeout(() => ec.exam.extra.fetch());
        if (location.protocol !== 'file:') {
            setTimeout(() => fetchBW(0, '1920x1080.webp'));
        } else if (document.body.style.backgroundImage == ''
            || ec.properties.bingwallpaper == true) {
            setTimeout(fetchBW.bind());
        }
        if (location.protocol == 'file:') setTimeout(time.bind(), 10000);
    }

    async function waiter() {
        await fetch(ec.origin + '/connect')
            .then(() => setTimeout(onConnected.bind(), 1000))
            .catch(() => setTimeout(waiter.bind(), 10000));
    }

    setTimeout(waiter.bind(globalThis));
}
