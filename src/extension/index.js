import update from './update.js'
import hitokoto from "./hitokoto.js";
import '../../cache/extension.css';

// For old versions
if ('undefined' == typeof ec.extable) ec.extable = {};
if ('undefined' == typeof ec.extable.hitokoto) ec.extable.hitokoto = true;

// Avoid duplicate runs
if ('undefined' != typeof ec.extension.main) delete ec.extension.main;
else throw new Error('Duplicate Runs Not Allowed.');

// Init update
ec.update = update;
ec.update.version = new Date(VERSION);

// check update
setTimeout(() => {
  if (ec.update && ec.update.check()) ec.update.notice();
}, 1e3);

// Init hitokoto
$("ul#main").append($('<li class="hitokoto"></li>'));
ec.hitokoto = hitokoto;
