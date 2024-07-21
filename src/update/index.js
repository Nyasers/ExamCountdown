import update from './update.js'

// Avoid duplicate runs
if ('undefined' != typeof ec.update) delete ec.update;
else throw new Error('Duplicate Runs Not Allowed.');

// Init update
ec.update = update;
ec.update.version = new Date(VERSION);

// check update
setTimeout(() => {
  if (ec.update && ec.update.check()) ec.update.notice();
}, 1e3);
