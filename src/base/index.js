import $ from 'jquery';
import time from './time.js';
import main from './main.js';
import extension from './extension.js';
import '../../cache/index.css';

// Expose $ and ec
globalThis.$ = $;
globalThis.ec = {};

// Init
main();
time();

// Set version
ec.version = new Date(VERSION);

// Fetch extension
ec.extension = extension;
setTimeout(() => ec.extension.fetch(6));
