import { ec } from '../ec.js'
import { fetch } from '@tauri-apps/plugin-http'

export default function (onConnected, delay = 1000, retryDelay = 10000) {
    async function waiter() {
        const res = await fetch(ec.connecttest, { method: null })
        if (res.status == 400) setTimeout(onConnected.bind(), delay)
        else setTimeout(waiter.bind(), retryDelay)
    }

    setTimeout(waiter.bind(globalThis))
}
