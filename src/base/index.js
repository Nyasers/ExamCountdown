import $ from 'jquery';
import time from './time.js';
import main from './main.js';
import extension from './extension.js';
import fetchBW from "../base/bingwallpaper.js";
import '../../cache/index.css';

// Expose $ and ec
globalThis.$ = $;
globalThis.ec = {};

// Init
main();
if (location.protocol == 'file:') setTimeout(time);

// Set version
ec.version = new Date(VERSION);

// Fetch extensions
ec.extension = extension;
setTimeout(ec.extension.fetch);

// Fetch Bing Wallpaper
globalThis.fetchBW = fetchBW;
if (location.protocol !== 'file:') {
  setTimeout(() => fetchBW(0, '1920x1080.webp'));
} else if (document.body.style.backgroundImage == ''
  || document.body.style.backgroundImage == 'url("file:///C%3A/Windows/Web/Wallpaper/Windows/img0.jpg")') {
  setTimeout(() => fetchBW());
}
