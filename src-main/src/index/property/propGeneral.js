export const propGeneral = {};

propGeneral.fps = {
  value: 0,
  func: (
    /**
    * @param {Number} value 
    */
    function (value) {
      this.fps.value = value
    }
  ).bind(propGeneral)
};

export const applyGeneralProperties = (function (properties) {
  if (properties.fps)
    this.fps.func(properties.fps.value);
}).bind(propGeneral);
