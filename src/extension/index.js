// import invert from 'invert-color';
import update from './update.js'
import hitokoto from "./hitokoto.js";
import fetchBW from './bingwallpaper.js';
import { themeColor } from './themecolor.js';
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
globalThis.fetchBW = fetchBW;
if (location.protocol !== 'file:') {
  setTimeout(() => fetchBW(0, '1920x1080.webp'));
} else if (document.body.style.backgroundImage == ''
  || document.body.style.backgroundImage == 'url("file:///C%3A/Windows/Web/Wallpaper/Windows/img0.jpg")') {
  setTimeout(() => fetchBW());
}

// Color
globalThis.themeColor = themeColor;
// globalThis.invertColor = invert;
