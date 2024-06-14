import update from './update.js'

// Avoid duplicate runs
if ('undefined' != typeof ec.extension) ec.updater = ec.extension;
if ('undefined' != typeof ec.updater) delete ec.updater;
else throw new Error('Duplicate Runs Not Allowed.');

// Init update
ec.update = update;
ec.update.version = new Date(VERSION);

// check update
setTimeout(() => {
  if (ec.update && ec.update.check()) ec.update.notice();
}, 1e3);
