function setBackground(url) {
  if (document.body)
    document.body.style.backgroundColor = 'none',
      document.body.style.backgroundImage = `url('${url}')`;
  else
    console.error(`Body is ${typeof document.body}`);
}

export default function () {
  window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
      const ec = globalThis.ec;
      if (properties.background) {
        setBackground(`file:///${properties.background.value}`);
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
  if (location.protocol !== 'file:') setTimeout(() => (ec.exam.extra.fetch(), setTimeout(() => setBackground("default.webp"))));
}
