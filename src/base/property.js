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
      if (properties.shsee) {
        if (properties.shsee.value == true) {
          ec.exam.build('中考');
        } else {
          ec.exam.build('高考');
        }
      }
    }
  };
  if (location.protocol !== 'file:') setBackground("default.jpg");
}
