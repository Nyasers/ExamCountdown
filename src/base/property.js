function setBackground(url) {
  if (document.body)
    document.body.style.backgroundImage = `url('${url}')`;
  else
    console.warn(`Body is ${typeof document.body}`);
}

export default function () {
  window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
      if (properties.background) {
        setBackground(`file:///${properties.background.value}`);
      }
    }
  };
  if (location.protocol !== 'file:') setBackground("default.jpg");
}
