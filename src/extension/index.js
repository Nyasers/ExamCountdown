import update from './update.js'
import hitokoto from "./hitokoto.js";
import bingwallpaper from './bingwallpaper.js';
import '../../cache/extension.css';

// Avoid duplicate runs
if ('undefined' != typeof ec.extension) delete ec.extension;
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

// Fetch Bing Wallpaper
globalThis.FetchBW = bingwallpaper;
setTimeout(bingwallpaper);
