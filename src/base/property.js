export default function () {
  window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
      const ec = globalThis.ec;
      if (properties.background) {
        ec.properties.background.func(`file:///${properties.background.value}`);
      }
      if (properties.breakon) {
        ec.properties.breakon.func(properties.breakon.value);
      }
      if (properties.finalonly) {
        ec.properties.finalonly.func(properties.finalonly.value);
      }
      if (properties.hitokoto) {
        ec.properties.hitokoto.func(properties.hitokoto.value);
      }
      if (properties.bingwallpaper) {
        ec.properties.bingwallpaper.func(properties.bingwallpaper.value);
      }
      if (properties.extraexams) {
        ec.properties.extraexams.func(properties.extraexams.value);
      }
    }
  };
  if (location.protocol !== 'file:') setTimeout(() => ec.exam.extra.fetch())
}
