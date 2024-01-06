window.wallpaperPropertyListener = {
  applyUserProperties: function (properties) {
    if (properties.background) {
       setBackground(`file:///${properties.background.value}`);
    }
  }
};

if (location.protocol !== 'file:') setBackground("src/default.jpg");