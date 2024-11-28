export const store = window.electronStore

export function init(ec) {
    if ("undefined" !== typeof store) {
        ec.getSettings = store.get.bind()
        ec.applySettings = ec.properties.user.apply.bind()
        ec.getAndApplySettings = async () => {
            ec.applySettings(await ec.getSettings())
        }

        store.onApply(ec.getAndApplySettings)

        // store.hitokotoChange(ec.plugin.hitokoto.change.bind(ec.plugin.hitokoto))
    }
}