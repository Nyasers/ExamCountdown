import { load } from '@tauri-apps/plugin-store'

const store = await load('config.json', { autoSave: true })

export async function get_config() {
    if ("undefined" == typeof await store.get('config'))
        await store.set('config', {})
    const config = await store.get('config')
    console.log(config)
    return config
}

export async function set_config(config) {
    console.log(config)
    await store.set('config', config)
    await store.save()
}