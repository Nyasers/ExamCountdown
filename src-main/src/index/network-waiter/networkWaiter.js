import { ec } from '../ec.js'

export default async function (onConnected, delay = 1000, retryDelay = 10000) {
    if (TAURI || !!globalThis.isTauri) globalThis.fetch = (await import('@tauri-apps/plugin-http')).fetch

    function waiter() {
        fetch(ec.connecttest)
            .then(_ => setTimeout(onConnected.bind(), delay))
            .catch(e => {
                console.error("Network is not ready", e);
                setTimeout(waiter.bind(), retryDelay);
            });
    }

    setTimeout(waiter.bind(globalThis));
}