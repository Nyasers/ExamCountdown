import { ec } from '../ec.js'

export default function(onConnected, delay = 1000, retryDelay = 10000) {
    async function waiter() {
        await fetch(ec.origin + '/connect')
            .then(() => setTimeout(onConnected.bind(), delay))
            .catch(() => setTimeout(waiter.bind(), retryDelay))
    }

    setTimeout(waiter.bind(globalThis))
}
