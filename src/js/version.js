!function () {
  let version = new Date("2024/01/22");
  if (typeof ec.update == "undefined") ec.version = version;
  else ec.update.version = version;
}();
