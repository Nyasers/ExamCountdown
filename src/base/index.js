import $ from 'jquery';
import main from './main.js';
import extension from './extension.js';
import '../../cache/index.css';

// Expose $ and ec
globalThis.$ = $;
globalThis.ec = {};

// Init
main();

// Set version
ec.version = new Date(VERSION);

// Fetch extension
ec.extension = extension;
setTimeout(() => ec.extension.fetch(6));

// Try something new
import Time from './time.js';
globalThis.Time = Time;
