import { ec } from '../ec.js'
import { fetch } from '@tauri-apps/plugin-http'

export default function (onConnected, delay = 1000, retryDelay = 10000) {
    function waiter() {
        fetch(ec.connecttest)
            .then(_ => setTimeout(onConnected.bind(), delay))
            .catch(e => {
                console.error("Fetch error:", e);
                setTimeout(waiter.bind(), retryDelay);
            });
    }

    setTimeout(waiter.bind(globalThis));
}