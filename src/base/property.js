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
        ec.exam.finalonly = properties.finalonly.value;
        ec.exam.build();
      }
      if (properties.hitokoto) {
        ec.extable.hitokoto = properties.hitokoto.value;
      }
      if (properties.extraexams) {
        ec.exam.extra.fetch(properties.extraexams.value);
      }
    }
  };
  if (location.protocol !== 'file:') setTimeout(() => ec.exam.extra.fetch())/*, setTimeout(setBackground, 1e3)*/;
}
