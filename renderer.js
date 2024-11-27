ec.getSettings = electronAPI.getSettings.bind()

electronAPI.applySettings(async () => {
    const settings = await ec.getSettings()
    ec.properties.user.breakon.func(settings.breakon)
    ec.properties.user.finalonly.func(settings.finalonly)
    ec.properties.user.background.func(settings.background)
    ec.properties.user.bingwallpaper.func(settings.bingwallpaper)
    // ec.properties.user.exams.func(settings.exams)
})