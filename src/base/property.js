export default function () {
  window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
      const ec = globalThis.ec;
      if (properties.background) {
        ec.background.set(`file:///${properties.background.value}`);
      }
      if (properties.breakon) {
        ec.exam.build(properties.breakon.value);
      }
      if (properties.finalonly) {
        ec.properties.finalonly = properties.finalonly.value;
        ec.exam.build();
      }
      if (properties.hitokoto) {
        ec.properties.hitokoto = properties.hitokoto.value;
      }
      if (properties.bingwallpaper) {
        ec.properties.bingwallpaper = properties.bingwallpaper.value
      }
      if (properties.extraexams) {
        if (ec.online) ec.exam.extra.fetch(properties.extraexams.value);
        else ec.exam.extra.url = properties.extraexams.value;
      }
    }
  };
  if (location.protocol !== 'file:') setTimeout(() => ec.exam.extra.fetch())
}
