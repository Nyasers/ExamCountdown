const { $, ec } = window;

if (ec.extension) delete ec.extension;
if (location.origin == "file://") {
  setTimeout(() => {
    if (ec.update && ec.update.check()) ec.update.notice();
  }, 1e3);
}
