import { load } from '@tauri-apps/plugin-store'

const store = await load('config.json', { autoSave: true })

export async function get_config() {
    if (!await store.get('config'))
        store.set('config', {})
    const res = await store.get('config')
    console.log(res)
    return res
}

export async function set_config(config) {
    console.log(config)
    await store.set('config', config)
    await store.save()
}