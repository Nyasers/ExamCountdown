!function () {
  let version = new Date("2024/01/14 15:55");
  if (typeof ec.update == "undefined") ec.version = version;
  else ec.update.version = version;
}();
