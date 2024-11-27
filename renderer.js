window.onload = function () {
    const ec = globalThis.ec;
    const api = window.electronAPI;

    ec.getSettings = api.getSettings.bind()
    ec.applySettings = ec.properties.user.apply.bind()
    ec.getAndApplySettings = async () => {
        ec.applySettings(await ec.getSettings())
    }

    api.applySettings(ec.getAndApplySettings)

    // api.hitokotoChange(ec.plugin.hitokoto.change.bind(ec.plugin.hitokoto))
}